import { Expose, Type } from 'class-transformer';
import { ComplainDto, NotificationTarget, OrderDto, UserType } from '@app/common';

export class NotificationDto {
  @Expose()
  id: number;

  @Expose()
  notifiableId: number;

  @Expose()
  notifiableType: UserType;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  notificationTarget: NotificationTarget;

  @Expose()
  notificationTargetId: number;

  @Expose()
  read: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // extra fields.
  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @Type(() => ComplainDto)
  complain: ComplainDto;
}
