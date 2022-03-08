import MandelbrotPlot from '@/views/mandelbrot/mandelbrot-plot/MandelbrotPlot.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MandelbrotDocs from '@/views/mandelbrot/mandelbrot-docs/MandelbrotDocs.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/mandelbrot'
    },
    {
      path: '/mandelbrot',
      component: () => import('../views/mandelbrot/MandelbrotView.vue'),
      children: [
        { path: '', component: MandelbrotPlot },
        { path: 'docs', component: MandelbrotDocs }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
