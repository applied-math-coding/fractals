use complex_algebra::{c, re};

pub fn simulate(start_u: f64, start_v: f64, delta: f64, size: usize, max_iter: u32) -> Vec<u32> {
  let mut res = vec![0u32; size * size];
  for v in 0..size {
    for u in 0..size {
      let z1 = c(start_u + u as f64 * delta, start_v + v as f64 * delta);
      let mut z = re(0f64);
      let mut iter = 0;
      while iter < max_iter && z.r_square() <= 2.0 {
        z = &z * &z + &z1;
        iter += 1;
      }
      res[u + v * size] = iter;
    }
  }
  return res;
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_compute() {
    assert_eq!(simulate(0.0, 0.0, 0.1, 10, 1000).len(), 100);
  }
}
