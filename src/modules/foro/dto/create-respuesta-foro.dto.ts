import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRespuestaForoDto {
  @IsNotEmpty()
  @IsString()
  contenido: string;

  @IsNotEmpty()
  @IsNumber()
  preguntaId: number;
}
