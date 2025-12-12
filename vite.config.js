import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitLab Pages 部署路径配置
  base: '/ai_prompt/',
  server: {
    port: 6123,
  },
})
