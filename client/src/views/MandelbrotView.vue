<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import Worker from '@/workers/mandelbrot?worker';

onMounted(() => {
  const w = new Worker();
  w.postMessage({start: -2, delta: 0.1, size: 100, max_iter: 1000 });
  w.onmessage = ({data}) => console.log(data);
});
</script>

<template>
  <main>
    <h1>Mandelbrot Set</h1>
  </main>
</template>