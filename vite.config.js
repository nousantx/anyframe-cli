import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  build: {
    target: 'es2017',
    lib: {
      name: '__extractorjs__',
      entry: './src/index.js',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['fs', 'path', 'chalk', 'glob', 'chokidar', 'commander', '@anyframe/css'],
      output: {
        exports: 'named'
      }
    }
  }
})
