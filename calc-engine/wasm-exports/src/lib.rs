use fractal_simulations;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn mandelbrot(
  start_u: f64,
  start_v: f64,
  delta: f64,
  size: usize,
  max_iter: u32,
) -> Box<[u32]> {
  fractal_simulations::simulate_mandelbrot(start_u, start_v, delta, size, max_iter)
    .into_boxed_slice()
}
