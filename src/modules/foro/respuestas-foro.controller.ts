import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/usuario.entity';
import { RespuestasForoService } from './respuestas-foro.service';
import { CreateRespuestaForoDto } from './dto/create-respuesta-foro.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { EstadoRespuestaForo } from './entities/respuesta-foro.entity';

@Controller('respuestas-foro')
export class RespuestasForoController {
  constructor(private readonly service: RespuestasForoService) {}

  @Get('pregunta/:preguntaId')
  getPublic(@Param('preguntaId') preguntaId: string, @Query() query: QueryDto) {
    return this.service.findByPreguntaId(parseInt(preguntaId), query);
  }

  @Get('pregunta/:preguntaId/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.STAFF)
  getAdmin(@Param('preguntaId') preguntaId: string, @Query() query: QueryDto) {
    return this.service.findAdminByPreguntaId(parseInt(preguntaId), query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateRespuestaForoDto, @Request() req: any) {
    return this.service.createFromUser(dto, req.user.id);
  }

  @Put(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.STAFF)
  updateEstado(@Param('id') id: string, @Body('estado') estado: EstadoRespuestaForo) {
    return this.service.updateEstado(parseInt(id), estado);
  }

  @Put(':id/toggle-oculta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.STAFF)
  toggleOculta(@Param('id') id: string) {
    return this.service.toggleOculta(parseInt(id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  delete(@Param('id') id: string) {
    return this.service.delete(parseInt(id));
  }
}
