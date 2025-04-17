import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Removed dependencies on packages that aren't installed yet
export default defineConfig({
  plugins: [
    react(),
    // Visualizer and PWA plugins have been temporarily removed until installed
  ],
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
    // Minify output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Use source maps only in development
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
