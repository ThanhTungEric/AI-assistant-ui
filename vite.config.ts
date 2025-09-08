import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/ai-assistant/' : '/',
  resolve: {
    alias: {
      '@util': path.resolve(__dirname, 'src/util'),
      '@util/colors': path.resolve(__dirname, 'src/util/colors'),
      '@hooks': path.resolve(__dirname, 'src/services/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
}));
