import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Django serves the built SPA: assets are written to /static/assets/*.
  base: '/static/',
  plugins: [react()],
  server: {
    proxy: {
      // Dev only: forward API calls to the Django BFF.
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
