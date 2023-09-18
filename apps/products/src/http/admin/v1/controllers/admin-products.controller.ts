import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  AdminMustCanDo,
  AllowFor,
  AuthedUser,
  FindOneOrFailByIdPayloadDto,
  GetAuthedUser,
  Helpers,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Product,
  ProductResponseDto,
  Serialize,
  UserType,
} from '@app/common';
import { AdminProductsService } from '../services/admin-products.service';
import { CreateProductRequestDto } from '../dtos/create-product-request.dto';
import { FindAllProductsRequestDto } from '../dtos/find-all-products-request.dto';
import { UpdateProductRequestDto } from '../dtos/update-product-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.PRODUCTS)
@Controller({ path: 'admin/products', version: '1' })
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(ProductResponseDto, 'Product created successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createProductRequestDto: CreateProductRequestDto,
    @UploadedFile(Helpers.defaultImageValidator()) image: Express.Multer.File,
  ): Promise<Product> {
    return this.adminProductsService.create(authedUser, createProductRequestDto, image);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ProductResponseDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsRequestDto: FindAllProductsRequestDto): Promise<Product[]> {
    return this.adminProductsService.findAll(findAllProductsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ProductResponseDto, 'One product.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.adminProductsService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Product>({
        id,
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ProductResponseDto, 'Product updated successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @GetAuthedUser() authedUser: AuthedUser,
    @Param('id') id: number,
    @Body() updateProductRequestDto: UpdateProductRequestDto,
    @UploadedFile(Helpers.defaultImageValidator(false)) image?: Express.Multer.File,
  ): Promise<Product> {
    return this.adminProductsService.update(authedUser, id, updateProductRequestDto, image);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ProductResponseDto, 'Product deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Product> {
    return this.adminProductsService.remove(id);
  }
}
