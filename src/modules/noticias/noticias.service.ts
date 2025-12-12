import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticiaEntity, EstadoNoticia } from './entities/noticia.entity';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { applySearch } from '../../common/utils/query-builder.util';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(NoticiaEntity)
    private readonly repositorio: Repository<NoticiaEntity>,
  ) {}

  async paginateAdmin(query: QueryDto) {
    const { page, limit, search, sort, order } = query;

    const queryBuilder = this.repositorio.createQueryBuilder('noticia');

    applySearch(queryBuilder, 'noticia', ['titulo', 'slug', 'resumen'], search);

    if (sort) {
      queryBuilder.orderBy(`noticia.${sort}`, order || 'ASC');
    } else {
      queryBuilder.orderBy('noticia.fechaPublicacion', 'DESC');
    }

    const options: IPaginationOptions = { page, limit };

    return paginate<NoticiaEntity>(queryBuilder, options);
  }

  async paginatePublic(query: QueryDto) {
    const { page, limit, search, sort, order } = query;

    const queryBuilder = this.repositorio
      .createQueryBuilder('noticia')
      .where('noticia.estado = :estado', { estado: EstadoNoticia.PUBLICADO });

    applySearch(queryBuilder, 'noticia', ['titulo', 'slug', 'resumen'], search);

    if (sort) {
      queryBuilder.orderBy(`noticia.${sort}`, order || 'ASC');
    } else {
      queryBuilder.orderBy('noticia.fechaPublicacion', 'DESC');
    }

    const options: IPaginationOptions = { page, limit };

    return paginate<NoticiaEntity>(queryBuilder, options);
  }

  async create(
    dto: CreateNoticiaDto,
    imagenUrl?: string | null,
  ): Promise<NoticiaEntity> {
    const entidad = this.repositorio.create({
      titulo: dto.titulo,
      slug: dto.slug,
      resumen: dto.resumen,
      contenido: dto.contenido,
      imagenUrl: imagenUrl ?? undefined,
      fechaPublicacion: dto.fechaPublicacion
        ? new Date(dto.fechaPublicacion)
        : undefined,
      estado: dto.estado ?? EstadoNoticia.BORRADOR,
      destacado: dto.destacado ?? false,
      orden: dto.orden ?? 0,
    });
    return this.repositorio.save(entidad);
  }

  async findOneById(id: number): Promise<NoticiaEntity> {
    const noticia = await this.repositorio.findOne({ where: { id } });
    if (!noticia) {
      throw new NotFoundException('Noticia no encontrada');
    }
    return noticia;
  }

  async update(
    id: number,
    dto: UpdateNoticiaDto,
    imagenUrl?: string | null,
  ): Promise<NoticiaEntity> {
    const noticia = await this.findOneById(id);

    const actualizada: NoticiaEntity = {
      ...noticia,
      titulo: dto.titulo ?? noticia.titulo,
      slug: dto.slug ?? noticia.slug,
      resumen: dto.resumen ?? noticia.resumen,
      contenido: dto.contenido ?? noticia.contenido,
      imagenUrl:
        imagenUrl !== null && imagenUrl !== undefined
          ? imagenUrl
          : noticia.imagenUrl,

      fechaPublicacion: dto.fechaPublicacion
        ? new Date(dto.fechaPublicacion)
        : noticia.fechaPublicacion,
      estado: dto.estado ?? noticia.estado,
      destacado:
        typeof dto.destacado === 'boolean' ? dto.destacado : noticia.destacado,
      orden: typeof dto.orden === 'number' ? dto.orden : noticia.orden,
    };

    return this.repositorio.save(actualizada);
  }

  async delete(id: number): Promise<void> {
    const noticia = await this.findOneById(id);
    await this.repositorio.remove(noticia);
  }

   async togglePublicar(id: number): Promise<NoticiaEntity> {
    const noticia = await this.findOneById(id);
    if (noticia.estado === EstadoNoticia.PUBLICADO) {
      noticia.estado = EstadoNoticia.BORRADOR;
    } else {
      noticia.estado = EstadoNoticia.PUBLICADO;
      if (!noticia.fechaPublicacion) {
        noticia.fechaPublicacion = new Date();
      }
    }
    return this.repositorio.save(noticia);
  }

}
