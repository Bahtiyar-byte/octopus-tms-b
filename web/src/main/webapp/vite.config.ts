import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
      '/authenticate': 'http://localhost:8080',
      '/passwordReset': 'http://localhost:8080',
      '/auth': 'http://localhost:8080'
    }
  },
  build: {
    outDir: '../../../build/resources/main/static',
    emptyOutDir: true
  }
})
