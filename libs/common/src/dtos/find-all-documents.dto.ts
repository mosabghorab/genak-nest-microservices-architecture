import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '@app/common/enums';

export class FindAllDocumentsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => {
    if (value === 'true') return true;
    else if (value === 'false') return false;
    else return null;
  })
  active?: boolean;
}
