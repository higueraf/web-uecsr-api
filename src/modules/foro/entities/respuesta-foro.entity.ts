import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PreguntaForoEntity } from './pregunta-foro.entity';
import { UsuarioEntity } from '../../usuarios/usuario.entity';

export enum EstadoRespuestaForo {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  OCULTA = 'OCULTA',
}

@Entity({ name: 'respuestas_foro' })
export class RespuestaForoEntity extends BaseEntity {
  @Column({ type: 'text' })
  contenido: string;

  @Column({
    type: 'enum',
    enum: EstadoRespuestaForo,
    default: EstadoRespuestaForo.PENDIENTE,
  })
  estado: EstadoRespuestaForo;

  @ManyToOne(() => UsuarioEntity, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => PreguntaForoEntity, (pregunta) => pregunta.respuestas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: PreguntaForoEntity;

  @Column({ name: 'pregunta_id' })
  preguntaId: number;
}
