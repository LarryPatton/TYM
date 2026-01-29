# Vercel 部署指南与问题排查

本指南将帮助您顺利部署项目到 Vercel 并解决常见问题。

## 📦 快速部署

### 1. 连接 GitHub 到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **New Project**
4. 从列表中选择此 GitHub 仓库
5. Vercel 会自动检测项目配置

### 2. 项目配置确认

Vercel 会自动识别以下配置（由 `vercel.json` 提供）：

```json
{
  "buildCommand": "npm run i18n:build && npm run build",
  "outputDirectory": "dist"
}
```

- **Framework Preset**: Vite
- **Build Command**: `npm run i18n:build && npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x 或更高

### 3. 部署

点击 **Deploy** 按钮，等待构建完成（通常 2-5 分钟）。

---

## 🔍 问题排查指南

### ❌ 问题 1: 网站打不开或显示空白页

**可能原因**：
- 构建失败
- 输出目录配置错误
- JavaScript 加载失败

**排查步骤**：

1. **检查构建日志**
   - 进入 Vercel 项目控制台
   - 点击失败的部署
   - 查看 **Build Logs** 标签
   - 查找红色错误信息

2. **常见构建错误**

   **错误示例 1**: `Module not found`
   ```bash
   Error: Cannot find module 'xxx'
   ```
   **解决方案**: 确保 `package.json` 中包含该依赖，提交并重新部署

   **错误示例 2**: `build script not found`
   ```bash
   npm ERR! missing script: build
   ```
   **解决方案**: 检查 `vercel.json` 中的 buildCommand 是否正确

3. **检查浏览器控制台**
   - 打开浏览器开发者工具（F12）
   - 查看 **Console** 标签
   - 检查是否有 JavaScript 错误
   - 查看 **Network** 标签，确认资源加载状态

---

### ❌ 问题 2: 刷新页面后显示 404

**原因**: SPA 路由未正确配置

**解决方案**: 已通过 `vercel.json` 配置解决

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

如果仍有问题：
- 确保 `vercel.json` 已提交到 GitHub
- 在 Vercel 控制台触发 **Redeploy**

---

### ❌ 问题 3: MIME 类型错误 - CSS/JS 文件加载失败 ⚠️

**错误表现**：
```
Refused to apply style from '...' because its MIME type ('text/html') 
is not a supported stylesheet MIME type
```

**原因**: `vite.config.js` 中的 `base` 路径配置错误

**诊断**：
1. 打开浏览器 Network 标签，检查失败的资源 URL
2. 如果 URL 包含多余的路径前缀（如 `/TYM/assets/...`），说明 base 路径配置错误

**解决方案**：

检查 `vite.config.js` 文件：

```js
// ❌ 错误配置（GitHub Pages 专用）
export default defineConfig({
  base: '/TYM/',  // 这会导致 Vercel 部署失败
})

// ✅ 正确配置（Vercel 部署）
export default defineConfig({
  base: '/',  // Vercel 使用根路径
})
```

**修复步骤**：
1. 修改 `vite.config.js` 中的 `base` 为 `'/'`
2. 提交代码到 GitHub
3. Vercel 会自动重新部署
4. 清除浏览器缓存后重新访问

**注意**：如果需要同时支持 GitHub Pages 和 Vercel，可以使用环境变量：

```js
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/TYM/',
})
```

---

### ❌ 问题 4: 多语言（i18n）不工作

**原因**: i18n 文件未在构建前生成

**解决方案**: 
`vercel.json` 已配置在构建前执行 `i18n:build`：

```json
{
  "buildCommand": "npm run i18n:build && npm run build"
}
```

**验证步骤**：
1. 在构建日志中搜索 "i18n"
2. 确认看到 `npm run i18n:build` 执行成功
3. 检查是否生成了 `src/locales/` 目录下的翻译文件

---

### ❌ 问题 4: 环境变量未生效

**设置环境变量**：

1. 进入 Vercel 项目 → **Settings** → **Environment Variables**
2. 添加变量（例如 `VITE_API_URL`）
3. 选择环境（Production / Preview / Development）
4. 保存后重新部署

**注意**：
- Vite 项目的环境变量必须以 `VITE_` 开头
- 修改环境变量后需要重新部署才能生效

---

### ❌ 问题 5: 部署成功但样式丢失

**原因**: 静态资源路径错误

**排查**：
1. 检查浏览器 Network 标签，查看 CSS/JS 文件是否 404
2. 确认 `vite.config.js` 中的 `base` 配置

**解决方案**：
如果使用了自定义域名，确保 `vite.config.js` 中：

```js
export default {
  base: '/', // 默认值，通常不需要修改
}
```

---

### ❌ 问题 6: 构建时间过长或超时

**优化建议**：

1. **减少依赖大小**
   ```bash
   npm install --production
   ```

2. **启用构建缓存**（Vercel 自动启用）

3. **检查大文件**
   - 压缩图片（推荐使用 WebP 格式）
   - 移除未使用的依赖

---

## 🚀 CI/CD 自动化

### 自动部署触发条件

✅ **生产部署**（Production）
- Push 到 `main` 或 `master` 分支

✅ **预览部署**（Preview）
- Push 到其他分支
- 创建或更新 Pull Request

### 查看部署状态

1. **GitHub Checks**
   - 每次 Push 后，GitHub 会显示 Vercel 部署状态
   - 点击 "Details" 查看部署详情

2. **Vercel 控制台**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 查看所有部署历史

---

## 📊 性能优化建议

### 1. 启用图片优化

```json
// vercel.json
{
  "images": {
    "domains": ["your-image-domain.com"]
  }
}
```

### 2. 配置缓存策略

已在 `vercel.json` 中配置静态资源缓存：

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. 启用 Gzip 压缩

Vercel 自动启用 Gzip 和 Brotli 压缩，无需额外配置。

---

## 🛠️ 常用命令

### 本地测试构建

```bash
# 生成 i18n 文件
npm run i18n:build

# 构建项目
npm run build

# 本地预览构建结果
npm run preview
```

### 手动触发 Vercel 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署到生产环境
vercel --prod
```

---

## 📞 获取帮助

### Vercel 构建日志位置

1. 进入项目控制台
2. 点击部署记录
3. 查看 **Build Logs**、**Function Logs** 和 **Edge Logs**

### 常见资源

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router 部署](https://reactrouter.com/en/main/guides/deployment)

---

## ✅ 检查清单

部署前确认：

- [ ] `vercel.json` 已创建并提交
- [ ] `.gitignore` 包含 `.vercel` 目录
- [ ] `package.json` 包含所有依赖
- [ ] 本地运行 `npm run build` 成功
- [ ] 本地运行 `npm run preview` 可访问
- [ ] 所有更改已提交到 GitHub

---

**最后更新**: 2024-01
**项目框架**: Vite + React + React Router
