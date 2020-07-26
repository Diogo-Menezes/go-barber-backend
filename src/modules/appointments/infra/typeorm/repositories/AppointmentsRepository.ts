import {getRepository, Repository, Raw} from 'typeorm';

import Appointment from '../entity/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppoitmentDTO';
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAllInDayFromProvider(
    {provider_id, day, month, year}: IFindAllInDayFromProviderDTO
  ): Promise<Appointment[]> {

    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      relations: ['user']
    })

    return appointments;
  }

  public async findAllInMonthFromProvider({year, month, provider_id}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dataFieldName => `to_char(${dataFieldName},'MM-YYYY') = '${parsedMonth}-${year}' `)
      }
    })
    return appointments;
  }

  public async create({provider_id, date, user_id}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({provider_id, user_id, date})

    await this.ormRepository.save(appointment)

    return appointment;
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    return await this.ormRepository.findOne({
      where: {date, provider_id},
    });
  }
}

export default AppointmentsRepository;
