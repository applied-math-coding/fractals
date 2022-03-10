/* tslint:disable */
/* eslint-disable */
/**
* @param {number} start_u
* @param {number} start_v
* @param {number} delta
* @param {number} size
* @param {number} max_iter
* @returns {Uint32Array}
*/
export function mandelbrot(start_u: number, start_v: number, delta: number, size: number, max_iter: number): Uint32Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly mandelbrot: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
