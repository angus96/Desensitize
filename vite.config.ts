import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faviconsPlugin from './plugins/favicon';
// import faviconsPlugin from '@darkobits/vite-plugin-favicons'

const iconSource = {source: './src/favicon.svg'};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Desensitize/website/',
  server: {
    port: 8080,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'website'
  },
  plugins: [
    react(),
    faviconsPlugin({
      start_url: '/Desensitize/website/',
      icons: {
        favicons: iconSource,
        android: iconSource,
        appleStartup: iconSource,
        appleIcon: iconSource
      }
    })
  ]
})
