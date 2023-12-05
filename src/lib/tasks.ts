import { DownloadDriversUsecase as DownloadDriversUseCase } from '@/core/drivers/download-drivers.usecase';
import BackgroundService from 'react-native-background-actions';

type StartOptions = Parameters<typeof BackgroundService.start>['1'];

const options: StartOptions = {
  taskName: 'download-drivers',
  taskTitle: 'Baixando dados',
  taskDesc: '',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
};

const downloadDriversUseCase = new DownloadDriversUseCase();

export const startTask = async () => {
  try {
    await downloadDriversUseCase.execute();
  } catch (error) {
    await BackgroundService.stop();
  }
};

export const stopTask = async () => {
  // iOS will also run everything here in the background until .stop() is called
  await BackgroundService.stop();
};
