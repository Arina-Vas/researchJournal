import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';
import path from 'path';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/researchJournal/' : '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    svgr({ include: '**/*.svg' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
}));
