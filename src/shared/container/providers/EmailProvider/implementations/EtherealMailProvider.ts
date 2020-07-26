import {inject, injectable} from 'tsyringe';
import nodemailer, {Transporter} from 'nodemailer';
import IMailProvider from "@shared/container/providers/EmailProvider/models/IMailProvider";
import AppError from "@shared/errors/AppError";
import ISendMailDTO from "@shared/container/providers/EmailProvider/dtos/ISendMailDTO";
import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    console.log('✉ Mail Started')
    // Create a SMTP transporter object
    this.client = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure:false,
      auth: {
        user: 'crystel.treutel27@ethereal.email',
        pass: '72JbEHTwTUMYQfNDwQ'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  };

  public async sendMail({to, subject, from, templateData}: ISendMailDTO): Promise<void> {

    if (!this.client) throw new AppError(`${to}`);

    console.log(templateData)

    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'GoBarber Team',
        address: from?.email || 'gobarberteam@gobarber.com',
      },

      to: {
        name: to.name,
        address: to.email,
      },

      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log("Message sent: %s", message.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

}

