import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        unsafe: true,
        passes: 3,
        inline: true,
        keep_fargs: false,
        pure_getters: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        toplevel: true,
        booleans_as_integers: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        unused: true,
        join_vars: true,
        collapse_vars: true,
      },
      format: {
        indent_level: 0,
        comments: false,
        ascii_only: true,
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