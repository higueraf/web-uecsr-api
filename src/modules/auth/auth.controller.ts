import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUsuarioDto } from './dto/register-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly servicio: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.servicio.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterUsuarioDto) {
    return this.servicio.register(dto);
  }
}
