use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn mandelbrot(start: f64, delta: f64, size: usize, max_iter: u32) -> Box<[u32]>  {
    let res = vec![0u32; size*size];
  //TODO
    return res.into_boxed_slice();
}