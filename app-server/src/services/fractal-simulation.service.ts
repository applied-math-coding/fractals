import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/resources/environment-variables';
import { map, Observable } from 'rxjs';

@Injectable()
export class FractalSimulationService {

  constructor(
    private httpService: HttpService,
    private configService: ConfigService<EnvironmentVariables>
  ) { }

  get calcEngineUrlPrefix(): string {
    const [schema, host, port] = [
      this.configService.get('CALC_ENGINE_SERVER_SCHEMA'),
      this.configService.get('CALC_ENGINE_SERVER_HOST'),
      this.configService.get('CALC_ENGINE_SERVER_PORT')
    ]
    return `${schema}://${host}:${port}`;
  }

  simulateMandelbrot(
    start_u: number,
    start_v: number,
    delta: number,
    size: number,
    max_iter: number
  ): Observable<Uint32Array> {
    return this.httpService
      .get<Uint32Array>(
        `${this.calcEngineUrlPrefix}/mandelbrot`,
        { params: { start_u, start_v, delta, size, max_iter } }
      ).pipe(map(r => r.data));
  }
}