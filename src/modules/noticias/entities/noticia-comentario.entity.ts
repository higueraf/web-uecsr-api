import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { NoticiaEntity } from './noticia.entity';
import { UsuarioEntity } from '../../usuarios/usuario.entity';

@Entity({ name: 'noticia_comentarios' })
export class NoticiaComentarioEntity extends BaseEntity {
  @Column({ type: 'text' })
  contenido: string;

  @ManyToOne(() => NoticiaEntity, (noticia) => noticia.comentarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'noticia_id' })
  noticia: NoticiaEntity;

  @Column({ name: 'noticia_id' })
  noticiaId: number;

  @ManyToOne(() => UsuarioEntity, { nullable: false }) // <- ahora obligatorio
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'boolean', default: false })
  aprobado: boolean;
}
