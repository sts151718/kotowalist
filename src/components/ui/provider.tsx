'use client';

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        fg: {
          value: { _light: '{colors.gray.700}', _dark: '{colors.gray.50}' },
        },
        fgMuted: {
          value: { _light: '{colors.gray.500}', _dark: '{colors.gray.400}' },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      color: 'fg',
      bg: 'gray.50',
    },
  },
});

const system = createSystem(defaultConfig, config);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
