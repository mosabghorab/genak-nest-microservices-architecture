import { NestFactory } from '@nestjs/core';
import { SettingsModule } from './settings.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as compression from 'compression';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(SettingsModule);
  const configService: ConfigService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('SETTINGS_MICROSERVICE_HOST'),
      port: configService.get<string>('SETTINGS_MICROSERVICE_TCP_PORT'),
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
  await app.listen(configService.get<string>('SETTINGS_MICROSERVICE_HTTP_PORT'));
}

bootstrap();
