import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import ListProvidersService from "@modules/appointments/services/ListProvidersService";
import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import ListProviderAppointmentsService from "@modules/appointments/services/ListProviderAppointmentsService";
import FakeCacheRepository from "@shared/container/providers/CacheProvider/fakes/FakeCacheRepository";

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProvidersAppointmentService: ListProviderAppointmentsService;
let fakeCacheRepository: FakeCacheRepository

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeCacheRepository = new FakeCacheRepository();
    listProvidersAppointmentService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository, fakeCacheRepository);
  })

  it('should be able to list provider appointments in one day', async () => {
    const provider_id = "provider-id";


    const appointment1 = await fakeAppointmentsRepository.create({
      user_id: "fake-user-id",
      provider_id,
      date: new Date(2020, 5, 1, 8),
    })

    const appointment2 = await fakeAppointmentsRepository.create({
      user_id: "fake-user-id",
      provider_id,
      date: new Date(2020, 5, 1, 9),
    })

    const availability = await listProvidersAppointmentService.execute({
      provider_id,
      month: 6,
      year: 2020,
      day: 1
    })

    expect(availability).toEqual(expect.arrayContaining(
      [appointment1, appointment2]
    ))


  });
})
;
