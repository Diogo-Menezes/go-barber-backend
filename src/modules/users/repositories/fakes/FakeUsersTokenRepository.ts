import {uuid} from "uuidv4";
import UserTokens from "@modules/users/infra/typeorm/entity/UserTokens";
import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";


export default class FakeUserTokenRepository implements IUserTokensRepository {
  private userTokens: UserTokens[] = [];

  public async generate(user_id: string): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    } as UserTokens)

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserTokens | undefined> {
    return this.userTokens.find(userToken => userToken.token === token);
  }
}
