import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel 部署使用根路径
  // GitHub Pages 需要时改为: base: '/TYM/'
  base: '/',
  server: {
    port: 7845,
  },
})