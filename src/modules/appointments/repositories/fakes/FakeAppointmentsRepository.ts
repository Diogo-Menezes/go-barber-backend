import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppoitmentDTO';
import Appointment from "@modules/appointments/infra/typeorm/entity/Appointment";
import {isEqual, getMonth, getYear, getDate} from "date-fns";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({provider_id, date, user_id}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {id: user_id, provider_id, date});

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    return this.appointments.find(
      appointment => isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );
  }

  public async findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const {provider_id, month, year} = data;
    return this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })
  }

  public async findAllInDayFromProvider(
    {provider_id, day, month, year}: IFindAllInDayFromProviderDTO
  ): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === provider_id &&
      getDate(appointment.date) === day &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    )

    return appointments;
  }

}

export default FakeAppointmentsRepository;
