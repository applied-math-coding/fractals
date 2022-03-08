<script lang="ts" src="./mandelbrot.ts"></script>

<template>
  <main>
    <h1 class="text-center">Mandelbrot Set</h1>
    <div class="text-xs secondary-text-color mb-2">Settings:</div>
    <div class="control-panel">
      <div class="zoom-factor">
        <div class="mb-2">Zoom factor: {{ zoomFactor }}</div>
        <Slider
          v-model="zoomFactor"
          :step="0.05"
          :min="1.0"
          :max="4.0"
          @change="handleZoomFactorChanged()"
        />
      </div>
      <div class="size">
        <div class="mb-2">Size: {{ canvasWidth + "px" }}</div>
        <Slider
          :modelValue="canvasWidth"
          @change="handleCanvasWidthChanged($event)"
          :step="10"
          :min="300"
          :max="1000"
        />
      </div>
      <div>
        <div class="mb-1">Max iterations:</div>
        <InputNumber
          v-model="maxIter"
          @input="handleMaxIterChanged()"
          :step="500"
          :min="1000"
          :max="100000"
          showButtons="true"
        />
      </div>
      <div class="align-self-end">
        <Button label="Reset" @click="handleReset()" />
      </div>
    </div>
    <Divider />
    <div class="canvas-container">
      <div>
        <div class="canvas-header">
          <div class="text-sm secondary-text-color flex align-items-center">
            <span class="mr-1 text-xs">zoom</span>
            <i
              @click="handleZoomIn()"
              class="pi pi-plus-circle mr-1 cursor-pointer"
            ></i>
            <i
              @click="handleZoomOut()"
              class="pi pi-minus-circle cursor-pointer"
            ></i>
          </div>
          <div class="spinner-wrapper">
            <ProgressSpinner v-if="computing" strokeWidth="5" />
          </div>
        </div>
        <canvas
          ref="canvas"
          draggable="true"
          @dragstart="handleDragStart($event)"
          @dragover="handleDragOver($event)"
          @drop="handleDrop($event)"
          @touchstart="handleTouchStart($event)"
          @touchend="handleTouchEnd($event)"
          :width="canvasWidth"
          :height="canvasWidth"
        ></canvas>
        <div class="text-xs secondary-text-color">
          units per pixel: {{ delta }}
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped src="./mandelbrot.scss" ></style>