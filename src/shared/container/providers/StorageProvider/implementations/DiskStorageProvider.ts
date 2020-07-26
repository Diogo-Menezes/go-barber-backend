import fs from "fs";
import path from 'path';
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";
import uploadConfig from '@config/upload'

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpDir, file),
      path.resolve(uploadConfig.uploadDir, file)
    )
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadDir, file);

    try {
      await fs.promises.stat(filePath)
    } catch (e) {
      return;
    }

    await fs.promises.unlink(filePath)
  }

}
