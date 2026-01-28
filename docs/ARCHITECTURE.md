# 🏗️ 项目架构文档

> 本文档描述 **React 模板展示项目** 的技术架构、项目结构、编码规范和视觉设计系统。

---

## 📦 技术栈（Tech Stack）

### 核心框架

| 依赖 | 版本 | 说明 |
|------|------|------|
| **React** | `^19.2.0` | UI 框架，使用最新 React 19 特性 |
| **React DOM** | `^19.2.0` | React 的 DOM 渲染器 |
| **Vite** | `^7.2.4` | 下一代前端构建工具，极速 HMR |

### 路由与状态管理

| 依赖 | 版本 | 说明 |
|------|------|------|
| **React Router DOM** | `^7.10.1` | 声明式路由，支持嵌套路由和数据加载 |

### 动画与交互

| 依赖 | 版本 | 说明 |
|------|------|------|
| **Framer Motion** | `^12.23.26` | 强大的 React 动画库，支持手势和布局动画 |
| **Lenis** | `^1.3.17` | 平滑滚动库，提供丝滑的滚动体验 |

### 3D 渲染

| 依赖 | 版本 | 说明 |
|------|------|------|
| **Three.js** | `^0.182.0` | JavaScript 3D 图形库 |
| **@react-three/fiber** | `^9.5.0` | React 的 Three.js 渲染器 |
| **@react-three/drei** | `^10.7.7` | React Three Fiber 的实用工具集合 |

### 物理模拟

| 依赖 | 版本 | 说明 |
|------|------|------|
| **Matter.js** | `^0.20.0` | 2D 物理引擎，用于交互动效 |

### 国际化

| 依赖 | 版本 | 说明 |
|------|------|------|
| **i18next** | `^25.7.3` | 国际化框架 |
| **react-i18next** | `^16.5.0` | i18next 的 React 集成 |
| **i18next-browser-languagedetector** | `^8.2.0` | 浏览器语言检测 |

### 调试工具

| 依赖 | 版本 | 说明 |
|------|------|------|
| **Leva** | `^0.10.1` | GUI 调试面板，用于实时调参 |

### 开发工具

| 依赖 | 版本 | 说明 |
|------|------|------|
| **ESLint** | `^9.39.1` | 代码质量检查 |
| **@vitejs/plugin-react** | `^5.1.1` | Vite 的 React 插件 |
| **eslint-plugin-react-hooks** | `^7.0.1` | React Hooks 规则检查 |
| **eslint-plugin-react-refresh** | `^0.4.24` | React Fast Refresh 规则 |

---

## 📁 项目结构（Project Structure）

```
project-root/
├── public/                    # 静态资源目录
│   ├── images/               # 图片资源（按 phase 分类）
│   │   ├── phase-01/        # Phase 1: 品牌识别
│   │   ├── phase-02/        # Phase 2: 产品落地
│   │   └── phase-03/        # Phase 3: 系统设计
│   └── vite.svg             # Vite logo
│
├── scripts/                   # 构建脚本
│   └── copy-404.js          # 404 页面复制脚本（用于 SPA 部署）
│
├── src/                       # 源代码目录
│   ├── assets/              # 静态资源（会被 Vite 处理）
│   │
│   ├── components/          # 可复用组件
│   │   ├── PhaseScreens/    # 案例展示屏幕组件集合
│   │   │   ├── hooks/       # PhaseScreens 专用 Hooks
│   │   │   ├── index.jsx    # 统一导出
│   │   │   └── *.jsx        # 各类屏幕组件
│   │   ├── Scrollytelling/  # 滚动叙事组件
│   │   ├── ScrollParallaxShowcase/ # 视差滚动展示
│   │   ├── ServiceSection/  # 服务区块组件
│   │   ├── BlindsTransition/# 百叶窗过渡效果
│   │   ├── Layout.jsx       # 全局布局（导航栏、主题切换）
│   │   ├── LanguageSwitcher.jsx # 语言切换器
│   │   ├── TableOfContents.jsx  # 目录组件
│   │   ├── BackToTop.jsx    # 返回顶部按钮
│   │   └── ScrollToTop.jsx  # 路由切换时滚动到顶部
│   │
│   ├── config/              # 配置文件
│   │   ├── phaseConfig.js   # Phase 配置（案例数据）
│   │   └── transitionConfig.js # 过渡动画配置
│   │
│   ├── contexts/            # React Context
│   │   ├── LenisContext.jsx # Lenis 平滑滚动上下文
│   │   └── ScrollLockContext.jsx # 滚动锁定上下文
│   │
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useTheme.jsx     # 主题切换 Hook
│   │   ├── useLanguage.js   # 语言切换 Hook
│   │   ├── useClipboard.js  # 剪贴板 Hook
│   │   └── useTitle.js      # 页面标题 Hook
│   │
│   ├── i18n/                # i18n 配置
│   │   └── index.js         # i18next 初始化
│   │
│   ├── locales/             # 国际化翻译文件
│   │   ├── en/              # 英文翻译
│   │   │   └── translation.json
│   │   └── zh/              # 中文翻译
│   │       └── translation.json
│   │
│   ├── pages/               # 页面组件
│   │   ├── demos/           # 演示页面
│   │   │   ├── ColorRevealDemo.jsx
│   │   │   ├── ImmersiveGalleryDemo.jsx
│   │   │   └── ...
│   │   ├── templates/       # 页面模板
│   │   │   ├── Template2.jsx
│   │   │   ├── Template3.jsx
│   │   │   └── Template4.jsx
│   │   ├── Home.jsx         # 首页
│   │   ├── About.jsx        # 关于页
│   │   ├── Work.jsx         # 作品页
│   │   ├── CaseIndex.jsx    # 案例索引页
│   │   ├── CaseChapter.jsx  # 案例章节页
│   │   └── ...
│   │
│   ├── utils/               # 工具函数
│   │
│   ├── App.jsx              # 应用根组件（路由配置）
│   ├── App.css              # 应用级样式
│   ├── main.jsx             # 应用入口
│   └── index.css            # 全局样式 + Design Tokens
│
├── index.html               # HTML 入口
├── package.json             # 依赖配置
├── vite.config.js           # Vite 配置
├── eslint.config.js         # ESLint 配置
└── README.md                # 项目说明
```

