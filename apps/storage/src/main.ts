import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { StorageModule } from './storage.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(StorageModule);
  const configService: ConfigService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('STORAGE_MICROSERVICE_HOST'),
      port: configService.get<string>('STORAGE_MICROSERVICE_TCP_PORT'),
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  await app.startAllMicroservices();
  await app.init();
}

bootstrap();
