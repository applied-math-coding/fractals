import init, { mandelbrot } from '../calc-engine-pkg/wasm_exports';

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
  await init(`${import.meta.env.BASE_URL}wasm_exports_bg.wasm`);
  postMessage(mandelbrot(startX, startY, delta, size, maxIter));
}
