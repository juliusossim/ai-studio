import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [react(), tailwindcss(), nxViteTsPaths()],
      resolve: {
        alias: {
          '@org/ui-hooks': resolve(import.meta.dirname, '../../hooks/src/index.ts'),
          '@org/ui-primitives': resolve(import.meta.dirname, '../../primitives/src/index.ts'),
          '@org/utils': resolve(import.meta.dirname, '../../../shared/utils/src/index.ts'),
        },
        dedupe: ['react', 'react-dom'],
      },
    }),
};

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
