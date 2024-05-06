import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'dataWorker': fileURLToPath(new URL('./src/webworker/dataWorker.js', import.meta.url)), // 添加这一行
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        dataWorker: fileURLToPath(new URL('./src/webworker/dataWorker.js', import.meta.url)),
      },
    },
  },
});
