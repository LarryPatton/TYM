import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitLab Pages 部署路径配置
  // 如果是在 CI 环境，使用项目名作为 base，否则使用根路径
  base: './',
  server: {
    port: 6123,
  },
})
