import { NestFactory } from '@nestjs/core';
import { ComplainsModule } from './complains.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as compression from 'compression';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(ComplainsModule);
  const configService: ConfigService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('COMPLAINS_MICROSERVICE_HOST'),
      port: configService.get<string>('COMPLAINS_MICROSERVICE_TCP_PORT'),
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
  await app.listen(configService.get<string>('COMPLAINS_MICROSERVICE_HTTP_PORT'));
}

bootstrap();
