import { IsNumberString, IsOptional } from 'class-validator';

export class QueryPaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  perPage?: string;

  search?: string;

  proffesion?: string;

  date?: string;
}
