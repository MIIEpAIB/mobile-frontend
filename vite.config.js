import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/api': {
        target: 'http://34.87.47.221:8000',
        changeOrigin: true
      }
    }
  }
})
