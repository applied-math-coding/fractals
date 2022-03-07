import { defineComponent } from "vue";
import Worker from "@/workers/mandelbrot?worker";
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';
import ProgressSpinner from 'primevue/progressspinner';
import { wait } from '@/utils';
import { BehaviorSubject, merge } from 'rxjs';
import { take, debounceTime } from 'rxjs/operators';

type Interrupted = 'interrupted';
const defaultZoomFactor = 1.5;
const defaultStartX = -1.5;
const defaultStartY = -1.0;
const defaultCanvasWidth = 300;
const defaultDelta = 2.0 / defaultCanvasWidth;
const defaultAutoZoom = false;
const defaultMaxIter = 1000;

export default defineComponent({
  components: {
    Button,
    InputNumber,
    Slider,
    InputSwitch,
    ProgressSpinner
  },
  data() {
    return {
      canvasWidth: defaultCanvasWidth,
      startX: defaultStartX,
      startY: defaultStartY,
      delta: defaultDelta,
      zoomFactor: defaultZoomFactor,
      autoZoomInterval: 1000,
      autoZoom: defaultAutoZoom,
      autoZoomCenter: [0, 0] as [number, number],
      autoZoomActive: false,
      maxIter: defaultMaxIter,
      computing: false,
      requestStopZoom: null as (() => void) | null,
      worker: null as null | Worker,
      interrupted: new BehaviorSubject<Interrupted | null>(null),
      debouncedEvent: new BehaviorSubject<void>(undefined),
      debouncedCallback: () => { }
    }
  },
  mounted() {
    this.doReset();
    this.computeMandelbrot();
    this.debouncedEvent
      .pipe(debounceTime(500))
      .subscribe(() => this.debouncedCallback());
  },
  methods: {
    async handleReset() {
      this.doInterrupt();
      this.doReset();
      this.doDebounced(() => this.computeMandelbrot());
    },
    handleStopAutoZoom() {
      this.doStopZoom();
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
    handleDrag() {
      //TODO
    },
    handleCanvasWidthChanged(w: number) {
      const [xm, ym] = [
        this.startX + this.canvasWidth / 2 * this.delta,
        this.startY + this.canvasWidth / 2 * this.delta
      ];
      this.startX = xm - this.delta * w / 2;
      this.startY = ym - this.delta * w / 2;
      this.canvasWidth = w;
      this.doInterrupt();
      if (!this.autoZoomActive) {
        this.doDebounced(() => this.computeMandelbrot());
      }
    },
    handleZoomFactorChanged() {
      this.doInterrupt();
    },
    handleMaxIterChanged() {
      this.doInterrupt();
      if (!this.autoZoomActive) {
        this.doDebounced(() => this.computeMandelbrot());
      }
    },
    doDebounced(clb: () => void) {
      this.debouncedCallback = clb;
      this.debouncedEvent.next();
    },
    doInterrupt() {
      this.worker?.terminate();
      this.interrupted.next('interrupted');
    },
    async doStopZoom() {
      return new Promise<void>(res => {
        if (!this.autoZoomActive) {
          res();
        } else {
          this.requestStopZoom = () => {
            this.autoZoomActive = false;
            this.requestStopZoom = null;
            res();
          }
        }
      });
    },
    async doReset() {
      this.doInterrupt();
      if (this.autoZoomActive) {
        await this.doStopZoom();
      }
      this.zoomFactor = defaultZoomFactor;
      this.startX = defaultStartX;
      this.startY = defaultStartY;
      this.canvasWidth = defaultCanvasWidth;
      this.delta = defaultDelta;
      this.autoZoom = defaultAutoZoom;
      this.maxIter = defaultMaxIter;
    },
    async doAutoZoom() {
      await wait(this.autoZoomInterval);
      if (this.requestStopZoom) {
        this.requestStopZoom();
        return;
      }
      merge(this.interrupted, this.doZoom(this.autoZoomCenter))
        .pipe(take(1))
        .subscribe(() => this.doAutoZoom());
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
      //TODO improve by using worker.compileStreaming
      this.computing = true;
      return new Promise(res => {
        this.worker = new Worker();
        this.worker.postMessage({
          startX: this.startX,
          startY: this.startY,
          delta: this.delta,
          size: this.canvasWidth,
          maxIter: this.maxIter
        });
        this.worker.onmessage = ({ data }) => {
          drawToCanvas({
            data: transformData(data, this.canvasWidth),
            canvas: this.$refs.canvas as HTMLCanvasElement,
            size: this.canvasWidth,
            max_iter: this.maxIter
          });
          this.computing = false;
          res();
        };
      });
    }
  }
});

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