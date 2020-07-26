import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import ListProvidersService from "@modules/appointments/services/ListProvidersService";
import FakeCacheRepository from "@shared/container/providers/CacheProvider/fakes/FakeCacheRepository";

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheRepository: FakeCacheRepository

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheRepository = new FakeCacheRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository, fakeCacheRepository);
  })

  it('should be able to list all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    const user2 = await fakeUsersRepository.create({
      name: "John D.",
      email: "johnd@example.com",
      password: '123456',
    })

    const loggedUser = await fakeUsersRepository.create({
      name: "John",
      email: "john@example.com",
      password: '123456',
    })

    const provides = await listProvidersService.execute({user_id: loggedUser.id})


    expect(provides).toEqual([user1, user2])

  });
});
