import { DownloadDriversUseCase } from '@/core/drivers/download-drivers.usecase';
import { DriverFileManager } from '@/infra/utils/driver-file-manager';
import { DriverStreamFileHandler } from '@/infra/utils/driver-stream-file-handler';

const downloadDriversUseCase = new DownloadDriversUseCase(
  new DriverFileManager(),
  new DriverStreamFileHandler()
);

export const handleDrivers = async () => await downloadDriversUseCase.execute();
