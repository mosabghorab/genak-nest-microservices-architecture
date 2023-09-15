import { Expose, Type } from 'class-transformer';
import { OrderResponseDto } from './order-response.dto';
import { ClientUserType, ComplainStatus, ServiceType } from '@app/common';

export class ComplainResponseDto {
  @Expose()
  id: number;

  @Expose()
  complainerId: number;

  @Expose()
  complainerUserType: ClientUserType;

  @Expose()
  orderId: number;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  status: ComplainStatus;

  @Expose()
  note: string;

  @Expose()
  image: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderResponseDto)
  order: OrderResponseDto;
}
