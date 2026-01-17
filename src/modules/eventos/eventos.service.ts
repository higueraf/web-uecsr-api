import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoEntity, EstadoEvento, CategoriaEvento } from './entities/evento.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { applySearch } from '../../common/utils/query-builder.util';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(EventoEntity)
    private readonly repositorio: Repository<EventoEntity>,
  ) {}

  private normalizeUrl(url?: string | null): string | undefined {
    return url ?? undefined;
  }

  async paginateAdmin(query: QueryDto) {
    const { page, limit, search, sort, order } = query;

    const queryBuilder = this.repositorio.createQueryBuilder('evento');

    applySearch(queryBuilder, 'evento', ['titulo', 'resumen', 'lugar'], search);

    if (sort) {
      queryBuilder.orderBy(`evento.${sort}`, order || 'ASC');
    } else {
      queryBuilder.orderBy('evento.fechaInicio', 'DESC');
    }

    const options: IPaginationOptions = { page, limit };

    return paginate<EventoEntity>(queryBuilder, options);
  }

  async paginatePublic(query: QueryDto) {
    const { page, limit, search, sort, order, categoria } = query;

    const queryBuilder = this.repositorio
      .createQueryBuilder('evento')
      .where('evento.estado IN (:...estados)', {
        estados: [EstadoEvento.PROGRAMADO, EstadoEvento.EN_CURSO],
      });

    applySearch(queryBuilder, 'evento', ['titulo', 'resumen', 'lugar'], search);

    if (categoria && categoria !== 'TODAS') {
      queryBuilder.andWhere('evento.categoria = :categoria', { 
        categoria: categoria.toUpperCase().replace('É', 'E').replace('Á', 'A') 
      });
    }

    if (sort) {
      queryBuilder.orderBy(`evento.${sort}`, order || 'ASC');
    } else {
      queryBuilder.orderBy('evento.fechaInicio', 'ASC');
    }

    const options: IPaginationOptions = { page, limit };

    return paginate<EventoEntity>(queryBuilder, options);
  }

  async create(dto: CreateEventoDto, imagenUrl?: string | null): Promise<EventoEntity> {
    const entidad = this.repositorio.create({
      titulo: dto.titulo,
      resumen: dto.resumen,
      descripcion: dto.descripcion,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
      lugar: dto.lugar,
      estado: dto.estado ?? EstadoEvento.PROGRAMADO,
      categoria: dto.categoria ?? CategoriaEvento.GENERAL,
      imagenUrl: this.normalizeUrl(imagenUrl),
      orden: dto.orden ?? 0,
    });

    return this.repositorio.save(entidad);
  }

  async findOneById(id: number): Promise<EventoEntity> {
    const evento = await this.repositorio.findOne({ where: { id } });
    if (!evento) {
      throw new NotFoundException('Evento no encontrado');
    }
    return evento;
  }

  async update(
    id: number,
    dto: UpdateEventoDto,
    imagenUrl?: string | null,
  ): Promise<EventoEntity> {
    const evento = await this.findOneById(id);

    const actualizado: EventoEntity = {
      ...evento,
      titulo: dto.titulo ?? evento.titulo,
      resumen: dto.resumen ?? evento.resumen,
      descripcion: dto.descripcion ?? evento.descripcion,
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : evento.fechaInicio,
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : evento.fechaFin,
      lugar: dto.lugar ?? evento.lugar,
      estado: dto.estado ?? evento.estado,
      categoria: dto.categoria ?? evento.categoria,
      imagenUrl: this.normalizeUrl(imagenUrl) ?? evento.imagenUrl,
      orden: typeof dto.orden === 'number' ? dto.orden : evento.orden,
    };

    return this.repositorio.save(actualizado);
  }

  async delete(id: number): Promise<void> {
    const evento = await this.findOneById(id);
    await this.repositorio.remove(evento);
  }

  async getCategorias(): Promise<string[]> {
    return Object.values(CategoriaEvento);
  }
}