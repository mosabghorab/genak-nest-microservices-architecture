import { NestFactory } from '@nestjs/core';
import { SeederModule } from './database/seeders/seeder.module';
import { SeederService } from './database/seeders/seeder.service';
import { INestApplicationContext } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  try {
    const nestApplicationContext: INestApplicationContext = await NestFactory.createApplicationContext(SeederModule);
    const seederService: SeederService = nestApplicationContext.get(SeederService);
    await seederService.seed();
    console.log('Seed process completed successfully.');
    await nestApplicationContext.close();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

bootstrap();
