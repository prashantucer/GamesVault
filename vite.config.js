import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Vercel works best with the default root base
  base: '/',
  plugins: [react()],
})
