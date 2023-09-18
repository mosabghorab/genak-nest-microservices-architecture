import { DataSource, DataSourceOptions } from 'typeorm';
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
import * as process from 'process';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

const environment: string = process.env.NODE_ENV || 'development';

config({ path: `.env.${environment}` });

const configService: ConfigService = new ConfigService();

const dbConfig: any = {
  type: 'mysql',
  database: configService.getOrThrow<string>('DATABASE_NAME'),
  username: configService.getOrThrow<string>('DATABASE_USERNAME'),
  password: configService.getOrThrow<string>('DATABASE_password'),
  migrations: ['migrations/**'],
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
};

export default new DataSource(dbConfig as DataSourceOptions);
