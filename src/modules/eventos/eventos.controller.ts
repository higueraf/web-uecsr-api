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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { createMulterStorage } from '../../common/utils/multer-storage.util';

@Controller('eventos')
export class EventosController {
  constructor(private readonly servicio: EventosService) {}

  @Get('publico')
  getPublic(@Query() query: QueryDto) {
    return this.servicio.paginatePublic(query);
  }

  @Get('admin')
  getAdmin(@Query() query: QueryDto) {
    return this.servicio.paginateAdmin(query);
  }

  @Get('categorias')
  getCategorias() {
    return this.servicio.getCategorias();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.findOneById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: createMulterStorage('eventos'),
    }),
  )
  create(
    @Body() dto: CreateEventoDto,
    @UploadedFile() file?: any,
  ) {
    const imagenUrl = file ? `/uploads/eventos/${file.filename}` : undefined;
    return this.servicio.create(dto, imagenUrl);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: createMulterStorage('eventos'),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventoDto,
    @UploadedFile() file?: any,
  ) {
    const imagenUrl = file ? `/uploads/eventos/${file.filename}` : undefined;
    return this.servicio.update(id, dto, imagenUrl);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.delete(id);
  }
}