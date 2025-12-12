import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUsuarioDto } from './dto/register-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { RolUsuario } from '../usuarios/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUsuario(email: string, contrasena: string) {
    const usuario = await this.usuariosService.findOneByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valido = await bcrypt.compare(contrasena, usuario.contrasenaHash);
    if (!valido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return usuario;
  }

  async login(dto: LoginDto) {
    const usuario = await this.validateUsuario(dto.email, dto.contrasena);

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async register(dto: RegisterUsuarioDto) {
    const existente = await this.usuariosService.findOneByEmail(dto.email);
    if (existente) {
      throw new BadRequestException('El email ya está registrado');
    }

    const usuario = await this.usuariosService.create({
      ...dto,
      rol: RolUsuario.PUBLICO,
    });

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
