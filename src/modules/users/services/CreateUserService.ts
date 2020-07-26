import 'reflect-metadata';
import {injectable, inject} from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entity/User';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from "../providers/hashProvider/models/IHashProvider";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor
  (@inject('UsersRepository')
   private usersRepository: IUserRepository,
   @inject('HashProvider')
   private hashProvider: IHashProvider,
   @inject('CacheProvider')
   private cacheProvider: ICacheProvider,
  ) {
  }

  public async execute({name, email, password}: Request): Promise<User> {


    const findUserExists = await this.usersRepository.findByEmail(email);

    if (findUserExists) {
      throw new AppError('Email already exists');
    }

    const hashedPass = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPass,
    });

    await this.cacheProvider.invalidatePrefix('providers-list')

    return user;
  }
}

export default CreateUserService;
