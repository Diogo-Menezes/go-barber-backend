import {container} from "tsyringe";
import EtherealMailProvider from "@shared/container/providers/EmailProvider/implementations/EtherealMailProvider";
import SESMailProvider from "@shared/container/providers/EmailProvider/implementations/SESMailProvider";
import IMailProvider from "@shared/container/providers/EmailProvider/models/IMailProvider";
import mailConfig from "@config/mail";

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider)
}

container.registerInstance<IMailProvider>(
  'MailProvider', providers[mailConfig.driver],
)
