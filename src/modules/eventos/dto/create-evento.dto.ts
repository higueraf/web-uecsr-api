import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { EstadoEvento, CategoriaEvento } from '../entities/evento.entity';

export class CreateEventoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  resumen: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  fechaInicio: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  lugar: string;

  @IsOptional()
  @IsEnum(EstadoEvento)
  estado?: EstadoEvento;

  @IsOptional()
  @IsEnum(CategoriaEvento)
  categoria?: CategoriaEvento;

  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
}