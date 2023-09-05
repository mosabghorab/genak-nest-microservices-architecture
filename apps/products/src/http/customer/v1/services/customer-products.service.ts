import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@app/common';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';

@Injectable()
export class CustomerProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // find all.
  findAll(finalAllProductDto: FindAllProductsDto): Promise<Product[]> {
    return this.productRepository.find({
      where: { serviceType: finalAllProductDto.serviceType, active: true },
    });
  }
}
