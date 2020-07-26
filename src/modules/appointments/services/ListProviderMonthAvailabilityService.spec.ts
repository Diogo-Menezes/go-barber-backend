import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import AppError from "@shared/errors/AppError";
import ListProviderMonthAvailabilityService from "@modules/appointments/services/ListProviderMonthAvailabilityService";

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProvidersMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
  })

  it('should be able to list the month availability of a provider', async () => {

    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 9, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 10, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 11, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 12, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 13, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 16, 0, 0)
    })
    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 17, 0, 0)
    })



    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0)
    })

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      month: 5,
      year: 2020
    })

    expect(availability).toEqual(expect.arrayContaining([
      {day: 19, availability: true},
      {day: 20, availability: false},
      {day: 21, availability: true},
      {day: 22, availability: true},
    ]))

  })
})
