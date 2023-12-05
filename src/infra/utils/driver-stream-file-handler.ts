import { ReadStream, StreamFileHandler } from '@/core/drivers/download-drivers.usecase';
import { StartOptions } from '@/lib/tasks';
import { differenceInMinutes } from 'date-fns';
import BackgroundService from 'react-native-background-actions';

export class DriverStreamFileHandler implements StreamFileHandler {
  execute(stream: ReadStream): Promise<void> {
    const options: StartOptions = {
      taskName: 'download-drivers',
      taskTitle: 'Atualizando dados do condutores',
      taskDesc: '',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
    };

    return BackgroundService.start(async () => {
      let counterRows = 0;

      const start = new Date();

      stream.open();

      stream.onData((chunk) => {
        counterRows += 1;
        console.log({ counterRows });
      });

      stream.onError(async (err) => {
        console.log('oops', err);
        await BackgroundService.stop();
      });

      stream.onEnd(() => {
        console.log(`Rows: ${counterRows}`);
        console.log(`File readed at: ${differenceInMinutes(new Date(), start)}`);
      });
    }, options);
  }
}
