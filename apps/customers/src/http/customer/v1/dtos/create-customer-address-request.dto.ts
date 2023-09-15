import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

export class CreateCustomerAddressRequestDto {
  @IsString()
  onMapName: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}
