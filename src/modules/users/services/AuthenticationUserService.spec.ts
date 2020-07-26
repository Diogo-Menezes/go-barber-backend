import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AuthenticationUserService from "@modules/users/services/AuthenticationUserService";
import CreateUserService from "@modules/users/services/CreateUserService";
import FakeHashProvider from "@modules/users/providers/hashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";
import FakeCacheRepository from "@shared/container/providers/CacheProvider/fakes/FakeCacheRepository";


let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticationUserService: AuthenticationUserService;
let createUserService: CreateUserService;
let fakeCacheRepository: FakeCacheRepository;

describe('AuthenticationService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheRepository = new FakeCacheRepository();
    authenticationUserService = new AuthenticationUserService(
      fakeUsersRepository, fakeHashProvider);
    createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheRepository);
  })

  it('should be able to authenticate', async () => {

    const user = await createUserService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    })

    const response = await authenticationUserService.execute({
      email: "johndoe@example.com",
      password: "123456"
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);

  })

  it('should not be able to authenticate with a wrong email', async function () {
    await expect(authenticationUserService.execute({
      email: "johndoe@mail.com",
      password: "123456"
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async function () {
    const user = await createUserService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    })

    await expect(authenticationUserService.execute({
      email: "johndoe@example.com",
      password: "000000"
    })).rejects.toBeInstanceOf(AppError);
  });
})
