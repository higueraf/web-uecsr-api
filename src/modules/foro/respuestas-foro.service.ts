import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { QueryDto } from '../../common/dto/query.dto';
import { applySearch } from '../../common/utils/query-builder.util';
import { RespuestaForoEntity, EstadoRespuestaForo } from './entities/respuesta-foro.entity';
import { CreateRespuestaForoDto } from './dto/create-respuesta-foro.dto';
import { UsuarioEntity } from '../usuarios/usuario.entity';

@Injectable()
export class RespuestasForoService {
  constructor(
    @InjectRepository(RespuestaForoEntity)
    private readonly repo: Repository<RespuestaForoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepo: Repository<UsuarioEntity>,
  ) {}

  async findByPreguntaId(preguntaId: number, query: QueryDto) {
    const { page = 1, limit = 20, search, sort, order } = query;

    const qb = this.repo
      .createQueryBuilder('respuesta')
      .leftJoinAndSelect('respuesta.usuario', 'usuario')
      .where('respuesta.pregunta_id = :preguntaId', { preguntaId })
      .andWhere('respuesta.estado = :estado', { estado: EstadoRespuestaForo.APROBADA });

    applySearch(qb, 'respuesta', ['contenido'], search);

    if (sort) qb.orderBy(`respuesta.${sort}`, order || 'ASC');
    else qb.orderBy('respuesta.creadoEn', 'ASC');

    const options: IPaginationOptions = { page, limit };
    const result = await paginate<RespuestaForoEntity>(qb, options);

    return {
      items: result.items.map((r) => ({
        id: r.id,
        contenido: r.contenido,
        estado: r.estado,
        preguntaId: r.preguntaId,
        creadoEn: r.creadoEn,
        actualizadoEn: r.actualizadoEn,
        autorNombre: `${r.usuario.nombres} ${r.usuario.apellidos}`.trim(),
      })),
      meta: result.meta,
    };
  }

  async findAdminByPreguntaId(preguntaId: number, query: QueryDto) {
    const { page = 1, limit = 20, search, sort, order } = query;

    const qb = this.repo
      .createQueryBuilder('respuesta')
      .leftJoinAndSelect('respuesta.usuario', 'usuario')
      .where('respuesta.pregunta_id = :preguntaId', { preguntaId });

    applySearch(qb, 'respuesta', ['contenido'], search);

    if (sort) qb.orderBy(`respuesta.${sort}`, order || 'ASC');
    else qb.orderBy('respuesta.creadoEn', 'DESC');

    const options: IPaginationOptions = { page, limit };
    const result = await paginate<RespuestaForoEntity>(qb, options);

    return {
      items: result.items.map((r) => ({
        id: r.id,
        contenido: r.contenido,
        estado: r.estado,
        preguntaId: r.preguntaId,
        creadoEn: r.creadoEn,
        actualizadoEn: r.actualizadoEn,
        autorNombre: `${r.usuario.nombres} ${r.usuario.apellidos}`.trim(),
        autorEmail: r.usuario.email,
        usuarioId: r.usuarioId,
      })),
      meta: result.meta,
    };
  }

  async createFromUser(dto: CreateRespuestaForoDto, usuarioId: number) {
    const usuario = await this.usuariosRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const entidad = this.repo.create({
      contenido: dto.contenido,
      estado: EstadoRespuestaForo.PENDIENTE,
      usuarioId: usuario.id,
      preguntaId: dto.preguntaId,
    });

    return this.repo.save(entidad);
  }

  async updateEstado(id: number, estado: EstadoRespuestaForo) {
    const respuesta = await this.repo.findOne({ where: { id } });
    if (!respuesta) throw new NotFoundException('Respuesta no encontrada');
    respuesta.estado = estado;
    return this.repo.save(respuesta);
  }

  async toggleOculta(id: number) {
    const respuesta = await this.repo.findOne({ where: { id } });
    if (!respuesta) throw new NotFoundException('Respuesta no encontrada');

    const nuevoEstado =
      respuesta.estado === EstadoRespuestaForo.OCULTA ? EstadoRespuestaForo.APROBADA : EstadoRespuestaForo.OCULTA;

    respuesta.estado = nuevoEstado;
    return this.repo.save(respuesta);
  }

  async delete(id: number) {
    const respuesta = await this.repo.findOne({ where: { id } });
    if (!respuesta) throw new NotFoundException('Respuesta no encontrada');
    await this.repo.remove(respuesta);
  }
}
