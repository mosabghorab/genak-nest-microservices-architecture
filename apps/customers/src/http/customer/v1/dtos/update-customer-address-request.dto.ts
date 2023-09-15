import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerAddressRequestDto } from './create-customer-address-request.dto';

export class UpdateCustomerAddressRequestDto extends PartialType(CreateCustomerAddressRequestDto) {}
