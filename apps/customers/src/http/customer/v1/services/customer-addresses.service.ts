import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';
import { CreateCustomerAddressRequestDto } from '../dtos/create-customer-address-request.dto';
import { UpdateCustomerAddressRequestDto } from '../dtos/update-customer-address-request.dto';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  // create.
  create(customerId: number, createCustomerAddressRequestDto: CreateCustomerAddressRequestDto): Promise<CustomerAddress> {
    return this.customerAddressRepository.save(
      this.customerAddressRepository.create({
        customerId,
        ...createCustomerAddressRequestDto,
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return this.customerAddressRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneById(
      new FindOneByIdPayloadDto<CustomerAddress>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!customerAddress) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Customer address not found.');
    }
    return customerAddress;
  }

  // update.
  async update(id: number, updateCustomerAddressRequestDto: UpdateCustomerAddressRequestDto): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<CustomerAddress>({
        id,
      }),
    );
    Object.assign(customerAddress, updateCustomerAddressRequestDto);
    return this.customerAddressRepository.save(customerAddress);
  }

  // remove.
  async remove(id: number): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<CustomerAddress>({
        id,
      }),
    );
    return this.customerAddressRepository.remove(customerAddress);
  }
}
