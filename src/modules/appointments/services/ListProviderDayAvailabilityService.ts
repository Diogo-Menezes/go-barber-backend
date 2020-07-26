import "reflect-metadata";
import {inject, injectable} from "tsyringe";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import Appointment from "@modules/appointments/infra/typeorm/entity/Appointment";
import {getHours, isAfter} from "date-fns";


interface Request {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository) {
  }

  public async execute({provider_id, year, month, day}: Request): Promise<IResponse> {

    const dayAppointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id, year, month, day
    })

    const appointmentHourStart = 8;
    const appointmentHourEnd = 18;

    const eachHourArray = Array.from(
      {length: appointmentHourEnd - appointmentHourStart},
      (_, index) => (index + appointmentHourStart)
    );

    const availability = eachHourArray.map(hour => {

      const available = dayAppointments.find(appointment => getHours(appointment.date) === hour)

      const currentDate = new Date(Date.now());

      const compareDate = new Date(year, month - 1, day, hour)

      return {hour, available: !available && isAfter(compareDate, currentDate)}
    })

    return availability;

  }
}

export default ListProviderDayAvailabilityService;
