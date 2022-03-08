import { defineComponent } from "vue";
import Worker from "@/workers/mandelbrot?worker";
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';
import ProgressSpinner from 'primevue/progressspinner';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const defaultZoomFactor = 1.5;
const defaultStartX = -1.5;
const defaultStartY = -1.0;
const defaultCanvasWidth = 300;
const defaultDelta = 2.0 / defaultCanvasWidth;
const defaultMaxIter = 1000;

export default defineComponent({
  name: 'MandelbrotPlot',
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
      maxIter: defaultMaxIter,
      computing: false,
      worker: null as null | Worker,
      debouncedEvent: new BehaviorSubject<void>(undefined),
      debouncedCallback: () => { },
      dragStart: null as null | { x: number, y: number }
    }
  },
  computed: {
    isTouchScreen(): boolean {
      return window.matchMedia('(pointer: coarse)').matches;
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
    handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      e.stopPropagation();
      this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    handleTouchEnd(e: TouchEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (this.dragStart) {
        const [transX, transY] = [
          this.dragStart.x - e.changedTouches[0].clientX,
          e.changedTouches[0].clientY - this.dragStart.y
        ];
        this.doDebounced(() => this.doTranslate(transX, transY));
      }
    },
    handleDragStart(e: DragEvent) {
      if (this.isTouchScreen) {
        return;
      }
      e.dataTransfer && (e.dataTransfer.dropEffect = 'move');
      e.dataTransfer?.setDragImage(new Image(0, 0), 0, 0);
      this.dragStart = { x: e.clientX, y: e.clientY };
    },
    handleDrop(e: DragEvent) {
      if (this.isTouchScreen) {
        return;
      }
      if (this.dragStart) {
        const [transX, transY] = [
          this.dragStart.x - e.clientX,
          e.clientY - this.dragStart.y
        ];
        this.doDebounced(() => this.doTranslate(transX, transY));
      }
    },
    handleDragOver(e: DragEvent) {
      e.preventDefault();
      e.dataTransfer && (e.dataTransfer.dropEffect = 'move');
    },
    handleZoomIn() {
      this.doDebounced(() => {
        this.doInterrupt();
        this.doZoom(this.zoomFactor);
      });
    },
    handleZoomOut() {
      this.doDebounced(() => {
        this.doInterrupt();
        this.doZoom(1 / this.zoomFactor);
      });
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
      this.doDebounced(() => this.computeMandelbrot());
    },
    handleZoomFactorChanged() {
      this.doInterrupt();
    },
    handleMaxIterChanged() {
      this.doInterrupt();
      this.doDebounced(() => this.computeMandelbrot());
    },
    doTranslate(transX: number, transY: number) {
      this.startX = this.startX + transX * this.delta;
      this.startY = this.startY + transY * this.delta;
      this.computeMandelbrot();
    },
    doDebounced(clb: () => void) {
      this.debouncedCallback = clb;
      this.debouncedEvent.next();
    },
    doInterrupt() {
      this.worker?.terminate();
    },
    async doReset() {
      this.doInterrupt();
      this.zoomFactor = defaultZoomFactor;
      this.startX = defaultStartX;
      this.startY = defaultStartY;
      this.canvasWidth = defaultCanvasWidth;
      this.delta = defaultDelta;
      this.maxIter = defaultMaxIter;
    },
    doZoom(factor: number): Promise<void> {
      const [x, y] = [this.canvasWidth / 2, this.canvasWidth / 2];
      const [xm, ym] = [this.startX + x * this.delta, this.startY + y * this.delta];
      this.delta = 1 / factor * this.delta;
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