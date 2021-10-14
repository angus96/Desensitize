import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/website',
  server: {
    port: 8080,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'website'
  },
  plugins: [react()]
})
