import multer, {StorageEngine} from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolderPath = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpDir: string;
  uploadDir: string;

  multer: { storage: StorageEngine }

  config: {
    disk: {}
    aws: {
      bucket: string;
    }
  }
}


export default {
  driver: process.env.STORAGE_DRIVER,
  tmpDir: tempFolderPath,
  uploadDir: path.resolve(tempFolderPath, 'upload'),
  multer: {
    storage: multer.diskStorage({
      destination: tempFolderPath,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const filename = `${fileHash}-${file.originalname}`;

        return callback(null, filename);
      },
    })
  },

  config: {
    disk: {},
    aws: {
      bucket: 'diogoappgobarber',
    }
  },
} as IUploadConfig;
