import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Admin,
  AdminsRoles,
  Attachment,
  Complain,
  Customer,
  CustomerAddress,
  Document,
  Location,
  LocationVendor,
  Notification,
  OnBoardingScreen,
  Order,
  OrderItem,
  OrderStatusHistory,
  Permission,
  Product,
  PushToken,
  Reason,
  Review,
  Role,
  RolesPermissions,
  Setting,
  Vendor,
  VerificationCode,
} from '@app/common';
import { ConfigService } from '@nestjs/config';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              type: 'mysql',
              database: configService.getOrThrow<string>('DATABASE_NAME'),
              username: configService.getOrThrow<string>('DATABASE_USERNAME'),
              password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
              entities: [
                Customer,
                Admin,
                Product,
                Vendor,
                Location,
                LocationVendor,
                CustomerAddress,
                Role,
                Permission,
                RolesPermissions,
                AdminsRoles,
                Reason,
                Order,
                OrderItem,
                OrderStatusHistory,
                Review,
                Complain,
                Document,
                Attachment,
                OnBoardingScreen,
                Setting,
                PushToken,
                VerificationCode,
                Notification,
              ],
              synchronize: true,
            };
          },
        }),
      ],
    };
  }

  static forFeature(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [TypeOrmModule],
    };
  }
}
