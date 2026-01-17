import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { QueryDto } from '../../common/dto/query.dto';
import { applySearch } from '../../common/utils/query-builder.util';
import {
  PreguntaForoEntity,
  EstadoPreguntaForo,
} from './entities/pregunta-foro.entity';
import { CreatePreguntaForoDto } from './dto/create-pregunta-foro.dto';
import { UpdatePreguntaForoDto } from './dto/update-pregunta-foro.dto';
import { UsuarioEntity } from '../usuarios/usuario.entity';

@Injectable()
export class PreguntasForoService {
  constructor(
    @InjectRepository(PreguntaForoEntity)
    private readonly repo: Repository<PreguntaForoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuariosRepo: Repository<UsuarioEntity>,
  ) {}

  async paginateAdmin(query: QueryDto) {
    const { page = 1, limit = 20, search, sort, order } = query;

    const qb = this.repo
      .createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.usuario', 'usuario')
      .loadRelationCountAndMap(
        'pregunta.respuestasCount',
        'pregunta.respuestas',
      );

    applySearch(qb, 'pregunta', ['titulo', 'contenido'], search);

    if (sort) qb.orderBy(`pregunta.${sort}`, order || 'ASC');
    else qb.orderBy('pregunta.creadoEn', 'DESC');

    const options: IPaginationOptions = { page, limit };
    const result = await paginate<PreguntaForoEntity>(qb, options);

    return {
      items: result.items.map((p: any) => ({
        id: p.id.toString(),
        titulo: p.titulo,
        contenido: p.contenido,
        categoria: p.categoria,
        estado: p.estado,
        respuestaAdmin: p.respuestaAdmin,
        referenciaId: p.referenciaId,
        createdAt: p.creadoEn,
        autorNombre: `${p.usuario.nombres} ${p.usuario.apellidos}`.trim(),
        autorEmail: p.usuario.email,
        respuestasCount: p.respuestasCount ?? 0,
      })),
      meta: result.meta,
    };
  }

  async paginatePublic(query: QueryDto) {
    const { page = 1, limit = 20, search, sort, order } = query;

    const qb = this.repo
      .createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.usuario', 'usuario')
      .where('pregunta.estado = :estado', {
        estado: EstadoPreguntaForo.APROBADA,
      })
      .loadRelationCountAndMap(
        'pregunta.respuestasCount',
        'pregunta.respuestas',
      );

    applySearch(qb, 'pregunta', ['titulo', 'contenido'], search);

    if (sort) qb.orderBy(`pregunta.${sort}`, order || 'ASC');
    else qb.orderBy('pregunta.creadoEn', 'DESC');

    const options: IPaginationOptions = { page, limit };
    const result = await paginate<PreguntaForoEntity>(qb, options);

    return {
      items: result.items.map((p: any) => ({
        id: p.id.toString(),
        titulo: p.titulo,
        contenido: p.contenido,
        categoria: p.categoria,
        createdAt: p.creadoEn,
        autorNombre: `${p.usuario.nombres} ${p.usuario.apellidos}`.trim(),
        respuestasCount: p.respuestasCount ?? 0,
        respuestaAdmin: p.respuestaAdmin,
      })),
      meta: result.meta,
    };
  }

  async createFromUser(
    usuarioId: number,
    dto: CreatePreguntaForoDto,
    modo: 'public' | 'admin',
  ) {
    const usuario = await this.usuariosRepo.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const estadoFinal =
      modo === 'admin'
        ? (dto.estado ?? EstadoPreguntaForo.NUEVA)
        : EstadoPreguntaForo.NUEVA;

    const entidad = this.repo.create({
      titulo: dto.titulo,
      contenido: dto.contenido,
      categoria: dto.categoria,
      referenciaId: dto.referenciaId,
      usuarioId: usuario.id,
      estado: estadoFinal,
      respuestaAdmin: modo === 'admin' ? dto.respuestaAdmin : undefined,
      respondidoEn:
        modo === 'admin' && dto.respuestaAdmin ? new Date() : undefined,
    });

    const saved = await this.repo.save(entidad);

    const base: any = {
      id: saved.id.toString(),
      titulo: saved.titulo,
      contenido: saved.contenido,
      categoria: saved.categoria,
      createdAt: saved.creadoEn,
      autorNombre: `${usuario.nombres} ${usuario.apellidos}`.trim(),
      referenciaId: saved.referenciaId,
      respuestaAdmin: saved.respuestaAdmin,
      respondidoEn: saved.respondidoEn,
      respuestasCount: 0,
    };

    if (modo === 'admin') {
      base.estado = saved.estado;
      base.autorEmail = usuario.email;
    } else {
      base.estado = saved.estado;
    }

    return base;
  }

  async findOneById(id: number, modo: 'public' | 'admin' = 'public') {
    const pregunta = await this.repo.findOne({
      where: { id },
      relations: { usuario: true },
    });
    if (!pregunta) throw new NotFoundException('Pregunta no encontrada');

    if (modo === 'public' && pregunta.estado !== EstadoPreguntaForo.APROBADA) {
      throw new NotFoundException('Pregunta no encontrada');
    }

    const base: any = {
      id: pregunta.id.toString(),
      titulo: pregunta.titulo,
      contenido: pregunta.contenido,
      categoria: pregunta.categoria,
      createdAt: pregunta.creadoEn,
      autorNombre:
        `${pregunta.usuario.nombres} ${pregunta.usuario.apellidos}`.trim(),
      respuestaAdmin: pregunta.respuestaAdmin,
      referenciaId: pregunta.referenciaId,
      respondidoEn: pregunta.respondidoEn,
    };

    if (modo === 'admin') {
      base.estado = pregunta.estado;
      base.autorEmail = pregunta.usuario.email;
    }

    return base;
  }

  async updateAdmin(id: number, dto: UpdatePreguntaForoDto) {
    const pregunta = await this.repo.findOne({ where: { id } });
    if (!pregunta) throw new NotFoundException('Pregunta no encontrada');

    const patch: any = {};
    if (dto.titulo !== undefined) patch.titulo = dto.titulo;
    if (dto.contenido !== undefined) patch.contenido = dto.contenido;
    if (dto.categoria !== undefined) patch.categoria = dto.categoria;
    if (dto.referenciaId !== undefined) patch.referenciaId = dto.referenciaId;
    if (dto.estado !== undefined) patch.estado = dto.estado;

    if (dto.respuestaAdmin !== undefined) {
      patch.respuestaAdmin = dto.respuestaAdmin;
      patch.respondidoEn = dto.respuestaAdmin ? new Date() : null;
    }

    await this.repo.update(id, patch);
    return this.findOneById(id, 'admin');
  }

  async toggleOculta(id: number) {
    const pregunta = await this.repo.findOne({ where: { id } });
    if (!pregunta) throw new NotFoundException('Pregunta no encontrada');

    const nuevoEstado =
      pregunta.estado === EstadoPreguntaForo.OCULTA
        ? EstadoPreguntaForo.APROBADA
        : EstadoPreguntaForo.OCULTA;

    await this.repo.update(id, { estado: nuevoEstado });
    return this.findOneById(id, 'admin');
  }

  async delete(id: number) {
    const pregunta = await this.repo.findOne({ where: { id } });
    if (!pregunta) throw new NotFoundException('Pregunta no encontrada');
    await this.repo.remove(pregunta);
  }
}
