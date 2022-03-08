<template>
  <main>
    <h1 class="text-center mb-0">Mandelbrot Set</h1>
    <nav class="text-center mb-7">
      <RouterLink to="/mandelbrot" class="mr-2">Plot</RouterLink>
      <RouterLink to="/mandelbrot/docs">Docs</RouterLink>
    </nav>
    <router-view></router-view>
  </main>
</template>

