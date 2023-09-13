import { IsNotEmpty, IsString } from 'class-validator';

export class SearchRequestDto {
  @IsNotEmpty()
  @IsString()
  searchQuery: string;
}
