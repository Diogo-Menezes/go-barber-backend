import {Repository, getRepository} from 'typeorm';

import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";
import UserTokens from "@modules/users/infra/typeorm/entity/UserTokens";

export default class UsersTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserTokens>;

  constructor() {
    this.ormRepository = getRepository(UserTokens);
  }

  public async findByToken(token: string): Promise<UserTokens | undefined> {
    const usertoken = await this.ormRepository.findOne({
      where: {token}
    });
    return usertoken;
  }

  public async generate(user_id: string): Promise<UserTokens> {
    const userToken = this.ormRepository.create({user_id})

    await this.ormRepository.save(userToken);

    return userToken;
  }
}
