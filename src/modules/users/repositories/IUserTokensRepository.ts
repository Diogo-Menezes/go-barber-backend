import UserTokens from "@modules/users/infra/typeorm/entity/UserTokens";

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserTokens>;

  findByToken(token: string): Promise<UserTokens | undefined>
}
