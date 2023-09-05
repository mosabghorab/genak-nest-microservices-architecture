import { Module } from '@nestjs/common';
import { ProductsController } from './v1/controllers/products.controller';
import { ProductsService } from './v1/services/products.service';
import { DatabaseModule, Product } from '@app/common';

@Module({
  imports: [DatabaseModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class RpcModule {}
