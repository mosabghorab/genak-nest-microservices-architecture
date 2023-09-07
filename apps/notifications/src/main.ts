import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import { NotificationsModule } from './notifications.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(NotificationsModule);
  const configService: ConfigService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('NOTIFICATIONS_MICROSERVICE_HOST'),
      port: configService.get<string>('NOTIFICATIONS_MICROSERVICE_TCP_PORT'),
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  app.setGlobalPrefix('/api/');
  app.enableVersioning({ type: VersioningType.URI });
  app.use(compression());
  await app.startAllMicroservices();
  await app.listen(configService.get<string>('NOTIFICATIONS_MICROSERVICE_HTTP_PORT'));
}

bootstrap();
