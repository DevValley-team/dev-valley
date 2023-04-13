import { User } from "../users/entities/user.entity";
import { EmailVerification } from "./entities/email-verification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from "../../infrastructure/email/email.service";

export class EmailVerificationService {
  constructor(@InjectRepository(EmailVerification) private emailVerificationRepo: Repository<EmailVerification>,
              private readonly emailService: EmailService) {}

  async createEmailVerification(user: User): Promise<EmailVerification> {
    const { id, email, nickname } = user;
    const emailVerification = new EmailVerification();
    const token = uuidv4();
    emailVerification.userId = id;
    emailVerification.verified = false;
    emailVerification.token = token;
    emailVerification.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await this.emailVerificationRepo.insert(emailVerification);
    const generatedId = result.generatedMaps[0].userId;

    if (generatedId) {
      await this.sendEmail(email, nickname, token);
    }

    return generatedId;
  }

  async verifyEmail(token: string): Promise<EmailVerification> {
    const emailVerification = await this.emailVerificationRepo.findOne({ where: { token } });

    if (!emailVerification) throw new BadRequestException('Invalid token');

    if (emailVerification.tokenExpiresAt < new Date()) throw new BadRequestException('Token expired');

    emailVerification.verified = true;
    emailVerification.token = null;
    emailVerification.tokenExpiresAt = null;

    // TODO: user role 변경

    return await this.emailVerificationRepo.save(emailVerification);
  }

  private async sendEmail(email: string, nickname: string, token: string) {
    return await this.emailService.send({
      to: 'test@test.com',
      subject: 'Testing Nest MailerModule ✔',
      template: 'email-auth-token.hbs',
      context: {
        domain: 'http://localhost:3002', // TODO: config 적용
        email,
        nickname,
        token
      }
    })
  }
}