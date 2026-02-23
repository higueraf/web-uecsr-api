import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EventoEntity } from './evento.entity';
import { UsuarioEntity } from '../../usuarios/usuario.entity';

@Entity({ name: 'evento_comentarios' })
export class EventoComentarioEntity extends BaseEntity {
  @Column({ type: 'text' })
  contenido: string;

  @ManyToOne(() => EventoEntity, (evento) => evento.comentarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evento_id' })
  evento: EventoEntity;

  @Column({ name: 'evento_id' })
  eventoId: number;

  @ManyToOne(() => UsuarioEntity, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'boolean', default: false })
  aprobado: boolean;
}
