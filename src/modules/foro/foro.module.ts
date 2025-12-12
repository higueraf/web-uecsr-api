import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreguntasForoService } from './preguntas-foro.service';
import { PreguntasForoController } from './preguntas-foro.controller';
import { PreguntaForoEntity } from './entities/pregunta-foro.entity';
import { RespuestaForoEntity } from './entities/respuesta-foro.entity';
import { RespuestasForoController } from './respuestas-foro.controller';
import { RespuestasForoService } from './respuestas-foro.service';
import { UsuarioEntity } from '../usuarios/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreguntaForoEntity, RespuestaForoEntity, UsuarioEntity])],
  controllers: [PreguntasForoController, RespuestasForoController],
  providers: [PreguntasForoService, RespuestasForoService],
  exports: [PreguntasForoService, RespuestasForoService],
})
export class PreguntasForoModule {}
