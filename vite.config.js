import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'assets/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'assets/js/react-app.jsx',
      output: {
        entryFileNames: 'react-app.bundle.js',
        format: 'es',
      },
    },
  },
});
