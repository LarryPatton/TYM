import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { execSync } from 'child_process'
import path from 'path'

/**
 * Vite 插件：监听 CSV 文件变化并自动构建 i18n
 */
function i18nAutoBuilder() {
  let isFirstBuild = true;
  
  return {
    name: 'i18n-auto-builder',
    
    // 在服务启动时执行初始构建
    configureServer(server) {
      if (isFirstBuild) {
        console.log('\n🌐 [i18n] 初始化翻译文件...');
        try {
          execSync('node scripts/build-i18n.cjs', { stdio: 'inherit' });
          console.log('✅ [i18n] 翻译文件已就绪\n');
          isFirstBuild = false;
        } catch (error) {
          console.error('❌ [i18n] 初始构建失败:', error.message);
        }
      }
      
      // 监听 CSV 文件变化
      const csvDir = path.resolve(__dirname, 'src/i18n/content');
      
      server.watcher.add(csvDir + '/**/*.csv');
      
      server.watcher.on('change', (file) => {
        if (file.endsWith('.csv') && file.includes('i18n/content')) {
          console.log(`\n📝 [i18n] 检测到 CSV 文件变化: ${path.basename(file)}`);
          console.log('🔄 [i18n] 正在重新构建翻译文件...');
          
          try {
            execSync('node scripts/build-i18n.cjs', { stdio: 'inherit' });
            console.log('✅ [i18n] 构建完成！');
            
            // 触发热更新
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
            console.log('🔥 [i18n] 已触发页面重载\n');
          } catch (error) {
            console.error('❌ [i18n] 构建失败:', error.message);
          }
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    i18nAutoBuilder(), // 添加 i18n 自动构建插件
  ],
  // Vercel 部署使用根路径
  // GitHub Pages 需要时改为: base: '/TYM/'
  base: '/',
  server: {
    port: 7845,
  },
})