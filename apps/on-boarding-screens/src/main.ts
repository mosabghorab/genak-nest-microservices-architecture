import { NestFactory } from '@nestjs/core';
import { OnBoardingScreensModule } from './on-boarding-screens.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(OnBoardingScreensModule);
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
  await app.listen(configService.get<string>('ON_BOARDING_SCREENS_MICROSERVICE_HTTP_PORT'));
}

bootstrap();
