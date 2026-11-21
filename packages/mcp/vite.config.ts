import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: 'src/index.ts',
    outDir: 'dist',
    target: 'node20',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        banner: '#!/usr/bin/env node',
      },
    },
  },
  ssr: {
    noExternal: ['@khsura/shared'],
  },
})
