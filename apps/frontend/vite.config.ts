import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://equipment-rental-backend:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/equipment_rental/api'),
      },
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
