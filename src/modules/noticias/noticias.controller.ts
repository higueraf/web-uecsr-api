import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { createMulterStorage } from '../../common/utils/multer-storage.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/usuario.entity';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly servicio: NoticiasService) {}

  @Get('publico')
  getPublic(@Query() query: QueryDto) {
    return this.servicio.paginatePublic(query);
  }

  @Get('admin')
  getAdmin(@Query() query: QueryDto) {
    return this.servicio.paginateAdmin(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.findOneById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: createMulterStorage('noticias'),
    }),
  )
  create(
    @Body() dto: CreateNoticiaDto,
    @UploadedFile() file?: any,
  ) {
    console.log('FILE NOTICIA >>', file);
    const imagenUrl = file ? `/uploads/noticias/${file.filename}` : undefined;
    return this.servicio.create(dto, imagenUrl);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: createMulterStorage('noticias'),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoticiaDto,
    @UploadedFile() file?: any,
  ) {
    const imagenUrl = file ? `/uploads/noticias/${file.filename}` : undefined;
    return this.servicio.update(id, dto, imagenUrl);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.delete(id);
  }
   @Patch(':id/publicar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  togglePublicar(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.togglePublicar(id);
  }
}
