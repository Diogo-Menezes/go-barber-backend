import "reflect-metadata";
import {inject, injectable} from 'tsyringe';

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import {getDate, getDay, getDaysInMonth, getMonth, isAfter, isBefore} from "date-fns";

interface Request {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  availability: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {

  }

  public async execute({provider_id, year, month}: Request): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({provider_id, year, month})

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

    const eachDayArray = Array.from(
      {length: numberOfDaysInMonth},
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {

      const compareDate = new Date(year, month - 1, day, 23, 59, 59)
      const appointmentsInDay = appointments.filter(appointment => getDate(appointment.date) === day)

      return {
        day,
        availability: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10
      }
    })

    return availability;
  }
}
