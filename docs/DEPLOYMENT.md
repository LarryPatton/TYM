# 🚀 部署指南

> 本文档介绍如何将项目部署到各种托管平台。

---

## 目录

- [构建生产版本](#构建生产版本)
- [GitHub Pages 部署](#github-pages-部署)
- [Vercel 部署](#vercel-部署)
- [Netlify 部署](#netlify-部署)
- [自定义服务器部署](#自定义服务器部署)
- [环境变量配置](#环境变量配置)
- [性能优化](#性能优化)
- [部署检查清单](#部署检查清单)

---

## 构建生产版本

### 构建命令

```bash
npm run build
```

构建完成后，生产文件将输出到 `dist/` 目录：

```
dist/
├── index.html
├── 404.html           # SPA 路由回退页面
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── images/
    └── ...
```

### 预览构建结果

```bash
npm run preview
```

访问 http://localhost:4173 预览生产构建。

### 构建配置

构建配置在 `vite.config.js`：

```js
export default defineConfig({
  plugins: [react()],
  base: '/TYM/',  // ⚠️ 根据部署目标修改
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,  // 生产环境关闭 sourcemap
  },
})
```

---

## GitHub Pages 部署

### 方式一：手动部署

1. **修改 base 路径**

```js
// vite.config.js
export default defineConfig({
  base: '/your-repo-name/',  // 替换为你的仓库名
})
```

2. **构建项目**

```bash
npm run build
```

3. **部署到 gh-pages 分支**

```bash
# 安装 gh-pages 工具
npm install -D gh-pages

# 添加部署脚本到 package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 执行部署
npm run deploy
```

4. **配置 GitHub 仓库**

- 进入仓库 Settings → Pages
- Source 选择 `gh-pages` 分支
- 保存后等待部署完成

### 方式二：GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

配置 GitHub 仓库：
- Settings → Pages → Source 选择 `GitHub Actions`

### SPA 路由处理

项目已配置 `scripts/copy-404.js` 脚本，构建时会自动生成 `404.html`，用于支持 SPA 路由：

```js
// scripts/copy-404.js
const fs = require('fs')
const path = require('path')

const distPath = path.join(__dirname, '../dist')
const indexPath = path.join(distPath, 'index.html')
const notFoundPath = path.join(distPath, '404.html')

fs.copyFileSync(indexPath, notFoundPath)
console.log('✅ 404.html created for SPA routing')
```

---

## Vercel 部署

### 方式一：通过 Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

### Vercel 配置文件

创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 重要：修改 base 路径

部署到 Vercel 时，需要将 `base` 改为根路径：

```js
// vite.config.js
export default defineConfig({
  base: '/',  // Vercel 部署使用根路径
})
```

---

## Netlify 部署

### 方式一：通过 Netlify Dashboard

1. 访问 [netlify.com](https://www.netlify.com)
2. 点击 "Add new site" → "Import an existing project"
3. 连接 GitHub 仓库
4. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. 点击 "Deploy site"

### 方式二：通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 初始化
netlify init

# 部署预览
netlify deploy

# 生产部署
netlify deploy --prod
```

### Netlify 配置文件

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 创建 `_redirects` 文件

在 `public/` 目录创建 `_redirects`：

```
/*    /index.html   200
```

---

## 自定义服务器部署

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/your-project/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片缓存
    location /images/ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

### Apache 配置

创建 `.htaccess` 在 `dist/` 目录：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# 启用压缩
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json
</IfModule>

# 缓存控制
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

### Docker 部署

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

构建和运行：

```bash
# 构建镜像
docker build -t my-react-app .

# 运行容器
docker run -d -p 80:80 my-react-app
```

---

## 环境变量配置

### Vite 环境变量

创建环境变量文件：

```bash
.env                # 所有环境
.env.local          # 本地覆盖（不提交到 git）
.env.development    # 开发环境
.env.production     # 生产环境
```

示例 `.env.production`：

```bash
VITE_API_URL=https://api.your-domain.com
VITE_ANALYTICS_ID=UA-XXXXX-X
VITE_BASE_URL=/TYM/
```

在代码中使用：

```jsx
const apiUrl = import.meta.env.VITE_API_URL
const baseUrl = import.meta.env.VITE_BASE_URL
```

### 平台环境变量

**GitHub Actions**：在仓库 Settings → Secrets and variables → Actions 中添加

**Vercel**：在项目 Settings → Environment Variables 中添加

**Netlify**：在项目 Site settings → Environment variables 中添加

---

## 性能优化

### 1. 代码分割

使用动态导入实现路由级代码分割：

```jsx
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Suspense>
```

### 2. 图片优化

```jsx
// 使用现代图片格式
<picture>
  <source srcSet="/images/photo.webp" type="image/webp" />
  <source srcSet="/images/photo.jpg" type="image/jpeg" />
  <img src="/images/photo.jpg" alt="Photo" loading="lazy" />
</picture>

// 添加 loading="lazy" 延迟加载
<img src="/images/photo.png" loading="lazy" alt="..." />
```

### 3. 依赖优化

在 `vite.config.js` 中配置：

```js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation': ['framer-motion'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
```

### 4. 资源预加载

```html
<!-- index.html -->
<head>
  <!-- 预加载关键字体 -->
  <link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- 预连接 CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- 预加载首屏图片 -->
  <link rel="preload" href="/images/hero.jpg" as="image">
</head>
```

### 5. 压缩配置

安装压缩插件：

```bash
npm install -D vite-plugin-compression
```

配置 `vite.config.js`：

```js
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
})
```

---

## 部署检查清单

### 构建前检查

- [ ] 运行 `npm run lint` 确保无代码错误
- [ ] 运行 `npm run build` 确保构建成功
- [ ] 运行 `npm run preview` 预览检查

### 配置检查

- [ ] `vite.config.js` 中的 `base` 路径正确
- [ ] 环境变量已正确配置
- [ ] 所有硬编码的 URL 已替换为环境变量

### 资源检查

- [ ] 所有图片已优化（压缩、适当尺寸）
- [ ] 未使用的资源已删除
- [ ] 字体文件已包含

### 功能检查

- [ ] 所有路由正常工作
- [ ] 刷新页面不会 404
- [ ] 语言切换正常
- [ ] 主题切换正常
- [ ] 动画效果流畅

### 性能检查

- [ ] Lighthouse 分数 > 90
- [ ] 首次内容绘制 (FCP) < 2s
- [ ] 最大内容绘制 (LCP) < 2.5s
- [ ] 累积布局偏移 (CLS) < 0.1

### 兼容性检查

- [ ] Chrome 最新版测试通过
- [ ] Firefox 最新版测试通过
- [ ] Safari 最新版测试通过
- [ ] 移动端浏览器测试通过

---

## 🔗 相关文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 项目架构
- [COMPONENTS.md](./COMPONENTS.md) - 组件库文档
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发指南

---

> 🌐 部署遇到问题？请查阅 [Vite 部署文档](https://vitejs.dev/guide/static-deploy.html) 或在 GitHub Issues 中提问。
