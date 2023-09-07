import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';
import { CreateCustomerAddressDto } from '../dtos/create-customer-address.dto';
import { UpdateCustomerAddressDto } from '../dtos/update-customer-address.dto';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  // create.
  create(customerId: number, createCustomersAddressDto: CreateCustomerAddressDto): Promise<CustomerAddress> {
    return this.customerAddressRepository.save(
      this.customerAddressRepository.create({
        customerId,
        ...createCustomersAddressDto,
      }),
    );
  }

  // find all.
  findAll(customerId: number): Promise<CustomerAddress[]> {
    return this.customerAddressRepository.find({
      where: { customerId },
    });
  }

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return this.customerAddressRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<CustomerAddress>): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneById(<FindOneByIdDto<CustomerAddress>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!customerAddress) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Customer address not found.');
    }
    return customerAddress;
  }

  // update.
  async update(id: number, updateCustomersAddressDto: UpdateCustomerAddressDto): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneOrFailById(<FindOneOrFailByIdDto<CustomerAddress>>{
      id,
    });
    Object.assign(customerAddress, updateCustomersAddressDto);
    return this.customerAddressRepository.save(customerAddress);
  }

  // remove.
  async remove(id: number): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneOrFailById(<FindOneOrFailByIdDto<CustomerAddress>>{
      id,
    });
    return this.customerAddressRepository.remove(customerAddress);
  }
}
