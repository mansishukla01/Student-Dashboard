import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: './',  // important for correct relative paths in dist
  build: {
    outDir: 'dist'  // matches vercel.json
  }
});
