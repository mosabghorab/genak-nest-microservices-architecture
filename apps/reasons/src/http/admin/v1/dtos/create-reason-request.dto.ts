import { IsString } from 'class-validator';

export class CreateReasonRequestDto {
  @IsString()
  name: string;
}
