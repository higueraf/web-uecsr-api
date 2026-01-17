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
import { EventosComentariosService } from './eventos-comentarios.service';
import { CreateEventoComentarioDto } from './dto/create-evento-comentario.dto';
import { UpdateEventoComentarioDto } from './dto/update-evento-comentario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/usuario.entity';

@Controller('eventos-comentarios/:eventoId')
export class EventosComentariosController {
  constructor(private readonly servicio: EventosComentariosService) {}

  @Get()
  findAll(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Query('soloAprobados') soloAprobados?: string,
  ) {
    const soloAprobadosBool = soloAprobados !== 'false';
    return this.servicio.findAllByEvento(eventoId, soloAprobadosBool);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('eventoId', ParseIntPipe) eventoId: number,
    @Body() dto: CreateEventoComentarioDto,
    @Request() req: any,
  ) {
    return this.servicio.create(eventoId, dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventoComentarioDto,
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
