import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticiaComentarioDto } from './create-noticia-comentario.dto';

export class UpdateNoticiaComentarioDto extends PartialType(CreateNoticiaComentarioDto) {}