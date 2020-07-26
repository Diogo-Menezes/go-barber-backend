import {injectable, inject} from 'tsyringe';
import {differenceInHours} from 'date-fns';

import IUserRepository from '../repositories/IUsersRepository';
import AppError from "@shared/errors/AppError";
import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";
import IHashProvider from "@modules/users/providers/hashProvider/models/IHashProvider";
import User from "@modules/users/infra/typeorm/entity/User";
import {isUuid} from "uuidv4";


interface IRequest {
  password: string;
  token: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {
  }

  public async execute({password, token}: IRequest): Promise<User> {

    if (!isUuid(token)) throw new AppError('Invalid Token')

    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token is not valid');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('Not a valid user');

    const {created_at} = userToken;

    if (differenceInHours(new Date(Date.now()), created_at) > 2) {
      throw new AppError('Token is expired')
    }

    user.password = await this.hashProvider.generateHash(password);

    return await this.usersRepository.save(user);
  }
}


