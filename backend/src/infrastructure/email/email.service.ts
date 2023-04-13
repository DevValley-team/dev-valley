import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send(config): Promise<void> {
    try {
      await this.mailerService.sendMail(config);
    } catch (error) {
      throw new Error('Mail sent failed!' + error);
    }
  }

}
