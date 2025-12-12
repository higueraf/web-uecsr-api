import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticiaComentarioEntity } from './entities/noticia-comentario.entity';
import { EstadoNoticia, NoticiaEntity } from './entities/noticia.entity';
import { CreateNoticiaComentarioDto } from './dto/create-noticia-comentario.dto';
import { UpdateNoticiaComentarioDto } from './dto/update-noticia-comentario.dto';

@Injectable()
export class NoticiasComentariosService {
  private readonly AUTO_APROBAR_COMENTARIOS = true;

  constructor(
    @InjectRepository(NoticiaComentarioEntity)
    private readonly comentarioRepo: Repository<NoticiaComentarioEntity>,
    @InjectRepository(NoticiaEntity)
    private readonly noticiaRepo: Repository<NoticiaEntity>,
  ) {}

  async create(
    noticiaId: number,
    dto: CreateNoticiaComentarioDto,
    usuarioId: number,
  ): Promise<NoticiaComentarioEntity> {
    await this.assertNoticiaPublicada(noticiaId);

    const comentario = this.comentarioRepo.create({
      contenido: dto.contenido,
      noticiaId,
      usuarioId,
      aprobado: this.AUTO_APROBAR_COMENTARIOS,
    });

    return this.comentarioRepo.save(comentario);
  }

  async findAllByNoticia(
  noticiaId: number,
  soloAprobados: boolean = true,
): Promise<NoticiaComentarioEntity[]> {
  const qb = this.comentarioRepo
    .createQueryBuilder('comentario')
    .leftJoinAndSelect('comentario.usuario', 'usuario')
    .where('comentario.noticiaId = :noticiaId', { noticiaId })
    .orderBy('comentario.creadoEn', 'DESC');

  if (soloAprobados) {
    qb.andWhere('comentario.aprobado = :aprobado', { aprobado: true });
  }

  return qb.getMany();
}


  async update(
    id: number,
    dto: UpdateNoticiaComentarioDto,
    usuarioId: number,
    esAdmin: boolean = false,
  ): Promise<NoticiaComentarioEntity> {
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

  async toggleAprobacion(id: number): Promise<NoticiaComentarioEntity> {
    const comentario = await this.getComentarioOrFail(id);
    comentario.aprobado = !comentario.aprobado;
    return this.comentarioRepo.save(comentario);
  }

  private async assertNoticiaPublicada(noticiaId: number): Promise<void> {
    const existe = await this.noticiaRepo.exist({
      where: { id: noticiaId, estado: EstadoNoticia.PUBLICADO },
    });

    if (!existe) {
      throw new NotFoundException('Noticia no encontrada o no está publicada');
    }
  }

  private async getComentarioOrFail(id: number): Promise<NoticiaComentarioEntity> {
    const comentario = await this.comentarioRepo.findOne({ where: { id } });
    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }
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
