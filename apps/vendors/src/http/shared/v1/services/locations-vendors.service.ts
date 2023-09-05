import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { FindOneByIdDto, FindOneOrFailByIdDto, LocationVendor } from '@app/common';

@Injectable()
export class LocationsVendorsService {
  constructor(
    @InjectRepository(LocationVendor)
    private readonly locationVendorRepository: Repository<LocationVendor>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<LocationVendor>): Promise<LocationVendor | null> {
    return this.locationVendorRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<LocationVendor>): Promise<LocationVendor> {
    const locationVendor: LocationVendor = await this.findOneById(<FindOneByIdDto<LocationVendor>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!locationVendor) {
      throw new BadRequestException(findOneOrFailByIdDto.failureMessage || 'Location vendor not found.');
    }
    return locationVendor;
  }

  // find all by vendor id.
  findAllByVendorId(vendorId: number, relations?: FindOptionsRelations<LocationVendor>): Promise<LocationVendor[]> {
    return this.locationVendorRepository.find({
      where: { vendorId },
      relations,
    });
  }

  // remove one by id.
  async removeOneById(id: number): Promise<LocationVendor> {
    const locationVendor: LocationVendor = await this.findOneOrFailById(<FindOneOrFailByIdDto<LocationVendor>>{ id });
    return this.removeOneByInstance(locationVendor);
  }

  // remove one by instance.
  removeOneByInstance(locationVendor: LocationVendor): Promise<LocationVendor> {
    return this.locationVendorRepository.remove(locationVendor);
  }
}
