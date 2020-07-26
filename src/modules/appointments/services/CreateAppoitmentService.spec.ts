import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import AppError from "@shared/errors/AppError";
import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";
import FakeCacheRepository from "@shared/container/providers/CacheProvider/fakes/FakeCacheRepository";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheRepository: FakeCacheRepository
let createAppointment: CreateAppointmentService;


describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheRepository = new FakeCacheRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheRepository
    );
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      user_id: "user-test-id",
      date: new Date(2020, 5, 10, 13),
      provider_id: '1254685',
    })
    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('1254685')
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime()
    })

    const date = new Date(2020, 5, 10, 13);

    await createAppointment.execute({
      user_id: "user-test-id",
      date,
      provider_id: '1254685',
    });

    await expect(createAppointment.execute({
      user_id: "user-test-id",
      date,
      provider_id: '123456'
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to create an appointment in a past date', async function () {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12, 0).getTime()
    })

    await expect(createAppointment.execute({
      user_id: "user-test-id",
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with the same user as provider', async function () {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12, 0).getTime()
    })

    await expect(createAppointment.execute({
      user_id: "123456",
      date: new Date(2020, 4, 10, 13),
      provider_id: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should only be able to create an appointment between 8h and 17h', async function () {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 9, 12, 0).getTime()
    })

    await expect(createAppointment.execute({
      user_id: "user",
      date: new Date(2020, 4, 10, 7),
      provider_id: '123456'
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      user_id: "user",
      date: new Date(2020, 4, 10, 18),
      provider_id: '123456'
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      user_id: "user",
      date: new Date(2020, 4, 10, 17),
      provider_id: '123456'
    })).resolves

    await expect(createAppointment.execute({
      user_id: "user",
      date: new Date(2020, 4, 10, 8),
      provider_id: '123456'
    })).resolves


  });
})
