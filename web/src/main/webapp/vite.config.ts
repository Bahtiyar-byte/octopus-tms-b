import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@components': path.resolve(__dirname, './app/components'),
      '@features': path.resolve(__dirname, './app/features'),
      '@modules': path.resolve(__dirname, './app/modules'),
      '@services': path.resolve(__dirname, './app/services'),
      '@hooks': path.resolve(__dirname, './app/hooks'),
      '@types': path.resolve(__dirname, './app/types'),
      '@utils': path.resolve(__dirname, './app/utils'),
      '@context': path.resolve(__dirname, './app/context'),
      '@routes': path.resolve(__dirname, './app/routes')
    }
  }
})
