import { FileManager, ReadStream } from '@/core/drivers/download-drivers.usecase';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as FileSystem from 'expo-file-system';
import RNFetchBlob from 'rn-fetch-blob';
import { envs } from '../config/env';
import { extractDataFromS3URL } from './extractDataFromS3URL';

export class DriverFileManager implements FileManager {
  async load(): Promise<string> {
    const { bucket, key, region } = extractDataFromS3URL(envs.AWS_VEHICLE_LOAD);

    const client = new S3Client({
      credentials: {
        accessKeyId: envs.AWS_ACCESS_KEY_ID,
        secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
      },
      region,
    });

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    const path = FileSystem.documentDirectory + 'drivers.csv';
    const downloader = FileSystem.createDownloadResumable(url, path, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });

    try {
      const { uri } = await downloader.downloadAsync();

      return uri;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  read(path: string): Promise<ReadStream> {
    return RNFetchBlob.fs.readStream(path, 'utf8');
  }
}
