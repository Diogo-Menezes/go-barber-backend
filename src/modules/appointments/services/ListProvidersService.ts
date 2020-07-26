import User from '@modules/users/infra/typeorm/entity/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToPlain } from 'class-transformer';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

interface Request {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    // let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`)
    let users;
    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });
    }

    await this.cacheProvider.save(
      `providers-list:${user_id}`,
      classToPlain(users),
    );

    return users.map(user => {
      delete user.password;
      return user;
    });
  }
}
