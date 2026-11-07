import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/card-guesser/',
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(String(Date.now())),
  },
})