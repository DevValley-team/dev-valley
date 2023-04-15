import { Module } from '@nestjs/common';
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import process from "process";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { EmailService } from './email.service';
import * as path from "path";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: config.get<object>('mailer.transport'),
          defaults: {
            from: config.get<string>('mailer.from'),
          },
          preview: config.get('NODE_ENV') === 'development',
          template: {
            dir: path.join(__dirname, './templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }
      }
    }),
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
