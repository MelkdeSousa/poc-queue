import { DownloadDriversUseCase } from '@/core/drivers/download-drivers.usecase';
import { DriverFileManager } from '@/infra/utils/driver-file-manager';
import { DriverStreamFileHandler } from '@/infra/utils/driver-stream-file-handler';
import BackgroundService from 'react-native-background-actions';

export type StartOptions = Parameters<typeof BackgroundService.start>['1'];

const downloadDriversUseCase = new DownloadDriversUseCase(
  new DriverFileManager(),
  new DriverStreamFileHandler()
);

export const handleDrivers = async () => {
  await downloadDriversUseCase.execute();
};

export const stopTask = async () => {
  // iOS will also run everything here in the background until .stop() is called
  await BackgroundService.stop();
};