### 目录职责说明

| 目录 | 职责 |
|------|------|
| `components/` | 可复用的 UI 组件，与业务逻辑解耦 |
| `components/PhaseScreens/` | 案例展示专用组件，按屏幕类型拆分 |
| `pages/` | 路由对应的页面组件 |
| `pages/demos/` | 功能演示页面，展示各种交互效果 |
| `pages/templates/` | 可复用的页面模板 |
| `hooks/` | 跨组件共享的自定义 Hooks |
| `contexts/` | 全局状态管理（Context API） |
| `config/` | 静态配置数据 |
| `locales/` | 多语言翻译文件 |
| `utils/` | 通用工具函数 |

---

## 📐 编码规范（Coding Guardrails）

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| **组件文件** | PascalCase | `LanguageSwitcher.jsx` |
| **普通文件** | camelCase | `phaseConfig.js` |
| **组件名** | PascalCase | `TableOfContents` |
| **函数/变量** | camelCase | `handleClick`, `isVisible` |
| **常量** | SCREAMING_SNAKE_CASE | `MAX_ITEMS`, `API_BASE_URL` |
| **CSS 变量** | kebab-case | `--color-bg`, `--space-md` |
| **自定义 Hook** | use 前缀 + PascalCase | `useTheme`, `useClipboard` |
| **Context** | PascalCase + Context 后缀 | `LenisContext`, `ScrollLockContext` |

### 组件结构规范

```jsx
// 1. 导入顺序
import { useState, useEffect } from 'react'     // React 核心
import { motion } from 'framer-motion'          // 第三方库
import { useTheme } from '../hooks/useTheme'    // 内部 Hooks
import { Button } from './Button'               // 内部组件
import styles from './Component.module.css'     // 样式文件

// 2. 组件定义
export function ComponentName({ prop1, prop2 = 'default' }) {
  // 2.1 Hooks 调用（顶部）
  const [state, setState] = useState(null)
  const { theme } = useTheme()
  
  // 2.2 事件处理函数
  const handleClick = () => {
    // ...
  }
  
  // 2.3 副作用
  useEffect(() => {
    // ...
  }, [])
  
  // 2.4 渲染
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### 文件组织原则

1. **单一职责**：每个文件只做一件事
2. **就近原则**：相关文件放在一起（如 `PhaseScreens/hooks/`）
3. **统一导出**：使用 `index.jsx` 或 `index.js` 统一导出模块
4. **扁平优先**：避免过深的目录嵌套（建议不超过 3 层）

### ESLint 配置要点

项目使用 ESLint 9.x 的新 Flat Config 格式：

```js
// eslint.config.js
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

### 最佳实践

1. **使用函数组件 + Hooks**：不使用 Class 组件
2. **优先使用 Named Export**：便于重构和 Tree Shaking
3. **避免 Props Drilling**：合理使用 Context
4. **动画性能**：使用 `transform` 和 `opacity`，避免 `width/height` 动画
5. **图片优化**：使用合适的图片格式和尺寸
6. **国际化**：所有用户可见文本使用 `t()` 函数

---

## 🎨 视觉设计规范（Design System）

### Design Tokens 概览

所有设计令牌定义在 `src/index.css` 的 `:root` 选择器中。

### 颜色系统

#### 亮色主题（默认）

