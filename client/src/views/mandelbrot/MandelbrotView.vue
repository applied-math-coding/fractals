<script lang="ts" src="./mandelbrot.ts"></script>

<template>
  <main>
    <h1 class="text-center">Mandelbrot Set</h1>
    <div class="control-panel">
      <Button
        label="Stop zooming"
        v-if="autoZoomActive"
        @click="handleStopAutoZoom()"
      />
      <Button label="Reset" @click="handleReset()" />
      <div>
        Zoom factor: {{ zoomFactor }}
        <Slider
          v-model="zoomFactor"
          :step="0.05"
          :min="1.0"
          :max="4.0"
          @change="handleZoomFactorChanged()"
        />
      </div>
      <div>
        Size: {{ canvasWidth + "px" }}
        <Slider
          :modelValue="canvasWidth"
          @change="handleCanvasWidthChanged($event)"
          :step="10"
          :min="300"
          :max="1000"
        />
      </div>
      <div>
        Max iterations: {{ maxIter }}
        <InputNumber
          v-model="maxIter"
          @input="handleMaxIterChanged()"
          :step="500"
          :min="1000"
          :max="100000"
          showButtons="true"
        />
      </div>
      <div>
        Auto zoom:
        <InputSwitch v-model="autoZoom" />
      </div>
      <div>Distance of one pixel: {{ delta }}</div>
    </div>
    <div class="canvas-container">
      <div>
        <div class="canvas-header">
          <div class="text-sm secondary-text-color">click to zoom</div>
          <div class="spinner-wrapper">
            <ProgressSpinner v-if="computing" strokeWidth="5" />
          </div>
        </div>
        <canvas
          ref="canvas"
          @click="handleCanvasClicked($event)"
          :width="canvasWidth"
          :height="canvasWidth"
        ></canvas>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.canvas-container {
  display: flex;
  justify-content: center;

  .canvas-header {
    display: flex;
    justify-content: space-between;

    .spinner-wrapper {
      --spinner-size: 20px;
      height: var(--spinner-size);

      .p-progress-spinner {
        width: var(--spinner-size);
        height: var(--spinner-size);
      }
    }
  }

  canvas {
    border: 1px solid #cccccc;
  }
}
</style>