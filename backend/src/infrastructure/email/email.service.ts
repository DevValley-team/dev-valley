import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async mailTest(config) {
    this.mailerService
      .sendMail(config)
      .then(() => {
        console.log('Mail sent successfully!')})
      .catch((e) => {
        console.log('Mail sent failed!', e)
      });
  }
}