```css
/* 背景色 */
--color-bg: #ffffff;           /* 主背景 */
--color-bg-subtle: #fafafa;    /* 次级背景 */
--color-bg-alt: #f5f5f5;       /* 备选背景 */
--color-bg-elevated: #ffffff;  /* 提升层背景 */
--color-bg-inverse: #111111;   /* 反转背景 */

/* 表面色（卡片、面板） */
--color-surface: #ffffff;
--color-surface-hover: #fafafa;
--color-surface-active: #f5f5f5;

/* 文字色 */
--color-text-main: #111111;      /* 主文字 */
--color-text-secondary: #444444; /* 次级文字 */
--color-text-muted: #666666;     /* 弱化文字 */
--color-text-light: #999999;     /* 浅色文字 */
--color-text-inverse: #ffffff;   /* 反转文字 */

/* 边框色 */
--color-border: #eaeaea;
--color-border-hover: #cccccc;
--color-border-strong: #999999;

/* 交互色 */
--color-primary: #111111;
--color-primary-hover: #333333;
--color-accent: #0066ff;
--color-accent-hover: #0052cc;

/* 状态色 */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* 遮罩与阴影 */
--color-overlay: rgba(0, 0, 0, 0.5);
--color-shadow: rgba(0, 0, 0, 0.1);
--color-shadow-light: rgba(0, 0, 0, 0.05);
```

#### 暗色主题

通过 `[data-theme='dark']` 选择器覆盖：

```css
[data-theme='dark'] {
  /* 背景色 */
  --color-bg: #0a0a0a;
  --color-bg-subtle: #111111;
  --color-bg-alt: #1a1a1a;
  --color-bg-elevated: #1f1f1f;
  --color-bg-inverse: #ffffff;

  /* 表面色 */
  --color-surface: #1a1a1a;
  --color-surface-hover: #222222;
  --color-surface-active: #2a2a2a;

  /* 文字色 */
  --color-text-main: #f5f5f5;
  --color-text-secondary: #cccccc;
  --color-text-muted: #999999;
  --color-text-light: #666666;
  --color-text-inverse: #111111;

  /* 边框色 */
  --color-border: #2a2a2a;
  --color-border-hover: #444444;
  --color-border-strong: #666666;

  /* 交互色 */
  --color-primary: #ffffff;
  --color-primary-hover: #e0e0e0;
  --color-accent: #3b82f6;
  --color-accent-hover: #60a5fa;

  /* 遮罩与阴影 */
  --color-overlay: rgba(0, 0, 0, 0.7);
  --color-shadow: rgba(0, 0, 0, 0.4);
  --color-shadow-light: rgba(0, 0, 0, 0.2);
}
```

### 字体系统

```css
/* 字体家族 */
--font-serif: 'Playfair Display', serif;  /* 标题 */
--font-sans: 'Inter', sans-serif;         /* 正文 */

/* 字体大小（响应式） */
--text-display: clamp(3.5rem, 12vw, 9rem);     /* 超大展示 */
--text-page-title: clamp(2.5rem, 6vw, 4.5rem); /* 页面标题 */
--text-hero-title: clamp(2rem, 5vw, 3.5rem);   /* Hero 标题 */
--text-h1: clamp(2.5rem, 8vw, 5.5rem);         /* H1 */
--text-h2: clamp(1.8rem, 4vw, 3.5rem);         /* H2 */
--text-h3: clamp(1.3rem, 3vw, 2.5rem);         /* H3 */
--text-body-lg: clamp(1.1rem, 2vw, 1.6rem);    /* 大正文 */
--text-body: 1rem;                              /* 正文 */
--text-sm: 0.875rem;                            /* 小号 */
--text-xs: 0.75rem;                             /* 超小 */

/* 行高 */
--line-height-tight: 1.1;    /* 紧凑 */
--line-height-snug: 1.3;     /* 略紧 */
--line-height-base: 1.6;     /* 标准 */
--line-height-relaxed: 1.8;  /* 宽松 */
```

### 间距系统

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 80px;
--space-section: 120px;  /* 区块间距 */
```

### 圆角系统

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;  /* 胶囊形 */
```

### 阴影系统

```css
--shadow-sm: 0 1px 2px var(--color-shadow-light);
--shadow-md: 0 4px 6px -1px var(--color-shadow-light), 
             0 2px 4px -1px var(--color-shadow-light);
--shadow-lg: 0 10px 15px -3px var(--color-shadow-light), 
             0 4px 6px -2px var(--color-shadow-light);
--shadow-xl: 0 20px 25px -5px var(--color-shadow), 
             0 10px 10px -5px var(--color-shadow-light);
--shadow-hover: 0 20px 40px -10px var(--color-shadow);
```

### 过渡动画

```css
--transition-fast: 150ms ease;   /* 快速响应 */
--transition-base: 200ms ease;   /* 标准过渡 */
--transition-slow: 300ms ease;   /* 慢速过渡 */
--transition-theme: 400ms ease;  /* 主题切换 */
```

### 工具类

```css
.font-serif { font-family: var(--font-serif); }
.font-sans { font-family: var(--font-sans); }
.text-balance { text-wrap: balance; }
.max-w-prose { max-width: 65ch; }

/* 玻璃态面板 */
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-sm);
}

/* 噪点背景 */
.noise-bg::before {
  /* SVG 噪点纹理 */
}

/* 胶囊按钮 */
.pill-button {
  padding: 12px 30px;
  border-radius: var(--radius-full);
  /* ... */
}
```

---

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

---

## 📝 更新日志

| 日期 | 版本 | 说明 |
|------|------|------|
| 2024-XX-XX | 1.0.0 | 初始架构文档 |

---

> 📌 **维护提示**：当添加新的设计令牌或修改项目结构时，请同步更新本文档。
