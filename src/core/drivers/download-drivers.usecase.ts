import { envs } from '@/infra/config/env';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import RNFetchBlob from 'react-native-blob-util';


export class DownloadDriversUsecase {
  async execute() {
    // fazer o download do arquivo com os dados e salvar localmente
    // retornar o caminho do arquivo
    // ler o arquivo e retornar os dados
    const path = await downloadDriversFromS3();

    // readFile(path);
  }
}

function readFile(path: string) {
  let data = '';

  RNFetchBlob.fs.readStream(path, 'utf8')
    .then((stream) => {
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
  const docPath = RNFetchBlob.fs.dirs.DocumentDir;

  const path = `${docPath}/drivers.csv`;

  const client = new S3Client({
    credentials: envs.aws,
    region: envs.aws.region,
  });

  const command = new GetObjectCommand({
    Bucket: envs.data.bucket,
    Key: envs.data.key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  try {
    await RNFetchBlob.config({
      path: path,
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Baixando dados dos condutores',
        mime: 'text/csv',
      },
    })
      .fetch('GET', url)

    return path
  } catch (error) {
    console.log(error);

    throw error
  }
}
