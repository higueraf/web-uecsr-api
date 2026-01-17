import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;
}
