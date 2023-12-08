import { FileManager, ReadStream } from '@/core/drivers/download-drivers.usecase';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import RNFetchBlob from 'react-native-blob-util';
import { envs } from '../config/env';
import { extractDataFromS3URL } from './extractDataFromS3URL';

export class DriverFileManager implements FileManager {
  async load(): Promise<string> {
    const { bucket, key, region } = extractDataFromS3URL(envs.AWS_DRIVER_LOAD);

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

    try {
      const path = `${RNFetchBlob.fs.dirs.CacheDir}/driver.csv`;
      await RNFetchBlob.config({
        path,
      }).fetch('GET', url, {
        'Content-Type': 'text/csv',
      });

      return path;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  read(path: string): Promise<ReadStream> {
    return RNFetchBlob.fs.readStream(path, 'utf8', 4096);
  }
}
