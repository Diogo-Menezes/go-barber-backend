import fs from "fs";
import path from 'path';
import aws from 'aws-sdk';
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";
import uploadConfig from '@config/upload'
import S3 from "aws-sdk/clients/s3";
import mime from "mime";

export default class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'eu-west-2',
    })
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpDir, file)

    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = mime.getType(originalPath)

    if (!ContentType) throw new Error('File not found')

    await this.client.putObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }).promise();

    await fs.promises.unlink(originalPath)

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
    }).promise();
  }
}

