/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // https://rollupjs.org/configuration-options/
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,
    setupFiles: './src/vitest.setup.ts', // assuming the test folder is in the root of our project
  }
})
