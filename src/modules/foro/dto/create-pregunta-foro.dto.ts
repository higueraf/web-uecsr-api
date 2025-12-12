import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoriaPreguntaForo, EstadoPreguntaForo } from '../entities/pregunta-foro.entity';

export class CreatePreguntaForoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsEnum(CategoriaPreguntaForo)
  categoria: CategoriaPreguntaForo;

  @IsOptional()
  @IsInt()
  referenciaId?: number;

  @IsOptional()
  @IsEnum(EstadoPreguntaForo)
  estado?: EstadoPreguntaForo;

  @IsOptional()
  @IsString()
  respuestaAdmin?: string;
}
