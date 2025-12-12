import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NoticiasComentariosService } from './noticias-comentarios.service';
import { CreateNoticiaComentarioDto } from './dto/create-noticia-comentario.dto';
import { UpdateNoticiaComentarioDto } from './dto/update-noticia-comentario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/usuario.entity';

@Controller('noticias-comentarios/:noticiaId')
export class NoticiasComentariosController {
  constructor(private readonly servicio: NoticiasComentariosService) {}

  @Get()
  findAll(
    @Param('noticiaId', ParseIntPipe) noticiaId: number,
    @Query('soloAprobados') soloAprobados?: string,
  ) {
    const soloAprobadosBool = soloAprobados !== 'false';
    return this.servicio.findAllByNoticia(noticiaId, soloAprobadosBool);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('noticiaId', ParseIntPipe) noticiaId: number,
    @Body() dto: CreateNoticiaComentarioDto,
    @Request() req: any,
  ) {
    return this.servicio.create(noticiaId, dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoticiaComentarioDto,
    @Request() req: any,
  ) {
    return this.servicio.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.servicio.delete(id, req.user.id);
  }

  @Put(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  toggleAprobacion(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.toggleAprobacion(id);
  }
}
