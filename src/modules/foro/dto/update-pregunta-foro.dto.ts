import { PartialType } from '@nestjs/mapped-types';
import { CreatePreguntaForoDto } from './create-pregunta-foro.dto';

export class UpdatePreguntaForoDto extends PartialType(CreatePreguntaForoDto) {}
