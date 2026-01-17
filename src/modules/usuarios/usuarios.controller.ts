import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryDto } from '../../common/dto/query.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly servicio: UsuariosService) {}

  @Get('admin')
  getAdmin(@Query() query: QueryDto) {
    return this.servicio.paginateAdmin(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.findOneById(id);
  }

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.servicio.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.servicio.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.delete(id);
  }
}
