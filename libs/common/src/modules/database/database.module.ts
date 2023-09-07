import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Admin,
  AdminsRoles,
  Attachment,
  Complain,
  Customer,
  CustomerAddress,
  Document,
  FcmToken,
  Location,
  LocationVendor,
  Notification,
  OnBoardingScreen,
  Order,
  OrderItem,
  OrderStatusHistory,
  Permission,
  Product,
  Reason,
  Review,
  Role,
  RolesPermissions,
  Setting,
  Vendor,
  VerificationCode,
} from '@app/common';

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
              database: configService.get<string>('DATABASE_NAME'),
              username: configService.get<string>('DATABASE_USERNAME'),
              password: configService.get<string>('DATABASE_PASSWORD'),
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
                FcmToken,
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
