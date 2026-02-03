# 🛠️ 开发指南

> 本文档帮助开发者快速搭建本地开发环境并开始开发。

---

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [项目脚本](#项目脚本)
- [开发服务器配置](#开发服务器配置)
- [VS Code 推荐配置](#vs-code-推荐配置)
- [调试技巧](#调试技巧)
- [开发工作流](#开发工作流)
- [常见问题](#常见问题)

---

## 环境要求

| 工具 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| **Node.js** | 18.x | 20.x LTS | [下载地址](https://nodejs.org/) |
| **npm** | 9.x | 10.x | 随 Node.js 安装 |
| **Git** | 2.x | 最新版 | [下载地址](https://git-scm.com/) |

### 检查环境

```bash
# 检查 Node.js 版本
node -v
# 输出应为 v18.x.x 或更高

# 检查 npm 版本
npm -v
# 输出应为 9.x.x 或更高

# 检查 Git 版本
git --version
```

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/TYM.git
cd TYM
```

### 2. 安装依赖

```bash
npm install
```

> ⚠️ 如果遇到网络问题，可使用淘宝镜像：
> ```bash
> npm install --registry=https://registry.npmmirror.com
> ```

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器启动后，访问：**http://localhost:7845**

### 快捷启动（Windows）

双击项目根目录的 `start-dev.bat` 即可启动开发服务器。

---

## 项目脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 7845） |
| `npm run build` | 构建生产版本到 `dist/` 目录 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 代码检查 |

---

## 开发服务器配置

开发服务器配置在 `vite.config.js`：

```js
export default defineConfig({
  plugins: [react()],
  base: '/TYM/',           // GitHub Pages 基础路径
  server: {
    port: 7845,            // 开发服务器端口
  },
})
```

### 修改端口

如需修改端口，编辑 `vite.config.js` 中的 `server.port`。

### 开启 HTTPS（可选）

```js
server: {
  port: 7845,
  https: true,
}
```

### 允许局域网访问

```js
server: {
  port: 7845,
  host: true,  // 或指定 IP: '0.0.0.0'
}
```

---

## VS Code 推荐配置

### 推荐扩展

在项目中创建 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "naumovs.color-highlight",
    "PKief.material-icon-theme",
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### 扩展说明

| 扩展 | 用途 |
|------|------|
| **ESLint** | JavaScript/JSX 代码检查 |
| **Prettier** | 代码格式化 |
| **ES7+ React Snippets** | React 代码片段（`rafce` 快速创建组件） |
| **Auto Rename Tag** | 自动重命名配对标签 |
| **Color Highlight** | CSS 颜色可视化 |
| **Path Intellisense** | 路径自动补全 |

### 工作区设置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact"],
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.jsx": "javascriptreact"
  }
}
```

### 代码片段

创建 `.vscode/react.code-snippets`：

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "export function ${TM_FILENAME_BASE}({ $1 }) {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  )",
      "}",
      ""
    ],
    "description": "React Functional Component"
  },
  "useState Hook": {
    "prefix": "us",
    "body": "const [$1, set${1/(.*)/${1:/capitalize}/}] = useState($2)",
    "description": "useState Hook"
  },
  "useEffect Hook": {
    "prefix": "ue",
    "body": [
      "useEffect(() => {",
      "  $0",
      "}, [$1])"
    ],
    "description": "useEffect Hook"
  }
}
```

---

## 调试技巧

### 1. React Developer Tools

安装 Chrome 扩展 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)，可以：
- 查看组件树
- 检查 Props 和 State
- 分析组件性能

### 2. Leva 调试面板

项目集成了 Leva 调试面板，用于实时调整动画参数：

```jsx
import { useControls } from 'leva'

function MyComponent() {
  const { speed, opacity } = useControls({
    speed: { value: 1, min: 0, max: 10 },
    opacity: { value: 1, min: 0, max: 1 },
  })
  
  return <div style={{ opacity }}>...</div>
}
```

调试面板会显示在页面右上角。

### 3. 过渡动画调试

使用 `TransitionDebugger` 组件可视化调试屏幕过渡：

```jsx
import { TransitionDebugger } from './components/PhaseScreens/TransitionDebugger'

// 仅开发环境启用
{process.env.NODE_ENV === 'development' && <TransitionDebugger />}
```

### 4. Framer Motion 调试

使用 `MotionConfig` 降低动画速度便于调试：

```jsx
import { MotionConfig } from 'framer-motion'

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

### 5. 控制台日志

项目中使用条件日志，仅开发环境输出：

```jsx
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### 6. 网络请求调试

使用 Chrome DevTools Network 面板：
- 查看图片加载情况
- 检查资源大小
- 模拟慢速网络

---

## 开发工作流

### 1. 创建新组件

```bash
# 在 components 目录下创建
src/components/MyComponent.jsx
```

组件模板：

```jsx
import { motion } from 'framer-motion'

export function MyComponent({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>{title}</h2>
      {children}
    </motion.div>
  )
}
```

### 2. 创建新页面

```bash
# 在 pages 目录下创建
src/pages/MyPage.jsx
```

然后在 `App.jsx` 中添加路由：

```jsx
import MyPage from './pages/MyPage'

<Route path="/my-page" element={<MyPage />} />
```

### 3. 添加翻译

编辑 `src/locales/zh/translation.json` 和 `src/locales/en/translation.json`：

```json
{
  "myPage": {
    "title": "我的页面",
    "description": "这是描述"
  }
}
```

在组件中使用：

```jsx
import { useTranslation } from 'react-i18next'

function MyPage() {
  const { t } = useTranslation()
  return <h1>{t('myPage.title')}</h1>
}
```

### 4. 添加新屏幕组件

在 `src/components/PhaseScreens/` 目录创建，并在 `index.jsx` 中导出：

```jsx
// index.jsx
export { MyScreen } from './MyScreen'
```

### 5. 代码提交

```bash
# 检查代码
npm run lint

# 提交代码
git add .
git commit -m "feat: add MyComponent"
git push
```

---

## 常见问题

### Q1: `npm install` 失败

**原因**：网络问题或 npm 版本过低

**解决方案**：

```bash
# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com

# 或清除缓存后重试
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Q2: 端口 7845 被占用

**解决方案**：

方法 1：修改端口

```js
// vite.config.js
server: {
  port: 3000,  // 改为其他端口
}
```

方法 2：终止占用进程（Windows）

```bash
netstat -ano | findstr :7845
taskkill /PID <PID> /F
```

---

### Q3: 热更新（HMR）不工作

**可能原因**：
1. 文件保存未触发
2. 组件没有正确导出
3. 浏览器缓存

**解决方案**：

```bash
# 硬刷新浏览器
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# 或重启开发服务器
npm run dev
```

---

### Q4: ESLint 报错但不知道如何修复

**解决方案**：

```bash
# 自动修复可修复的问题
npx eslint --fix src/

# 查看详细错误
npm run lint
```

---

### Q5: 图片加载 404

**原因**：路径错误

**解决方案**：

```jsx
// ❌ 错误：相对路径在构建后可能失效
<img src="./images/photo.png" />

// ✅ 正确：使用 public 目录的绝对路径
<img src="/TYM/images/photo.png" />

// ✅ 或使用 import（会被 Vite 处理）
import photo from '../assets/photo.png'
<img src={photo} />
```

---

### Q6: Lenis 平滑滚动不工作

**解决方案**：

确保 `LenisContext` 正确包裹应用：

```jsx
import { LenisProvider } from './contexts/LenisContext'

<LenisProvider>
  <App />
</LenisProvider>
```

检查是否有 CSS 覆盖：

```css
/* 确保没有这个样式 */
html, body {
  overflow: hidden; /* 这会禁用 Lenis */
}
```

---

### Q7: Framer Motion 动画卡顿

**原因**：触发了布局重排

**解决方案**：

```jsx
// ❌ 避免动画这些属性
animate={{ width: 100, height: 100, left: 50 }}

// ✅ 使用 transform 属性
animate={{ scale: 1.5, x: 50, y: 50 }}

// ✅ 使用 layout 属性处理布局动画
<motion.div layout>...</motion.div>
```

---

### Q8: 构建后页面空白

**原因**：`base` 配置与部署路径不匹配

**解决方案**：

检查 `vite.config.js` 中的 `base` 设置：

```js
// 如果部署到根目录
base: '/'

// 如果部署到 /TYM/ 子路径
base: '/TYM/'
```

---

### Q9: i18n 翻译不显示

**可能原因**：
1. 翻译 key 拼写错误
2. 翻译文件语法错误

**解决方案**：

```bash
# 检查 JSON 语法
npx jsonlint src/locales/zh/translation.json
```

确保 key 存在：

```jsx
// 检查 key 是否存在
console.log(t('myKey', { returnObjects: true }))
```

---

### Q10: Three.js / React Three Fiber 报错

**常见错误**：`Cannot read property 'getContext' of null`

**解决方案**：

确保 Canvas 有明确的尺寸：

```jsx
<Canvas style={{ width: '100%', height: '100vh' }}>
  <mesh>...</mesh>
</Canvas>
```

---

## 🔗 相关文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 项目架构
- [COMPONENTS.md](./COMPONENTS.md) - 组件库文档
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南

---

> 💡 遇到其他问题？请在 GitHub Issues 中提问或查阅 [Vite 文档](https://vitejs.dev/) 和 [React 文档](https://react.dev/)。
