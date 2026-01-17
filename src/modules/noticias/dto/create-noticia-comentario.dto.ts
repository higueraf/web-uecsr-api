import { IsNotEmpty, IsOptional, IsString, MaxLength, IsEmail, IsBoolean } from 'class-validator';

export class CreateNoticiaComentarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  contenido: string;

  @IsOptional()
  @IsBoolean()
  aprobado?: boolean;
}