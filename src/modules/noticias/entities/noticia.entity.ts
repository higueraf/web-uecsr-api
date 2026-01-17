import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { NoticiaComentarioEntity } from './noticia-comentario.entity';

export enum EstadoNoticia {
  BORRADOR = 'BORRADOR',
  PUBLICADO = 'PUBLICADO',
  OCULTO = 'OCULTO',
}

@Entity({ name: 'noticias' })
export class NoticiaEntity extends BaseEntity {
  @Column({ length: 200 })
  titulo: string;

  @Column({ length: 200, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  resumen?: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ name: 'imagen_url', nullable: true })
  imagenUrl?: string;

  @Column({ name: 'fecha_publicacion', type: 'timestamptz', nullable: true })
  fechaPublicacion?: Date;

  @Column({ type: 'enum', enum: EstadoNoticia, default: EstadoNoticia.BORRADOR })
  estado: EstadoNoticia;

  @Column({ default: false })
  destacado: boolean;

  @Column({ default: 0 })
  orden: number;


  @OneToMany(() => NoticiaComentarioEntity, (comentario) => comentario.noticia)
  comentarios: NoticiaComentarioEntity[];
}