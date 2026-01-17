import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/usuario.entity';
import { PreguntasForoService } from './preguntas-foro.service';
import { CreatePreguntaForoDto } from './dto/create-pregunta-foro.dto';
import { UpdatePreguntaForoDto } from './dto/update-pregunta-foro.dto';
import { QueryDto } from '../../common/dto/query.dto';

@Controller('preguntas-foro')
export class PreguntasForoController {
  constructor(private readonly service: PreguntasForoService) {}

  @Post('public')
  @UseGuards(JwtAuthGuard)
  createPublic(@Body() dto: CreatePreguntaForoDto, @Request() req: any) {
    return this.service.createFromUser(req.user.id, dto, 'public');
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.STAFF)
  createAdmin(@Body() dto: CreatePreguntaForoDto, @Request() req: any) {
    return this.service.createFromUser(req.user.id, dto, 'admin');
  }

  @Get('public')
  getPublic(@Query() query: QueryDto) {
    return this.service.paginatePublic(query);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.STAFF)
  getAdmin(@Query() query: QueryDto) {
    return this.service.paginateAdmin(query);
  }

  @Get(':id')
  getByIdPublic(@Param('id') id: string) {
    return this.service.findOneById(parseInt(id), 'public');
  }

  @Get(':id/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.STAFF)
  getByIdAdmin(@Param('id') id: string) {
    return this.service.findOneById(parseInt(id), 'admin');
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.STAFF)
  updateAdmin(@Param('id') id: string, @Body() dto: UpdatePreguntaForoDto) {
    return this.service.updateAdmin(parseInt(id), dto);
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
