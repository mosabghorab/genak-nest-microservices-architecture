import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerRequestDto } from './create-customer-request.dto';
import { CustomerStatus } from '@app/common';

export class UpdateCustomerRequestDto extends PartialType(CreateCustomerRequestDto) {
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;
}
