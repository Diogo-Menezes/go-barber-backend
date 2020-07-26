import {inject, injectable} from 'tsyringe';
import aws from 'aws-sdk';
import nodemailer, {Transporter} from 'nodemailer';
import IMailProvider from "@shared/container/providers/EmailProvider/models/IMailProvider";
import AppError from "@shared/errors/AppError";
import ISendMailDTO from "@shared/container/providers/EmailProvider/dtos/ISendMailDTO";
import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";
import mailConfig from '@config/mail';


@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {

    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'eu-west-2',
      })
    });

  };

  public async sendMail({to, subject, from, templateData}: ISendMailDTO): Promise<void> {
    console.log('Worked')

    const {email, name} = mailConfig.defaults.from;

    if (!this.client) throw new AppError(`${to}`);

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }

}

