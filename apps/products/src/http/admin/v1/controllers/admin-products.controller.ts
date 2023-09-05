import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdDto, Helpers, PermissionAction, PermissionGroup, PermissionsTarget, Product, ProductDto, Serialize, UserType } from '@app/common';
import { AdminProductsService } from '../services/admin-products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.PRODUCTS)
@Controller({ path: 'admin/products', version: '1' })
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(ProductDto, 'Product created successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() createProductDto: CreateProductDto, @UploadedFile(Helpers.defaultImageValidator()) image: Express.Multer.File): Promise<Product> {
    return this.adminProductsService.create(createProductDto, image);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ProductDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    return this.adminProductsService.findAll(findAllProductsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ProductDto, 'One product.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.adminProductsService.findOneOrFailById(<FindOneOrFailByIdDto<Product>>{
      id,
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ProductDto, 'Product updated successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto, @UploadedFile(Helpers.defaultImageValidator(false)) image?: Express.Multer.File): Promise<Product> {
    return this.adminProductsService.update(id, updateProductDto, image);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ProductDto, 'Product deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Product> {
    return this.adminProductsService.remove(id);
  }
}
