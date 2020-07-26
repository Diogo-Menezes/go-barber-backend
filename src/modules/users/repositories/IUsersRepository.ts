import User from '../infra/typeorm/entity/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";


export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>

  create(data: ICreateUserDTO): Promise<User>

  save(user: User): Promise<User>

  findByEmail(email: string): Promise<User | undefined>

  findById(id: string): Promise<User | undefined>
};
