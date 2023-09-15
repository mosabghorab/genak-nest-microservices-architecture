import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Location } from '@app/common';
import { FindAllLocationsRequestDto } from '../dtos/find-all-locations-request.dto';
import { CreateLocationRequestDto } from '../dtos/create-location-request.dto';
import { UpdateLocationRequestDto } from '../dtos/update-location-request.dto';

@Injectable()
export class AdminLocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Location>): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Location>): Promise<Location> {
    const location: Location = await this.findOneById(
      new FindOneByIdPayloadDto<Location>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!location) {
      throw new BadRequestException(findOneOrFailByIdPayloadDto.failureMessage || 'Location not found.');
    }
    return location;
  }

  // find all.
  async findAll(findAllLocationsRequestDto: FindAllLocationsRequestDto): Promise<Location[]> {
    if (findAllLocationsRequestDto.parentId) {
      await this.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: findAllLocationsRequestDto.parentId,
          failureMessage: 'Parent not found.',
        }),
      );
    }
    return this.locationRepository.find({
      where: {
        parentId: findAllLocationsRequestDto.parentId ? findAllLocationsRequestDto.parentId : IsNull(),
      },
    });
  }

  // create.
  async create(createLocationRequestDto: CreateLocationRequestDto): Promise<Location> {
    return this.locationRepository.save(await this.locationRepository.create(createLocationRequestDto));
  }

  // update.
  async update(id: number, updateLocationRequestDto: UpdateLocationRequestDto): Promise<Location> {
    const location: Location = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id,
      }),
    );
    Object.assign(location, updateLocationRequestDto);
    return this.locationRepository.save(location);
  }

  // remove.
  async remove(id: number): Promise<Location> {
    const location: Location = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id,
      }),
    );
    return this.locationRepository.remove(location);
  }
}
