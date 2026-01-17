import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEventoComentarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  contenido: string;
}
