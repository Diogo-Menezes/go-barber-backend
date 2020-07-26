import ISendMailDTO from "@shared/container/providers/EmailProvider/dtos/ISendMailDTO";

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>
}
