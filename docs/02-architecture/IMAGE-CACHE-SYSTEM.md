# 图片缓存系统 (Image Cache System)

> 本文档描述网站的图片缓存机制，包括架构设计、使用方法和最佳实践。

## 概述

网站实现了一套**多层级的图片缓存系统**，主要用于优化页面加载体验，避免用户在页面间导航时重复看到加载屏幕。该系统基于 React Context 和 Hooks 模式实现，提供会话级别的缓存管理。

### 核心目标

1. **减少重复加载** - 记录已加载的图片，避免重复请求
2. **优化用户体验** - 缓存命中时瞬间完成加载，无需显示加载屏幕
3. **灵活的阈值机制** - 不需要 100% 加载完成即可进入页面

## 架构设计

### 系统组成

```
┌─────────────────────────────────────────────────────────────┐
│                      ImageCacheProvider                      │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │   loadedImages      │  │      loadedPages            │   │
│  │   Set<string>       │  │      Set<string>            │   │
│  │   (图片URL集合)      │  │      (页面ID集合)            │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    useImagePreloader Hook                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ 页面级缓存检测 │  │ 浏览器缓存检测 │  │   并发图片加载    │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      LoadingScreen                           │
│           (显示加载进度、品牌动画、状态提示)                    │
└─────────────────────────────────────────────────────────────┘
```

### 文件结构

```
src/
├── contexts/
│   └── ImageCacheContext.jsx    # 全局缓存 Context
├── hooks/
│   └── useImagePreloader.js     # 预加载 Hook
└── components/
    └── LoadingScreen.jsx        # 加载界面组件
```

### Provider 层级

缓存 Provider 位于应用顶层，确保所有页面共享同一个缓存实例：

```jsx
// App.jsx
<ThemeProvider>
  <ImageCacheProvider>      {/* 👈 缓存 Provider */}
    <LenisProvider>
      <ScrollLockProvider>
        <BrowserRouter>
          {/* 路由和页面内容 */}
        </BrowserRouter>
      </ScrollLockProvider>
    </LenisProvider>
  </ImageCacheProvider>
</ThemeProvider>
```

## 核心组件

### 1. ImageCacheContext

全局缓存 Context，提供两个层级的缓存记录：

| 层级 | 数据结构 | 用途 |
|------|----------|------|
| **图片级缓存** | `Set<string>` | 记录已成功加载的图片 URL |
| **页面级缓存** | `Set<string>` | 记录已完成加载的页面标识符 |

#### API 参考

```typescript
interface ImageCacheContextValue {
  // 图片级别操作
  isImageCached(url: string): boolean;           // 检查图片是否在应用缓存中
  isImageInBrowserCache(url: string): boolean;   // 检查图片是否在浏览器缓存中
  markImageAsLoaded(url: string): void;          // 标记单张图片已加载
  markImagesAsLoaded(urls: string[]): void;      // 批量标记图片已加载
  checkCacheStatus(urls: string[]): CacheStatus; // 检查一组图片的缓存状态
  
  // 页面级别操作
  isPageLoaded(pageId: string): boolean;         // 检查页面是否已加载
  markPageAsLoaded(pageId: string): void;        // 标记页面已加载
  
  // 调试工具
  getCacheStats(): CacheStats;                   // 获取缓存统计信息
  clearCache(): void;                            // 清除所有缓存
}

interface CacheStatus {
  cached: number;      // 已缓存数量
  total: number;       // 总数量
  allCached: boolean;  // 是否全部已缓存
}

interface CacheStats {
  totalImages: number;   // 缓存的图片总数
  totalPages: number;    // 缓存的页面总数
  pages: string[];       // 已缓存的页面列表
}
```

### 2. useImagePreloader Hook

连接缓存和 UI 的桥梁，负责智能预加载图片。

#### 使用方法

```jsx
import { useImagePreloader } from '../hooks/useImagePreloader';

function MyPage() {
  const imageUrls = [
    '/images/hero.jpg',
    '/images/gallery/1.jpg',
    '/images/gallery/2.jpg',
  ];
  
  const {
    isLoading,      // 是否正在加载
    canEnter,       // 是否可以进入页面（达到阈值）
    progress,       // 加载进度 (0-100)
    loadedCount,    // 已加载数量
    totalCount,     // 总数量
    fromCache,      // 是否从缓存加载
  } = useImagePreloader(imageUrls, {
    enabled: true,          // 是否启用预加载
    threshold: 50,          // 进入阈值（默认 50%）
    pageId: 'my-page',      // 页面标识符
    onComplete: (result) => console.log('加载完成', result),
    onProgress: (info) => console.log('进度更新', info),
    onThresholdReached: (info) => console.log('达到阈值', info),
  });
  
  // 显示加载界面
  if (isLoading && !canEnter) {
    return <LoadingScreen isVisible={true} realProgress={progress} />;
  }
  
  return <div>页面内容</div>;
}
```

#### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | `boolean` | `true` | 是否启用预加载 |
| `threshold` | `number` | `50` | 进入阈值（0-100），达到此进度后 `canEnter` 为 `true` |
| `pageId` | `string` | `''` | 页面标识符，用于页面级缓存检测 |
| `onComplete` | `function` | - | 加载完成回调 |
| `onProgress` | `function` | - | 进度更新回调 |
| `onThresholdReached` | `function` | - | 达到阈值回调 |

### 3. LoadingScreen 组件

