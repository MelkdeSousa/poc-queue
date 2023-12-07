import { ReadStream, StreamFileHandler } from '@/core/drivers/download-drivers.usecase';
import { differenceInSeconds } from 'date-fns';
import { Alert, DeviceEventEmitter } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { readString } from 'react-native-csv';
import { realmConnection } from '../realm/connection';
import { DriverModel } from '../realm/models/Driver';

export class DriverStreamFileHandler implements StreamFileHandler {
  async execute(stream: ReadStream): Promise<void> {
    const { size } = await RNFetchBlob.fs.stat(stream.path);

    let buffer = '';
    let counterRows = 0;
    let currentSizeRead = 0;

    stream.open();
    const start = new Date();

    stream.onData((chunk) => {
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
          buffer = chunk.substr(lastNewlineIndex + 1);
          // remove the broken line from the chunk
          chunk = chunk.substr(0, lastNewlineIndex + 1);
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
          realmConnection.create<DriverModel>('Driver', {
            _id: new Realm.BSON.ObjectId(),
            name: driver.name,
          });
        });
      });

      counterRows += formattedChunk.length;
      currentSizeRead += stream.bufferSize;

      DeviceEventEmitter.emit('read-file', Math.floor((currentSizeRead / size) * 100));
    });

    stream.onError(async (err) => {
      console.log('oops', err);
    });

    stream.onEnd(() => {
      Alert.alert(
        'Atualização Finalizada!',
        'Foram inseridas ' +
          counterRows +
          ' linhas em ' +
          differenceInSeconds(new Date(), start) +
          'sec'
      );
    });
  }
}
