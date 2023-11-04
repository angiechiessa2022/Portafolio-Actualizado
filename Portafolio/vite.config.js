import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createVuePlugin } from 'vite-plugin-vue2'
import { createLessPlugin } from 'vite-plugin-less'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createVuePlugin(),
    createLessPlugin(),
  ],
})
