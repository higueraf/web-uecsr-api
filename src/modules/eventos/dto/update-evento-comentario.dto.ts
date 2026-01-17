import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoComentarioDto } from './create-evento-comentario.dto';

export class UpdateEventoComentarioDto extends PartialType(CreateEventoComentarioDto) {}
