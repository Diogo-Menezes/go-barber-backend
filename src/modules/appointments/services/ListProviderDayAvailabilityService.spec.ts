import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import AppError from "@shared/errors/AppError";
import ListProviderDayAvailabilityService from "@modules/appointments/services/ListProviderDayAvailabilityService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;


describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
  })

  it('should be able to list day availability from the provider', async () => {

    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      user_id: "",
      provider_id: 'user',
      date: new Date(2020, 4, 20, 16, 0, 0)
    })


    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 11, 0).getTime();
    })

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    })

    expect(availability).toEqual(expect.arrayContaining([
      {hour: 8, available: false},
      {hour: 9, available: false},
      {hour: 10, available: false},
      {hour: 11, available: false},
      {hour: 12, available: true},
      {hour: 13, available: true},
      {hour: 14, available: false},
      {hour: 15, available: true},
      {hour: 16, available: false},
    ]))

  })
})
