import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity, RolUsuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { applySearch } from '../../common/utils/query-builder.util';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repositorio: Repository<UsuarioEntity>,
  ) {}

  async paginateAdmin(query: QueryDto) {
    const { page, limit, search, sort, order } = query;

    const queryBuilder = this.repositorio.createQueryBuilder('usuario');

    applySearch(queryBuilder, 'usuario', ['nombres', 'apellidos', 'email'], search);

    if (sort) {
      queryBuilder.orderBy(`usuario.${sort}`, order || 'ASC');
    } else {
      queryBuilder.orderBy('usuario.creadoEn', 'DESC');
    }

    const options: IPaginationOptions = { page, limit };

    return paginate<UsuarioEntity>(queryBuilder, options);
  }

  async create(dto: CreateUsuarioDto): Promise<UsuarioEntity> {
    const existente = await this.repositorio.findOne({ where: { email: dto.email } });
    if (existente) {
      throw new BadRequestException('El email ya está registrado');
    }

    const contrasenaHash = await bcrypt.hash(dto.contrasena, 10);

    const entidad = this.repositorio.create({
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      email: dto.email,
      contrasenaHash,
      rol: dto.rol || RolUsuario.PUBLICO,
      activo: dto.activo ?? true,
    });

    return this.repositorio.save(entidad);
  }

  async findOneById(id: number): Promise<UsuarioEntity> {
    const usuario = await this.repositorio.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async findOneByEmail(email: string): Promise<UsuarioEntity | null> {
    return this.repositorio.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<UsuarioEntity> {
    const usuario = await this.findOneById(id);

    let contrasenaHash = usuario.contrasenaHash;
    if (dto.contrasena) {
      contrasenaHash = await bcrypt.hash(dto.contrasena, 10);
    }

    const actualizado = {
      ...usuario,
      ...dto,
      contrasenaHash,
    };

    delete (actualizado as any).contrasena;

    return this.repositorio.save(actualizado);
  }

  async delete(id: number): Promise<void> {
    const usuario = await this.findOneById(id);
    await this.repositorio.remove(usuario);
  }
}
