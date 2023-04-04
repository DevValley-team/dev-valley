import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(helmet());
  app.enableCors({ origin: configService.get<string>('app.clientUrl') });
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(configService.get<number>('app.port'));
}
bootstrap();