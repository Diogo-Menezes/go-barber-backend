import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";

let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {

  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )
  })
  it('should be able to upload a file', async () => {

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: 'avatar.png'
    })

    expect(user.avatar).toBe('avatar.png')
  })

  it('should be able to delete the avatar when receiving a new avatar', async () => {

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: '123456',
    })

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: 'avatar.jpg'
    })

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: 'avatar.png'
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar.png')
  })

  it('should not be able to upload a file if the user is not valid', async () => {

    await expect(updateUserAvatarService.execute({
      userId: '12345',
      avatarFileName: 'avatar.png'
    })).rejects.toBeInstanceOf(AppError);
  })
})
