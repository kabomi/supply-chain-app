import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // https://rollupjs.org/configuration-options/
    outDir: 'build',
  }
})
