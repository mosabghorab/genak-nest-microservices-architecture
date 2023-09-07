import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress, FindOneByIdDto } from '@app/common';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return this.customerAddressRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }
}
