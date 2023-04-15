import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { EmailVerificationDto } from "./dtos/email-verification.dto";

@Injectable()
export class EmailService {
  private readonly to: string = 'test@test.com';

  constructor(private readonly mailerService: MailerService) {}

  async sendEmailVerification(context: EmailVerificationDto): Promise<void> {
    try {
      const sendMailOptions = {
        to: this.to,
        subject: '이메일 인증',
        template: 'email-verification.hbs',
        context
      }

      await this.mailerService.sendMail(sendMailOptions);
    } catch (error) {
      throw new Error('Mail sent failed!' + error);
    }
  }

}
