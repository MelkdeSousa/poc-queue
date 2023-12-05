import { PermissionsAndroid } from 'react-native';

export type ReadStream = {
  open(): void;
  onData(fn: (chunk: string | number[]) => void): void;
  onError(fn: (err: any) => void): void;
  onEnd(fn: () => void): void;
};

export type FileManager = {
  load(): Promise<string>;
  read(path: string): Promise<ReadStream>;
};

export type StreamFileHandler = {
  execute(stream: ReadStream): Promise<void>;
};

export class DownloadDriversUseCase {
  constructor(
    private fileSystem: FileManager,
    private handler: StreamFileHandler
  ) {}

  async execute() {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    const path = await this.fileSystem.load();

    // /data/data/com.pocqueue/files/drivers.csv

    const stream = await this.fileSystem.read(path);

    await this.handler.execute(stream);
  }
}
