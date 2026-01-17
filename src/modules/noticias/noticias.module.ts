import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticiaEntity } from './entities/noticia.entity';
import { NoticiaComentarioEntity } from './entities/noticia-comentario.entity';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { NoticiasComentariosController } from './noticias-comentarios.controller';
import { NoticiasComentariosService } from './noticias-comentarios.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([NoticiaEntity, NoticiaComentarioEntity]),
   
  ],
  controllers: [NoticiasController, NoticiasComentariosController],
  providers: [NoticiasService, NoticiasComentariosService],
  exports: [NoticiasService, NoticiasComentariosService],
})
export class NoticiasModule {}
