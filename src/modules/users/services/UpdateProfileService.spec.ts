import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "@modules/users/providers/hashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
  })

  it('should be able to update the profile', async () => {

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh D.',
      email: 'jonhd@example.com',
    })

    expect(updatedUser.name).toBe('Jonh D.')
    expect(updatedUser.email).toBe('jonhd@example.com')

  })

  it('should not be able to change to an email already in use', async () => {
    await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@example.com",
      password: '123456',
    })

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh D.',
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError)

  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh D.',
      email: 'johndoe@example.com',
      password: "123123",
      old_password: '123456',
    });

    expect(updatedUser.password).toBe("123123")

  });

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh D.',
      email: 'johndoe@example.com',
      password: "123123",
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh D.',
      email: 'johndoe@example.com',
      old_password: 'wrong-old-password',
      password: "123123",
    })).rejects.toBeInstanceOf(AppError);

  });
});
