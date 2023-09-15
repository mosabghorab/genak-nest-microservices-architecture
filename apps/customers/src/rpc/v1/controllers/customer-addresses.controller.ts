import { Controller } from '@nestjs/common';
import { CustomerAddress, CustomersMicroserviceConstants, FindOneByIdPayloadDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerAddressesService } from '../services/customer-addresses.service';

const VERSION = '1';

@Controller()
export class CustomerAddressesController {
  constructor(private readonly customerAddressesService: CustomerAddressesService) {}

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMER_ADDRESSES_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return this.customerAddressesService.findOneById(findOneByIdPayloadDto);
  }
}
