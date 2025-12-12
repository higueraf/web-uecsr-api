import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticiasModule } from './modules/noticias/noticias.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { PreguntasForoModule } from './modules/foro/foro.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('BD_HOST'),
        port: parseInt(config.get<string>('BD_PUERTO') ?? '5432', 10),
        username: config.get<string>('BD_USUARIO'),
        password: config.get<string>('BD_CLAVE'),
        database: config.get<string>('BD_NOMBRE'),
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
    }),
    NoticiasModule,
    EventosModule,
    PreguntasForoModule,
    UsuariosModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
