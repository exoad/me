import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
      output: {
        comments: true,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  base: './',
});