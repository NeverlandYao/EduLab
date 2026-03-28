import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api-coze': {
        target: 'https://kn49mmvmw9.coze.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-coze/, ''),
      },
    },
  },
})
