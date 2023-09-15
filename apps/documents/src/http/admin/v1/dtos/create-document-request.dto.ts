import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DocumentType, ServiceType } from '@app/common';

export class CreateDocumentRequestDto {
  @IsString()
  name: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  required: boolean;
}
