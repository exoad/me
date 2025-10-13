import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    assetsInlineLimit: 0,
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      ecma: 2020,
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 8,
        toplevel: true,
        dead_code: true,
        unused: true,
        inline: true,
        collapse_vars: true,
        reduce_vars: true,
        conditionals: true,
        booleans_as_integers: true,
        evaluate: true,
        pure_getters: true,
      },
      mangle: {
        toplevel: true,
        properties: true
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/components/')) {
            return 'components';
          }
        },
      },
    },
  },
  base: './',
});
