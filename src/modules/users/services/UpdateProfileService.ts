import "reflect-metadata";
import {inject, injectable} from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entity/User';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from "@modules/users/providers/hashProvider/models/IHashProvider";

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {
  }

  public async execute({user_id, name, email, password, old_password}: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('Invalid user')

    const existingEmail = await this.usersRepository.findByEmail(email)

    if (existingEmail && existingEmail.id !== user_id) throw  new AppError('This email is already in use')

    user.name = name;
    user.email = email;

    if (password && !old_password) throw new AppError('Must provide the old password to change the password')


    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('Invalid old password')
      }
      user.password = await this.hashProvider.generateHash(password);
    }


    return this.usersRepository.save(user)


  }
}
