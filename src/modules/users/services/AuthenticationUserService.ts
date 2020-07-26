import {sign} from 'jsonwebtoken';
import {injectable, inject} from 'tsyringe';


import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entity/User';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from "../providers/hashProvider/models/IHashProvider";
import auth from "@config/auth";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticationUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {
  }


  public async execute({email, password}: Request): Promise<Response> {

    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const token = sign({}, auth.jwt.secret, {
      subject: user.id,
      expiresIn: auth.jwt.expiresIn,
    });

    return {user, token};
  }
}

export default AuthenticationUserService;
