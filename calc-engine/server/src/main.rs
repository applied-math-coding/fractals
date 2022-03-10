#[macro_use]
extern crate rocket;
use rocket::serde::json::Json;
use fractal_simulations;

#[get("/mandelbrot?<start_u>&<start_v>&<delta>&<size>&<max_iter>")]
fn index(start_u: f64, start_v: f64, delta: f64, size: usize, max_iter: u32) -> Json<Vec<u32>> {
  Json(fractal_simulations::simulate_mandelbrot(
    start_u, start_v, delta, size, max_iter,
  ))
}

#[launch]
fn rocket() -> _ {
  rocket::build().mount("/", routes![index])
}
