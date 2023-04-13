import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { EmailModule } from "../../infrastructure/email/email.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailVerification } from "./entities/email-verification.entity";
import { EmailVerificationService } from "./email-verification.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailVerification]),
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtSecret'),
        signOptions: { expiresIn: configService.get<string>('app.jwtExpiresIn') },
      }),
      inject: [ConfigService],
    }),
    EmailModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailVerificationService,
    JwtStrategy,
    LocalStrategy
  ],
})
export class AuthModule {}
