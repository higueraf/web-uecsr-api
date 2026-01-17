import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoNoticia } from '../entities/noticia.entity';

export class CreateNoticiaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug: string;

  @IsOptional()
  @IsString()
  resumen?: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsOptional()
  @IsDateString()
  fechaPublicacion?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  destacado?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return 0;
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? 0 : n;
  })
  @IsInt()
  orden?: number;

  @IsOptional()
  @Transform(({ value }) => value as EstadoNoticia)
  @IsEnum(EstadoNoticia)
  estado?: EstadoNoticia;
}
