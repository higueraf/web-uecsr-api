import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RespuestaForoEntity } from './respuesta-foro.entity';
import { UsuarioEntity } from '../../usuarios/usuario.entity';

export enum CategoriaPreguntaForo {
  NOTICIA = 'NOTICIA',
  EVENTO = 'EVENTO',
  ADMISION = 'ADMISION',
  INFORMACION = 'INFORMACION',
  OTRO = 'OTRO',
}

export enum EstadoPreguntaForo {
  NUEVA = 'NUEVA',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  OCULTA = 'OCULTA',
}

@Entity({ name: 'preguntas_foro' })
export class PreguntaForoEntity extends BaseEntity {
  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({
    type: 'enum',
    enum: CategoriaPreguntaForo,
    default: CategoriaPreguntaForo.OTRO,
  })
  categoria: CategoriaPreguntaForo;

  @Column({ name: 'referencia_id', nullable: true })
  referenciaId?: number;

  @ManyToOne(() => UsuarioEntity, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({
    type: 'enum',
    enum: EstadoPreguntaForo,
    default: EstadoPreguntaForo.NUEVA,
  })
  estado: EstadoPreguntaForo;

  @Column({ name: 'respuesta_admin', type: 'text', nullable: true })
  respuestaAdmin?: string;

  @Column({ name: 'respondido_en', type: 'timestamp', nullable: true })
  respondidoEn?: Date;

  @OneToMany(() => RespuestaForoEntity, (respuesta) => respuesta.pregunta)
  respuestas: RespuestaForoEntity[];
}
