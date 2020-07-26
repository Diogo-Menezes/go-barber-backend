import CreateUserService from "@modules/users/services/CreateUserService";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "@modules/users/providers/hashProvider/fakes/FakeHashProvider";
import FakeCacheRepository from "@shared/container/providers/CacheProvider/fakes/FakeCacheRepository";

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheRepository: FakeCacheRepository


describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheRepository = new FakeCacheRepository();
    createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheRepository);

  })
  it('should be able to create a new user', async () => {

    const user = await createUserService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("johndoe@example.com");
    expect(user.password).toBe('123456')

  })

  it('should not be able to create a new user if the email is already in the database', async () => {

    await createUserService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    await expect(createUserService.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    })).rejects.toBeInstanceOf(AppError);
  })
});
