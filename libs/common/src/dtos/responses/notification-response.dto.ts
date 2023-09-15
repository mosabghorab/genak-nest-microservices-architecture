import { Expose, Type } from 'class-transformer';
import { ComplainResponseDto, NotificationTarget, OrderResponseDto, UserType } from '@app/common';

export class NotificationResponseDto {
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
  @Type(() => OrderResponseDto)
  order: OrderResponseDto;

  @Expose()
  @Type(() => ComplainResponseDto)
  complain: ComplainResponseDto;
}
