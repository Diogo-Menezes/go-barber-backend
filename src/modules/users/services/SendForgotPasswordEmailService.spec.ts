import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";
import FakeMailProvider from "@shared/container/providers/EmailProvider/fakes/FakeMailProvider";
import AppError from "@shared/errors/AppError";
import FakeUsersTokenRepository from "@modules/users/repositories/fakes/FakeUsersTokenRepository";


let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;


describe('SendForgotPasswordEmail', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUsersTokenRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository
    );

  })

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    await sendForgotPasswordEmailService.execute({
      email: "johndoe@example.com"
    });

    expect(sendMail).toHaveBeenCalled();
  })
  it('should not be able to recover a password if the user account is not valid', async () => {

    await expect(
      sendForgotPasswordEmailService.execute({
        email: "invalid@mail.com",
      })
    ).rejects.toBeInstanceOf(AppError)

  });
  it('should generate a forgot password token ', async () => {
    const generate = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    await sendForgotPasswordEmailService.execute({
      email: "johndoe@example.com"
    });

    expect(generate).toHaveBeenCalledWith(user.id);

  });
})
