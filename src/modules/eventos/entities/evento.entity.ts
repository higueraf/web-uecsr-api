// evento.entity.ts (actualizado)
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EventoComentarioEntity } from './evento-comentario.entity';

export enum EstadoEvento {
  PROGRAMADO = 'PROGRAMADO',
  EN_CURSO = 'EN_CURSO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

export enum CategoriaEvento {
  ACADEMICO = 'ACADÉMICO',
  CULTURAL = 'CULTURAL',
  DEPORTES = 'DEPORTES',
  ADMISIONES = 'ADMISIONES',
  AMBIENTAL = 'AMBIENTAL',
  GENERAL = 'GENERAL',
}

@Entity({ name: 'eventos' })
export class EventoEntity extends BaseEntity {
  @Column({ length: 200 })
  titulo: string;

  @Column({ length: 200 })
  resumen: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'fecha_inicio', type: 'timestamptz' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamptz', nullable: true })
  fechaFin?: Date;

  @Column({ length: 200 })
  lugar: string;

  @Column({
    type: 'enum',
    enum: EstadoEvento,
    default: EstadoEvento.PROGRAMADO,
  })
  estado: EstadoEvento;

  @Column({
    type: 'enum',
    enum: CategoriaEvento,
    default: CategoriaEvento.GENERAL,
  })
  categoria: CategoriaEvento;

  @Column({ name: 'imagen_url', nullable: true })
  imagenUrl?: string;

  @Column({ default: 0 })
  orden: number;

  @OneToMany(() => EventoComentarioEntity, (comentario) => comentario.evento)
  comentarios: EventoComentarioEntity[];
}
