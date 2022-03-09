import init, { mandelbrot } from '../calc-engine-pkg/calc_engine';

onmessage = async ({ data: { startX, startY, delta, size, maxIter } }:
  {
    data: {
      startX: number,
      startY: number,
      delta: number,
      size: number,
      maxIter: number
    }
  }) => {
  await init(`${import.meta.env.BASE_URL}calc_engine_bg.wasm`);
  postMessage(mandelbrot(startX, startY, delta, size, maxIter));
}
