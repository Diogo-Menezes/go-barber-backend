import IUsersRepository from '@modules/users/repositories/IUsersRepository'

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from "@modules/users/infra/typeorm/entity/User";
import {uuid} from "uuidv4";
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";


export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async save(user: User): Promise<User> {
    const findUserIndex = this.users.findIndex(findUser => findUser.id === user.id)
    this.users[findUserIndex] = user;

    return this.users[findUserIndex];
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {id: uuid()}, userData);

    this.users.push(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findAllProviders({except_user_id}:IFindAllProvidersDTO): Promise<User[]> {
    let users = this.users;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id)
    }

    return users;
  }


}
