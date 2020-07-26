import "reflect-metadata";
import {inject, injectable} from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entity/User';
import IUserRepository from '../repositories/IUsersRepository';
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

interface Request {
  userId: string;
  avatarFileName: string;
}
@injectable()
class UpdateUserAvatarService {
  constructor
  (@inject('UsersRepository')
  private usersRepository: IUserRepository,

  @inject('StorageProvider')
  private storageProvider:IStorageProvider,
  ) { }

  public async execute({ userId, avatarFileName }: Request): Promise<User> {

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Only registered users can change the avatar', 401);
    }

    if (user.avatar) {
     await this.storageProvider.deleteFile(user.avatar)
    }

    user.avatar = await this.storageProvider.saveFile(avatarFileName);

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
