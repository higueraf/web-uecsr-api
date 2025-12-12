import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity } from './entities/evento.entity';
import { EventoComentarioEntity } from './entities/evento-comentario.entity';
import { EventosService } from './eventos.service';
import { EventosComentariosService } from './eventos-comentarios.service';
import { EventosController } from './eventos.controller';
import { EventosComentariosController } from './eventos-comentarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventoEntity, EventoComentarioEntity])],
  controllers: [EventosController, EventosComentariosController],
  providers: [EventosService, EventosComentariosService],
  exports: [EventosService, EventosComentariosService],
})
export class EventosModule {}