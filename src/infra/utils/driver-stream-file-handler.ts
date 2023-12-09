import { ReadStream, StreamFileHandler } from '@/core/drivers/download-drivers.usecase';
import { storage } from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';
import { DeviceEventEmitter } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
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
    BackgroundFetch.configure(
      {
        stopOnTerminate: false,
      },
      async (taskId) => {
        const { size } = await RNFetchBlob.fs.stat(stream.path);

        let counterRows = 0;

        stream.open();
        const startTime = new Date().getTime();

        stream.onData(this.handleData(size, stream.bufferSize, counterRows));

        stream.onError(async (err) => {
          console.log('oops', err);

          DeviceEventEmitter.emit('running-task', true);
          BackgroundFetch.finish(taskId);
        });

        stream.onEnd(async () => {
          DeviceEventEmitter.emit('running-task', true);

          await RNFetchBlob.fs.unlink(stream.path);

          console.log(`Time taken: ${formatDistanceToNow(startTime, { includeSeconds: true })}`);

          BackgroundFetch.finish(taskId);
        });
      },
      (taskId) => {
        console.log(`Background fetch failed: ${taskId}`);
        BackgroundFetch.finish(taskId);
      }
    );

    BackgroundFetch.scheduleTask({
      taskId: 'com.melk_de_sousa.pocqueue.driver_update',
      forceAlarmManager: true,
      delay: 500,
      periodic: false,
    });
  }
}
