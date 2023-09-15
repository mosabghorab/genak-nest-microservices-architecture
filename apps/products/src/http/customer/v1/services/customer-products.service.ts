import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@app/common';
import { FindAllProductsRequestDto } from '../dtos/find-all-products-request.dto';

@Injectable()
export class CustomerProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // find all.
  findAll(findAllProductsRequestDto: FindAllProductsRequestDto): Promise<Product[]> {
    return this.productRepository.find({
      where: { serviceType: findAllProductsRequestDto.serviceType, active: true },
    });
  }
}
