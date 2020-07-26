import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import NotificationSchema from "@modules/notifications/infra/typeorm/schemas/NotificationSchema";
import {getMongoRepository, getRepository, MongoRepository, Repository} from "typeorm";


export default class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<NotificationSchema>

  constructor() {
    this.ormRepository = getMongoRepository(NotificationSchema, "mongo")
  }

  public async create({content, recipient_id}: ICreateNotificationDTO): Promise<NotificationSchema> {
    const notification = this.ormRepository.create({content, recipient_id});

    await this.ormRepository.save(notification);

    return notification
  }

}
