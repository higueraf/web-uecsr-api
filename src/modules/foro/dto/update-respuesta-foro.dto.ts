import { PartialType } from '@nestjs/mapped-types';
import { CreatePreguntaForoDto } from './create-pregunta-foro.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoPreguntaForo } from '../entities/pregunta-foro.entity';

export class UpdatePreguntaForoDto extends PartialType(CreatePreguntaForoDto) {
  @IsOptional()
  @IsEnum(EstadoPreguntaForo)
  estado?: EstadoPreguntaForo;

  @IsOptional()
  @IsString()
  respuestaAdmin?: string;
}
