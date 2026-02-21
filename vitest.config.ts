import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
      root: './src',
      environment: 'jsdom',
      setupFiles: ['./vitest-setup.ts'],
    },
  })
);
