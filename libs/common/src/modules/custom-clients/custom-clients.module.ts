import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class CustomClientsModule {
  static register(
    microserviceName: string,
    configMicroserviceName: string,
  ): DynamicModule {
    return {
      module: CustomClientsModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: microserviceName,
            useFactory: (
              configService: ConfigService,
            ): {
              options: { port: any; host: any };
              transport: Transport.TCP;
            } => ({
              transport: Transport.TCP,
              options: {
                host: configService.get(
                  `${configMicroserviceName}_MICROSERVICE_HOST`,
                ),
                port: configService.get(
                  `${configMicroserviceName}_MICROSERVICE_TCP_PORT`,
                ),
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
