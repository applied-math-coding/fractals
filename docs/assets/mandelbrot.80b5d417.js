(function(){"use strict";let a,r=null;function f(){return(r===null||r.buffer!==a.memory.buffer)&&(r=new Int32Array(a.memory.buffer)),r}let i=null;function m(){return(i===null||i.buffer!==a.memory.buffer)&&(i=new Uint32Array(a.memory.buffer)),i}function u(e,n){return m().subarray(e/4,e/4+n)}function w(e,n,t,s,o){try{const c=a.__wbindgen_add_to_stack_pointer(-16);a.mandelbrot(c,e,n,t,s,o);var y=f()[c/4+0],b=f()[c/4+1],g=u(y,b).slice();return a.__wbindgen_free(y,b*4),g}finally{a.__wbindgen_add_to_stack_pointer(16)}}async function _(e,n){if(typeof Response=="function"&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(e,n)}catch(s){if(e.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",s);else throw s}const t=await e.arrayBuffer();return await WebAssembly.instantiate(t,n)}else{const t=await WebAssembly.instantiate(e,n);return t instanceof WebAssembly.Instance?{instance:t,module:e}:t}}async function l(e){typeof e=="undefined"&&(e=new URL("/fractals/assets/calc_engine_bg.0c8c4675.wasm",self.location));const n={};(typeof e=="string"||typeof Request=="function"&&e instanceof Request||typeof URL=="function"&&e instanceof URL)&&(e=fetch(e));const{instance:t,module:s}=await _(await e,n);return a=t.exports,l.__wbindgen_wasm_module=s,a}onmessage=async({data:{startX:e,startY:n,delta:t,size:s,maxIter:o}})=>{await l("/build-wasm/calc_engine_bg.wasm"),postMessage(w(e,n,t,s,o))}})();
