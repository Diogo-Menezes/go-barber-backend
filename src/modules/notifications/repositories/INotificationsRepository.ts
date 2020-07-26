import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import NotificationSchema from "@modules/notifications/infra/typeorm/schemas/NotificationSchema";

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<NotificationSchema>
}
