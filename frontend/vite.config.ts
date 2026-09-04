import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3001,
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
