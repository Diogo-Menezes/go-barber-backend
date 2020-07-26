import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import NotificationSchema from "@modules/notifications/infra/typeorm/schemas/NotificationSchema";
import {ObjectID} from "mongodb";



export default class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: NotificationSchema[] = []


  public async create({content, recipient_id}: ICreateNotificationDTO): Promise<NotificationSchema> {
    const notification = new NotificationSchema();

    Object.assign(notification, {
      id: new ObjectID(),
      content,
      recipient_id,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    })

    this.notifications.push(notification)


    return notification;
  }

}
