import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import FakeUsersTokenRepository from "@modules/users/repositories/fakes/FakeUsersTokenRepository";
import ResetPasswordService from "@modules/users/services/ResetPasswordService";
import FakeHashProvider from "@modules/users/providers/hashProvider/fakes/FakeHashProvider";
import {uuid} from "uuidv4";


let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUsersTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;


describe('ResetPasswordService', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUsersTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );

  })

  it('should be able to reset the password', async () => {

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    const {token} = await fakeUserTokenRepository.generate(user.id)

    await resetPasswordService.execute({
      password: '123123',
      token,
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(updatedUser?.password).toBe('123123');
    expect(generateHash).toBeCalledWith('123123')
  })

  it('should not be able to reset the password with an invalid token', async () => {
    await expect(resetPasswordService.execute({
      password: '123123',
      token: "non-existing-token"
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with an invalid user_id', async () => {
    const userToken = await fakeUserTokenRepository.generate('invalid-user')

    await expect(resetPasswordService.execute({
      password: '123123',
      token: userToken.user_id,
    })).rejects.toBeInstanceOf(AppError)


  });

  it('should not be able to reset the password with expired token', async () => {

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    const {token} = await fakeUserTokenRepository.generate(user.id)

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPasswordService.execute({
      token,
      password: '123123',
    })).rejects.toBeInstanceOf(AppError)
  });
})
