import "reflect-metadata";
import {inject, injectable} from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entity/User';
import IUsersRepository from "../repositories/IUsersRepository";

interface Request {
  user_id: string;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
  }

  public async execute({user_id}: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('Invalid user')

    return user;
  }
}
