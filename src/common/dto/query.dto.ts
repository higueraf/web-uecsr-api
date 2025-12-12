import { IsInt, IsOptional, IsString, IsBoolean, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  admin?: boolean;

  
  @IsOptional()
  @IsString()
  categoria?: string; 
}
