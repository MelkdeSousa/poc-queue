import { ReadStream, StreamFileHandler } from '@/core/drivers/download-drivers.usecase';
import { differenceInSeconds } from 'date-fns';
import { Alert, DeviceEventEmitter } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

export class DriverStreamFileHandler implements StreamFileHandler {
  async execute(stream: ReadStream): Promise<void> {
    const { size } = await RNFetchBlob.fs.stat(stream.path);

    let buffer = '';
    let data = '';
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

      // process the chunk here

      data = chunk;
      counterRows += data.split('\n').length;
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