显示加载进度的 UI 组件，具有以下特点：

- **乐观加载动画** - 即使实际进度为 0，也会显示初始进度（最高 15%）
- **进度映射** - 使用 easing 函数平滑进度显示
- **最小动画时长** - 默认 2.5 秒，确保用户有足够时间看到品牌 Logo
- **动态提示文本** - 根据进度显示不同的加载提示

```jsx
<LoadingScreen
  isVisible={isLoading}
  realProgress={progress}
  loadedCount={loadedCount}
  totalCount={totalCount}
  phaseNumber="05"          // 可选：Phase 编号
  threshold={50}            // 映射阈值
  minDuration={2500}        // 最小动画时长（毫秒）
  onAnimationComplete={() => setShowContent(true)}
/>
```

## 加载优化策略

预加载器采用三层缓存检测策略：

```
1️⃣ 检查页面级缓存
   ↓ 如果 pageId 已加载 → 直接跳过预加载，瞬间完成 🚀
   
2️⃣ 检查所有图片是否已在浏览器缓存
   ↓ 如果全部缓存命中 → 快速完成，标记所有图片 🚀
   
3️⃣ 正常加载流程
   → 并发加载所有图片
   → 更新进度
   → 达到阈值后允许进入页面
   → 完成后标记缓存
```

### 浏览器缓存检测

通过 `Image` 对象的 `complete` 属性检测图片是否已在浏览器缓存中：

```javascript
const checkBrowserCache = (url) => {
  const img = new Image();
  img.src = url;
  // 如果图片已在浏览器缓存中，complete 会立即为 true
  return img.complete && img.naturalWidth > 0;
};
```

## 当前使用场景

| 页面 | 文件 | pageId | 说明 |
|------|------|--------|------|
| 首页 | `Home.jsx` | `home` | 预加载首页所有图片资源 |
| 作品页 | `Work.jsx` | `work` | 预加载作品展示图片 |
| 画廊页 | `Gallery.jsx` | `gallery` | 预加载画廊模块图片 |
| Phase详情 | `PhaseDetail.jsx` | `phase-{id}` | 预加载案例研究图片 |

## 最佳实践

### 1. 合理设置 pageId

为每个需要预加载的页面设置唯一的 `pageId`：

```jsx
// ✅ 好的做法
useImagePreloader(images, { pageId: 'gallery-module-1' });

// ❌ 避免：不设置 pageId 会失去页面级缓存优化
useImagePreloader(images, {});
```

### 2. 选择合适的阈值

根据页面内容选择合适的加载阈值：

```jsx
// 首页：需要快速进入，50% 即可
useImagePreloader(images, { threshold: 50 });

// 画廊页：图片是核心内容，建议更高阈值
useImagePreloader(images, { threshold: 70 });
```

### 3. 处理动态图片列表

确保图片 URL 列表稳定，避免不必要的重新加载：

```jsx
// ✅ 使用 useMemo 稳定图片列表
const imageUrls = useMemo(() => 
  works.map(work => work.coverImage),
  [works]
);

// ❌ 避免：每次渲染都创建新数组
const imageUrls = works.map(work => work.coverImage);
```

### 4. 优雅降级

Hook 在没有 Provider 时会自动降级，返回安全的默认值：

```jsx
// 即使忘记包裹 Provider，页面也不会崩溃
const { isLoading } = useImagePreloader(images);
// isLoading = false, 页面正常显示
```

## 调试技巧

### 查看缓存状态

在浏览器控制台中使用 React DevTools 或在组件中：

```jsx
import { useImageCache } from '../contexts/ImageCacheContext';

function DebugPanel() {
  const { getCacheStats } = useImageCache();
  
  useEffect(() => {
    console.log('Cache Stats:', getCacheStats());
  }, []);
  
  return null;
}
```

### 清除缓存测试

```jsx
const { clearCache } = useImageCache();

// 测试时清除缓存
clearCache();
```

### 控制台日志

预加载器会在控制台输出调试信息：

```
[ImagePreloader] 🚀 Page "home" already loaded, skipping preload
[ImagePreloader] Cache check: 15/15 cached
[ImagePreloader] 🚀 All images cached! Fast-forwarding...
[ImagePreloader] Completed: 20 success, 0 failed, 5 from browser cache
```

## 技术细节

### 缓存生命周期

- **作用域**：会话级别（Session Level）
- **持久化**：无（刷新页面后重置）
- **存储位置**：React State（内存）

### 性能优化

1. **使用 Set 数据结构** - O(1) 查找复杂度
2. **Memoization** - `useMemo` 和 `useCallback` 避免不必要的重渲染
3. **并发加载** - 使用 `Promise.all` 并发加载所有图片
4. **CORS 处理** - 设置 `crossOrigin = 'anonymous'` 避免跨域问题

## 未来改进方向

1. **持久化缓存** - 使用 `localStorage` 或 `IndexedDB` 实现跨会话缓存
2. **缓存过期机制** - 添加 TTL（Time To Live）支持
3. **Service Worker** - 实现更强大的离线缓存
4. **缓存大小限制** - 添加 LRU 淘汰策略
5. **预加载优先级** - 支持关键图片优先加载

## 相关文档

- [组件架构](./COMPONENTS.md)
- [系统架构](./ARCHITECTURE.md)
- [图片系统最佳实践](../04-image-system/BEST-PRACTICES.md)
