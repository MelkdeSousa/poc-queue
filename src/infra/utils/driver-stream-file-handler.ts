import { ReadStream, StreamFileHandler } from '@/core/drivers/download-drivers.usecase';
import { storage } from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, DeviceEventEmitter } from 'react-native';
import backgroundServer from 'react-native-background-actions';
import RNFetchBlob from 'react-native-blob-util';
import { readString } from 'react-native-csv';
import Realm from 'realm';
import { realmConnection } from '../realm/connection';
import { DriverModel } from '../realm/models/Driver';

export class DriverStreamFileHandler implements StreamFileHandler {
  private handleData(
    size: number,
    bufferSize: number,
    counterRows = 0,
    buffer = '',
    currentSizeRead = 0
  ) {
    return async (chunk: string) => {
      // append the buffer to the chunk
      chunk = buffer + chunk;
      buffer = '';

      const lastCaracter = chunk[chunk.length - 1];
      // check if the chunk ends with a broken line
      if (lastCaracter !== '\n') {
        // find the last newline character
        const lastNewlineIndex = chunk.lastIndexOf('\n');
        if (lastNewlineIndex !== -1) {
          // buffer the broken line
          buffer = chunk.substring(lastNewlineIndex + 1);
          // remove the broken line from the chunk
          chunk = chunk.substring(0, lastNewlineIndex + 1);
        } else {
          // no newline character, buffer the entire chunk
          buffer = chunk;
          chunk = '';
        }
      }

      const formattedChunk = readString(chunk)
        .data.filter((row: string[]) => row.every((v) => !!v))
        .map((row) => ({
          status: row[0],
          cnh: row[1],
          name: row[2],
          state: row[3],
        }));

      realmConnection.write(() => {
        formattedChunk.forEach((driver) => {
          realmConnection.create<DriverModel>(
            'Driver',
            {
              _id: new Realm.BSON.ObjectId(),
              name: driver.name,
              cnh: driver.cnh,
              state: driver.state,
            },
            Realm.UpdateMode.Modified
          );
        });
      });

      counterRows += formattedChunk.length;
      currentSizeRead += bufferSize;

      const percentage = Math.floor((currentSizeRead / size) * 100);

      storage.set('@percentage', percentage);

      DeviceEventEmitter.emit('read-file', percentage);
    };
  }

  async execute(stream: ReadStream): Promise<void> {
    await backgroundServer.start(
      async () => {
        const { size } = await RNFetchBlob.fs.stat(stream.path);

        let counterRows = 0;

        stream.open();
        const start = new Date();

        await backgroundServer.updateNotification({
          taskDesc: 'Atualizando dados dos condutores',
        });

        stream.onData(this.handleData(size, stream.bufferSize, counterRows));

        stream.onError(async (err) => {
          console.log('oops', err);
          DeviceEventEmitter.emit('running-task', true);
        });

        stream.onEnd(async () => {
          DeviceEventEmitter.emit('running-task', true);

          await RNFetchBlob.fs.unlink(stream.path);

          await backgroundServer.stop();

          Alert.alert(
            'Atualização Finalizada!',
            'Feita em: ' + formatDistanceToNow(start, { includeSeconds: true, locale: ptBR })
          );
        });
      },
      {
        taskName: 'driver-update',
        taskTitle: 'Atualização de dados',
        taskDesc: 'Atualizando dados dos condutores',
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
      }
    );
  }
}
