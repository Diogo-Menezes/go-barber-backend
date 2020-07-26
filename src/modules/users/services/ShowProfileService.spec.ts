import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "@modules/users/providers/hashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";
import AppError from "@shared/errors/AppError";
import ShowProfileService from "@modules/users/services/ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  })

  it('should be able to view the profile', async () => {

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    const showUser = await showProfileService.execute({
      user_id: user.id,
    })

    expect(showUser).toBe(user)

  })
  it('should not be able to view the profile of non-existing user', async () => {


    await expect(showProfileService.execute({
      user_id: 'invalid-user-id',
    })).rejects.toBeInstanceOf(AppError);

  })

});
