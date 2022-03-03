import init, { mandelbrot } from '../calc-engine-pkg/calc_engine';

onmessage = async ({ data: { start, delta, size, max_iter } }:
  { data: { start: number, delta: number, size: number, max_iter: number } }) => {
  await init();
  postMessage(mandelbrot(start, delta, size, max_iter));
}
