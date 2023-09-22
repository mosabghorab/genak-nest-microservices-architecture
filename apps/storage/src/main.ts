import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { StorageModule } from './storage.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(StorageModule);
  const configService: ConfigService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_MQ_URI')],
      queue: configService.get<string>('STORAGE_MICROSERVICE_RABBIT_MQ_QUEUE'),
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
