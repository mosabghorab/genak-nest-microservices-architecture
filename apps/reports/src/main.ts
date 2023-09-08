import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import { ReportsModule } from './reports.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(ReportsModule);
  const configService: ConfigService = app.get(ConfigService);
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
  await app.listen(configService.get<string>('REPORTS_MICROSERVICE_HTTP_PORT'));
}

bootstrap();
