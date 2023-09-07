import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DateFilterOption,
  DateHelpers,
  DeleteFileDto,
  FindOneByIdDto,
  FindOneOrFailByIdDto,
  Product,
  ServiceType,
  StorageMicroserviceConstants,
  StorageMicroserviceImpl,
  UploadFileDto,
} from '@app/common';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Constants } from '../../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AdminProductsService {
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.storageMicroserviceImpl = new StorageMicroserviceImpl(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Product>): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Product>): Promise<Product> {
    const product: Product = await this.findOneById(<FindOneByIdDto<Product>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!product) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Product not found.');
    }
    return product;
  }

  // find all.
  findAll(findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        serviceType: findAllProductsDto.serviceType,
      },
    });
  }

  // create.
  async create(createProductDto: CreateProductDto, image: Express.Multer.File): Promise<Product> {
    const imageUrl: string = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
      prefixPath: Constants.PRODUCTS_IMAGES_PREFIX_PATH,
      file: image,
    });
    return this.productRepository.save(
      await this.productRepository.create({
        image: imageUrl,
        ...createProductDto,
      }),
    );
  }

  // update.
  async update(id: number, updateProductDto: UpdateProductDto, image?: Express.Multer.File): Promise<Product> {
    const product: Product = await this.findOneOrFailById(<FindOneOrFailByIdDto<Product>>{
      id,
    });
    if (image) {
      await this.storageMicroserviceImpl.deleteFile(<DeleteFileDto>{
        prefixPath: Constants.PRODUCTS_IMAGES_PREFIX_PATH,
        fileUrl: product.image,
      });
      product.image = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.PRODUCTS_IMAGES_PREFIX_PATH,
        file: image,
      });
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  // remove.
  async remove(id: number): Promise<Product> {
    const product: Product = await this.findOneOrFailById(<FindOneOrFailByIdDto<Product>>{
      id,
    });
    return this.productRepository.remove(product);
  }

  // find with total sales.
  async findWithTotalSales(serviceType: ServiceType, dateFilterOption?: DateFilterOption, startDate?: Date, endDate?: Date): Promise<Product[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption) {
      if (dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: startDate,
          endDate: endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
      }
    }
    const {
      entities,
      raw,
    }: {
      entities: Product[];
      raw: any[];
    } = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin(
        'product.orderItems',
        'orderItem',
        dateFilterOption ? 'orderItem.createdAt BETWEEN :startDate AND :endDate' : null,
        dateFilterOption
          ? {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            }
          : null,
      )
      .addSelect('SUM(orderItem.price * orderItem.quantity)', 'totalSales')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['totalSales'] = parseFloat(raw[i]['totalSales']) || 0;
    }
    return entities;
  }

  // find with orders count.
  async findWithOrdersCount(serviceType: ServiceType, dateFilterOption: DateFilterOption, startDate: Date, endDate: Date): Promise<Product[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: startDate,
        endDate: endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
    }
    const {
      entities,
      raw,
    }: {
      entities: Product[];
      raw: any[];
    } = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order', 'order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }
}
