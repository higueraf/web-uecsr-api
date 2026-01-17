import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoComentarioEntity } from './entities/evento-comentario.entity';
import { EventoEntity } from './entities/evento.entity';
import { CreateEventoComentarioDto } from './dto/create-evento-comentario.dto';
import { UpdateEventoComentarioDto } from './dto/update-evento-comentario.dto';

@Injectable()
export class EventosComentariosService {
  private readonly AUTO_APROBAR_COMENTARIOS = true;

  constructor(
    @InjectRepository(EventoComentarioEntity)
    private readonly comentarioRepo: Repository<EventoComentarioEntity>,
    @InjectRepository(EventoEntity)
    private readonly eventoRepo: Repository<EventoEntity>,
  ) {}

  async create(
    eventoId: number,
    dto: CreateEventoComentarioDto,
    usuarioId: number,
  ): Promise<EventoComentarioEntity> {
    await this.assertEventoExiste(eventoId);

    const comentario = this.comentarioRepo.create({
      contenido: dto.contenido,
      eventoId,
      usuarioId,
      aprobado: this.AUTO_APROBAR_COMENTARIOS,
    });

    return this.comentarioRepo.save(comentario);
  }

  async findAllByEvento(
    eventoId: number,
    soloAprobados: boolean = true,
  ): Promise<EventoComentarioEntity[]> {
    const qb = this.comentarioRepo
      .createQueryBuilder('comentario')
      .leftJoinAndSelect('comentario.usuario', 'usuario')
      .where('comentario.eventoId = :eventoId', { eventoId })
      .orderBy('comentario.creadoEn', 'DESC');

    if (soloAprobados) {
      qb.andWhere('comentario.aprobado = :aprobado', { aprobado: true });
    }

    return qb.getMany();
  }

  async update(
    id: number,
    dto: UpdateEventoComentarioDto,
    usuarioId: number,
    esAdmin: boolean = false,
  ): Promise<EventoComentarioEntity> {
    const comentario = await this.getComentarioOrFail(id);
    this.assertPuedeModificar(comentario.usuarioId, usuarioId, esAdmin);
    Object.assign(comentario, dto);
    return this.comentarioRepo.save(comentario);
  }

  async delete(
    id: number,
    usuarioId: number,
    esAdmin: boolean = false,
  ): Promise<void> {
    const comentario = await this.getComentarioOrFail(id);
    this.assertPuedeModificar(comentario.usuarioId, usuarioId, esAdmin);
    await this.comentarioRepo.delete({ id: comentario.id });
  }

  async toggleAprobacion(id: number): Promise<EventoComentarioEntity> {
    const comentario = await this.getComentarioOrFail(id);
    comentario.aprobado = !comentario.aprobado;
    return this.comentarioRepo.save(comentario);
  }

  private async assertEventoExiste(eventoId: number): Promise<void> {
    const existe = await this.eventoRepo.exist({ where: { id: eventoId } });
    if (!existe) throw new NotFoundException('Evento no encontrado');
  }

  private async getComentarioOrFail(id: number): Promise<EventoComentarioEntity> {
    const comentario = await this.comentarioRepo.findOne({ where: { id } });
    if (!comentario) throw new NotFoundException('Comentario no encontrado');
    return comentario;
  }

  private assertPuedeModificar(
    dueñoComentarioUsuarioId: number,
    usuarioId: number,
    esAdmin: boolean,
  ): void {
    if (!esAdmin && dueñoComentarioUsuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para modificar este comentario');
    }
  }
}
