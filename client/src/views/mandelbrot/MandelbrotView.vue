<script lang="ts" src="./mandelbrot.ts"></script>

<template>
  <main>
    <h1>Mandelbrot Set</h1>
    <canvas
      ref="canvas"
      @click="handleCanvasClicked($event)"
      :width="canvasWidth"
      :height="canvasWidth"
    ></canvas>
  </main>
</template>

<style lang="scss">
canvas {
  border: 1px solid #cccccc;
}
</style>