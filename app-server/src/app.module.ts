import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FractalSimulationController } from './controllers/fractal-simulation.controller';
import { FractalSimulationService } from './services/fractal-simulation.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
    }),
    HttpModule,
    ConfigModule.forRoot({
      cache: true
    })
  ],
  controllers: [
    AppController,
    FractalSimulationController
  ],
  providers: [
    AppService,
    FractalSimulationService
  ],
})
export class AppModule { }
