import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({ origin: configService.get<string>('app.clientUrl') });
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const config = new DocumentBuilder()
    .setTitle('🏔️ 개발자의 협곡 🏔️')
    .setDescription('📒 개발자의 협곡 API 문서입니다.')
    .setVersion('1.0')
    .addTag('개발자의 협곡')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-document', app, document);

  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
