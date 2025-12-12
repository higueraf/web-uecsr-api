import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PreguntaForoEntity } from '../foro/entities/pregunta-foro.entity';
import { RespuestaForoEntity } from '../foro/entities/respuesta-foro.entity';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  PUBLICO = 'PUBLICO',
}

@Entity({ name: 'usuarios' })
export class UsuarioEntity extends BaseEntity {
  @Column({ length: 150 })
  nombres: string;

  @Column({ length: 150 })
  apellidos: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ name: 'contrasena_hash' })
  contrasenaHash: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.PUBLICO,
  })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => PreguntaForoEntity, (p) => p.usuario)
  preguntasForo: PreguntaForoEntity[];

  @OneToMany(() => RespuestaForoEntity, (r) => r.usuario)
  respuestasForo: RespuestaForoEntity[];
}