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
import { AuthUser } from "../users/entities/auth-user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUser]),
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtAccessSecret'),
        signOptions: { expiresIn: configService.get<string>('app.jwtAccessExpiresIn') },
      }),
      inject: [ConfigService],
    }),
    EmailModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy
  ],
})
export class AuthModule {}
