import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteFilePayloadDto, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Product, StorageMicroserviceConnection, StorageMicroserviceConstants, UploadFilePayloadDto } from '@app/common';
import { FindAllProductsRequestDto } from '../dtos/find-all-products-request.dto';
import { CreateProductRequestDto } from '../dtos/create-product-request.dto';
import { UpdateProductRequestDto } from '../dtos/update-product-request.dto';
import { Constants } from '../../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AdminProductsService {
  private readonly storageMicroserviceConnection: StorageMicroserviceConnection;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.storageMicroserviceConnection = new StorageMicroserviceConnection(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Product>): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Product>): Promise<Product> {
    const product: Product = await this.findOneById(
      new FindOneByIdPayloadDto<Product>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!product) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Product not found.');
    }
    return product;
  }

  // find all.
  findAll(findAllProductsRequestDto: FindAllProductsRequestDto): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        serviceType: findAllProductsRequestDto.serviceType,
      },
    });
  }

  // create.
  async create(createProductRequestDto: CreateProductRequestDto, image: Express.Multer.File): Promise<Product> {
    const imageUrl: string = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
      new UploadFilePayloadDto({
        prefixPath: Constants.PRODUCTS_IMAGES_PREFIX_PATH,
        file: image,
      }),
    );
    return this.productRepository.save(
      await this.productRepository.create({
        image: imageUrl,
        ...createProductRequestDto,
      }),
    );
  }

  // update.
  async update(id: number, updateProductRequestDto: UpdateProductRequestDto, image?: Express.Multer.File): Promise<Product> {
    const product: Product = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Product>({
        id,
      }),
    );
    if (image) {
      await this.storageMicroserviceConnection.storageServiceImpl.deleteFile(
        new DeleteFilePayloadDto({
          prefixPath: Constants.PRODUCTS_IMAGES_PREFIX_PATH,
          fileUrl: product.image,
        }),
      );
      product.image = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new UploadFilePayloadDto({
          prefixPath: Constants.PRODUCTS_IMAGES_PREFIX_PATH,
          file: image,
        }),
      );
    }
    Object.assign(product, updateProductRequestDto);
    return this.productRepository.save(product);
  }

  // remove.
  async remove(id: number): Promise<Product> {
    const product: Product = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Product>({
        id,
      }),
    );
    return this.productRepository.remove(product);
  }
}
