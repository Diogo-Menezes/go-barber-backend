import "reflect-metadata";
import {format, getHours, isBefore, startOfHour} from 'date-fns';
import {injectable, inject} from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entity/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";


interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

const sameDateErrorMessage = 'The time selected is already booked';

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {
  }

  public async execute({provider_id, date, user_id}: Request): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    if (getHours(appointmentDate) > 17 || getHours(appointmentDate) < 8) {
      throw new AppError("The appointments should be between 8 and 17")
    }

    if (provider_id === user_id) {
      throw new AppError("User and provider can't have the same id")
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("Can't create appointments in a passed date")
    }


    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,provider_id
    );

    if (findAppointmentInSameDate) {
      throw new AppError(sameDateErrorMessage);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id
    });

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `New Appointment for ${format(appointmentDate, "dd/MM/yyyy 'at' HH:mm")} `,
    })

    await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, "yyyy-M-d")}`)

    return appointment;
  }
}

export default CreateAppointmentService;
