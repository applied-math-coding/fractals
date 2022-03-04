import { defineComponent } from "vue";
import Worker from "@/workers/mandelbrot?worker";

export default defineComponent({
  data() {
    return {
      canvasWidth: 300,
      startX: -1.5,
      startY: -1.5,
      delta: 0.01,
      zoomFactor: 1.5,
      autoZoomInterval: 1000,
      autoZoom: true,
      autoZoomCenter: [0, 0] as [number, number],
      autoZoomActive: false,
      maxIter: 1000,
      computing: false,
    }
  },
  async mounted() {
    await this.computeMandelbrot();
  },
  methods: {
    handleReset() {
      //TODO
    },
    handleStopAutoZoom() {
      //TODO ensure by using a autoZoomStopping = true, that now click on canvas is triggering
      // another auto-zoom
    },
    handleCanvasClicked(e: PointerEvent) {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      this.autoZoomCenter = [e.clientX - rect.x, this.canvasWidth - (e.clientY - rect.y)];
      if (this.autoZoom && !this.autoZoomActive) {
        this.autoZoomActive = true;
        this.doAutoZoom();
      } else if (!this.autoZoomActive) {
        this.doZoom(this.autoZoomCenter);
      }
    },
    async doAutoZoom() {
      await wait(this.autoZoomInterval);
      this.doZoom(this.autoZoomCenter).then(() => this.doAutoZoom());
      this.autoZoomCenter = [this.canvasWidth / 2, this.canvasWidth / 2];
    },
    doZoom([x, y]: [number, number]): Promise<void> {
      const [xm, ym] = [this.startX + x * this.delta, this.startY + y * this.delta];
      this.delta = 1 / this.zoomFactor * this.delta;
      this.startX = xm - this.delta * this.canvasWidth / 2;
      this.startY = ym - this.delta * this.canvasWidth / 2;
      return this.computeMandelbrot();
    },
    computeMandelbrot(): Promise<void> {
      this.computing = true;
      return new Promise(res => {
        const w = new Worker();
        w.postMessage({
          startX: this.startX,
          startY: this.startY,
          delta: this.delta,
          size: this.canvasWidth,
          maxIter: this.maxIter
        });
        w.onmessage = ({ data }) => {
          drawToCanvas({
            data: transformData(data, this.canvasWidth),
            canvas: this.$refs.canvas as HTMLCanvasElement,
            size: this.canvasWidth,
            max_iter: this.maxIter
          });
          this.computing = false;
          res();
        }
      });
    }
  }
});

function wait(millis: number): Promise<void> {
  return new Promise(res => setTimeout(res, millis));
}

function transformData(data: Uint32Array, size: number): Uint32Array {
  const buffer = new ArrayBuffer(data.buffer.byteLength);
  const view = new Uint32Array(buffer);
  for (let i = 0; i < size; i++) {
    view.set(data.slice(i * size, (i + 1) * size), (size - 1 - i) * size);
  }
  return view;
}

function drawToCanvas({ data, canvas, size, max_iter }:
  { data: Uint32Array, canvas: HTMLCanvasElement, size: number, max_iter: number }) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const imageData = ctx.createImageData(size, size);
  data.forEach((v, i) => {
    imageData.data[4 * i + 0] = 0;
    imageData.data[4 * i + 1] = 0;
    imageData.data[4 * i + 2] = 255;
    imageData.data[4 * i + 3] = v === max_iter ? 255 : 0;
  });
  ctx.putImageData(imageData, 0, 0);
}