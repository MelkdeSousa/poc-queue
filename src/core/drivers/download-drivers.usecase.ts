import { envs } from '@/infra/config/env';
import { extractDataFromS3URL } from '@/infra/utils/extractDataFromS3URL';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export class DownloadDriversUsecase {
  async execute() {
    // solicitar permissões
    // fazer o download do arquivo com os dados e salvar localmente
    // retornar o caminho do arquivo
    // ler o arquivo e retornar os dados
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      // PermissionsAndroid.PERMISSIONS.DOWNLOAD_COMPLETE,
      // PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
    ]);
    const path = await downloadDriversFromS3();
    console.log(
      '🚀 ~ file: download-drivers.usecase.ts:21 ~ DownloadDriversUsecase ~ execute ~ path:',
      path
    );

    // readFile(path);
  }
}

function readFile(path: string) {
  let data = '';

  RNFetchBlob.fs.readStream(path, 'utf8').then((stream) => {
    stream.open();

    stream.onData((chunk) => {
      console.log({ chunk });
      data += chunk;
    });

    stream.onError((err) => {
      console.log('oops', err);
    });

    stream.onEnd(() => {
      console.log({ data });
    });
  });
}

async function downloadDriversFromS3() {
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

  try {
    const response = await RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Baixando dados dos condutores',
        mime: 'text/csv',
      },
    }).fetch('GET', url, {});

    return response.path();
  } catch (error) {
    console.log(error);

    throw error;
  }
}
