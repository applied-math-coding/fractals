import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FractalSimulationService } from 'src/services/fractal-simulation.service';

@Controller('/fractal-simulation')
export class FractalSimulationController {

  constructor(private fractalSimulationService: FractalSimulationService) { }

  @Get('mandelbrot')
  simulateMandelbrot(
    @Query('start_u') start_u: number,
    @Query('start_v') start_v: number,
    @Query('delta') delta: number,
    @Query('size') size: number,
    @Query('max_iter') max_iter: number
  ): Observable<Uint32Array> {
    return this.fractalSimulationService
      .simulateMandelbrot(start_u, start_v, delta, size, max_iter);
  }
}