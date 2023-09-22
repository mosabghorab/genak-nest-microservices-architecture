import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class CustomClientsModule {
  static register(microserviceName: string, configMicroserviceName: string): DynamicModule {
    return {
      module: CustomClientsModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: microserviceName,
            useFactory: (
              configService: ConfigService,
            ): {
              options: { urls: string[]; queue: string };
              transport: Transport.RMQ;
            } => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URI')],
                queue: configService.get<string>(`${configMicroserviceName}_MICROSERVICE_RABBIT_MQ_QUEUE`),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
