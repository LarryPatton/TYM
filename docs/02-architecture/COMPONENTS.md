# 📦 组件库文档

> 本文档描述项目中所有可复用组件的 API、Props 和使用示例。

---

## 目录

- [通用组件](#通用组件)
- [布局组件](#布局组件)
- [PhaseScreens 屏幕组件](#phasescreens-屏幕组件)
  - [入口与介绍类](#入口与介绍类)
  - [内容展示类](#内容展示类)
  - [图片画廊类](#图片画廊类)
  - [滚动驱动类](#滚动驱动类)
  - [交互动效类](#交互动效类)
  - [工具与辅助类](#工具与辅助类)
- [滚动叙事组件](#滚动叙事组件)

---

## 通用组件

### `Layout`

全局布局组件，包含导航栏和主题切换功能。

```jsx
import Layout from './components/Layout'

// App.jsx 中使用
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**内部组件：**
- `ThemeToggle` - 主题切换按钮（亮/暗模式）

---

### `LanguageSwitcher`

语言切换下拉菜单组件。

```jsx
import { LanguageSwitcher } from './components/LanguageSwitcher'

<LanguageSwitcher 
  variant="dropdown"     // 'dropdown' | 'inline'
  showLabel={true}       // 是否显示语言标签
  className=""           // 自定义类名
/>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'dropdown' \| 'inline'` | `'dropdown'` | 显示模式 |
| `showLabel` | `boolean` | `true` | 是否显示语言文字 |
| `className` | `string` | `''` | 自定义样式类 |

---

### `BackToTop`

返回顶部浮动按钮，滚动一定距离后显示。

```jsx
import BackToTop from './components/BackToTop'

<BackToTop />
```

---

### `ScrollToTop`

路由切换时自动滚动到页面顶部（无 UI）。

```jsx
import ScrollToTop from './components/ScrollToTop'

// 放在 Router 内部
<BrowserRouter>
  <ScrollToTop />
  <Routes>...</Routes>
</BrowserRouter>
```

---

### `TableOfContents`

侧边目录导航组件，用于长页面快速跳转。

```jsx
import TableOfContents from './components/TableOfContents'

<TableOfContents 
  categories={[
    { id: 'section-1', label: '第一节' },
    { id: 'section-2', label: '第二节' },
  ]} 
/>
```

| Prop | 类型 | 说明 |
|------|------|------|
| `categories` | `Array<{ id: string, label: string }>` | 目录项列表 |

---

## 布局组件

### `FullPageScroll`

全屏滚动容器，支持分页滚动效果。

```jsx
import { FullPageScroll, FullPageSection, DotNavigation } from './components/FullPageScroll'

<FullPageScroll 
  onSectionChange={(index) => console.log(index)}
  navHeight={80}
>
  <FullPageSection id="section-1" bgColor="#fff">
    内容 1
  </FullPageSection>
  <FullPageSection id="section-2" bgColor="#000">
    内容 2
  </FullPageSection>
</FullPageScroll>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `onSectionChange` | `(index: number) => void` | - | 切换回调 |
| `navHeight` | `number` | `80` | 导航栏高度（px） |

**子组件：**
- `FullPageSection` - 全屏区块
- `DotNavigation` - 圆点导航指示器
- `useScrollContext` - 获取滚动上下文 Hook

---

## PhaseScreens 屏幕组件

这是项目的核心组件库，用于构建案例展示页面。所有组件位于 `src/components/PhaseScreens/` 目录。

### 入口与介绍类

#### `IntroScreen`

案例介绍屏幕，通常作为 Phase 的第一个屏幕。

```jsx
import { IntroScreen } from './components/PhaseScreens'

<IntroScreen 
  title="Phase 01"
  subtitle="Brand Identity"
  description="品牌识别系统设计"
  bgImage="/images/cover.png"
  textColor="#fff"
  showScrollHint={true}
/>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 主标题 |
| `subtitle` | `string` | - | 副标题 |
| `description` | `string` | - | 描述文本 |
| `bgImage` | `string` | - | 背景图片 URL |
| `textColor` | `string` | `'#fff'` | 文字颜色 |
| `showScrollHint` | `boolean` | `true` | 显示滚动提示 |

---

#### `PhaseClosingScreen`

Phase 结束屏幕，展示总结信息。

```jsx
import { PhaseClosingScreen } from './components/PhaseScreens'

<PhaseClosingScreen 
  phaseNumber="01"
  title="Phase Complete"
  image="/images/closing.png"
/>
```

---

#### `CorePrinciplesScreen`

核心原则展示屏幕。

```jsx
import { CorePrinciplesScreen } from './components/PhaseScreens'

<CorePrinciplesScreen />
```

---

### 内容展示类

#### `ContentScreen`

通用内容屏幕，支持多种内容布局。

```jsx
import { ContentScreen } from './components/PhaseScreens'

<ContentScreen 
  title="CMF 设计"
  description="色彩材质表面处理"
  image="/images/cmf.png"
  variant="color"         // 'color' | 'typography' | 'cmf-final' | 'default'
  layout="left"          // 'left' | 'right' | 'center'
/>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 标题 |
| `description` | `string` | - | 描述 |
| `image` | `string` | - | 图片路径 |
| `variant` | `string` | `'default'` | 内容变体 |
| `layout` | `string` | `'left'` | 布局方向 |

---

#### `ComparisonScreen`

对比展示屏幕，用于前后对比。

```jsx
import { ComparisonScreen } from './components/PhaseScreens'

<ComparisonScreen 
  beforeImage="/images/before.png"
  afterImage="/images/after.png"
  beforeLabel="Before"
  afterLabel="After"
  variant="images"       // 'images' | 'default'
/>
```

---

#### `PrinciplesScreen`

设计原则展示屏幕。

```jsx
import { PrinciplesScreen } from './components/PhaseScreens'

<PrinciplesScreen 
  principles={[
    { title: '一致性', description: '保持视觉一致' },
    { title: '简洁性', description: '去除冗余元素' },
  ]}
/>
```

---

#### `SummaryScreen`

总结屏幕，展示阶段性成果。

```jsx
import { SummaryScreen } from './components/PhaseScreens'

<SummaryScreen 
  title="项目总结"
  image="/images/summary.png"
  variant="phase01"      // 'phase01' | 'default'
/>
```

---

#### `SummaryTextHighlightScreen`

带文字高亮效果的总结屏幕。

```jsx
import { SummaryTextHighlightScreen } from './components/PhaseScreens'

<SummaryTextHighlightScreen 
  text="这是一段需要高亮的总结文字"
  highlightWords={['高亮', '总结']}
  highlightColor="#FF4600"
/>
```

---

#### `StabilityMessageScreen`

稳定性消息屏幕，带打字机效果。

```jsx
import { StabilityMessageScreen } from './components/PhaseScreens'

<StabilityMessageScreen />
```

---

### 图片画廊类

#### `GalleryScreen`

通用图片画廊屏幕。

```jsx
import { GalleryScreen } from './components/PhaseScreens'

<GalleryScreen 
  images={[
    '/images/01.png',
    '/images/02.png',
  ]}
  variant="validation"   // 'validation' | 'default'
  columns={3}
  gap={16}
/>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `images` | `string[]` | `[]` | 图片路径数组 |
| `variant` | `string` | `'default'` | 画廊变体 |
| `columns` | `number` | `3` | 列数 |
| `gap` | `number` | `16` | 间距（px） |

---

#### `FlyInGalleryScreen`

飞入动画画廊，图片从四周飞入。

```jsx
import { FlyInGalleryScreen } from './components/PhaseScreens'

<FlyInGalleryScreen 
  images={[...]}
  duration={0.8}
  stagger={0.1}
/>
```

---

#### `DocumentGalleryScreen`

文档样式画廊，适合展示资料图片。

```jsx
import { DocumentGalleryScreen } from './components/PhaseScreens'

<DocumentGalleryScreen 
  images={[...]}
  cardStyle="elevated"
/>
```

---

#### `PairedDocumentGridScreen`

成对文档网格，左右配对展示。

```jsx
import { PairedDocumentGridScreen } from './components/PhaseScreens'

<PairedDocumentGridScreen 
  images={[
    ['/images/left1.png', '/images/right1.png'],
    ['/images/left2.png', '/images/right2.png'],
  ]}
/>
```

---

#### `PackagingGalleryScreen`

包装设计画廊，专为包装展示优化。

```jsx
import { PackagingGalleryScreen } from './components/PhaseScreens'

<PackagingGalleryScreen images={[...]} />
```

---

#### `SquareGridScreen`

方形网格画廊，支持翻转卡片效果。

```jsx
import { SquareGridScreen } from './components/PhaseScreens'

<SquareGridScreen 
  images={[...]}
  enableFlip={true}
  flipImages={[...]}     // 翻转后显示的图片
/>
```

---

#### `SlideGridScreen`

滑动网格画廊，滚动时依次滑入。

```jsx
import { SlideGridScreen } from './components/PhaseScreens'

<SlideGridScreen 
  images={[...]}
  direction="up"         // 'up' | 'down' | 'left' | 'right'
/>
```

---

#### `PriorityGridScreen`

优先级网格，突出显示主图。

```jsx
import { PriorityGridScreen } from './components/PhaseScreens'

<PriorityGridScreen 
  mainImage="/images/main.png"
  sideImages={[...]}
/>
```

---

### 滚动驱动类

#### `StickySection`

粘性区块容器，内容在滚动时保持固定。

```jsx
import { StickySection } from './components/PhaseScreens'

<StickySection 
  height="200vh"         // 滚动高度
  bgColor="#000"
>
  {(progress) => (
    <div style={{ opacity: progress }}>
      滚动进度: {progress}
    </div>
  )}
</StickySection>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `height` | `string` | `'200vh'` | 区块滚动高度 |
| `bgColor` | `string` | - | 背景色 |
| `children` | `(progress: number) => ReactNode` | - | 渲染函数 |

---

#### `ScrollDrivenCarousel`

滚动驱动轮播，滚动控制切换。

```jsx
import { ScrollDrivenCarousel } from './components/PhaseScreens'

<ScrollDrivenCarousel 
  items={[
    { image: '/images/01.png', title: 'Slide 1' },
    { image: '/images/02.png', title: 'Slide 2' },
  ]}
  height="300vh"
/>
```

---

#### `GroupedCarouselScreen`

分组轮播屏幕，按组展示内容。

```jsx
import { GroupedCarouselScreen } from './components/PhaseScreens'

<GroupedCarouselScreen 
  groups={[
    { title: 'Group 1', images: [...] },
    { title: 'Group 2', images: [...] },
  ]}
/>
```

---

#### `PanoramaFullScreen`

全景图屏幕，横向滚动大图。

```jsx
import { PanoramaFullScreen } from './components/PhaseScreens'

<PanoramaFullScreen 
  image="/images/panorama.png"
  height="100vh"
/>
```

---

#### `PanoramaMarqueeScreen`

全景跑马灯，自动横向滚动。

```jsx
import { PanoramaMarqueeScreen } from './components/PhaseScreens'

<PanoramaMarqueeScreen 
  images={[...]}
  speed={50}
  direction="left"
/>
```

---

### 交互动效类

#### `LogoMarqueeScreen`

Logo 跑马灯屏幕。

```jsx
import { LogoMarqueeScreen } from './components/PhaseScreens'

<LogoMarqueeScreen 
  logos={['/images/logo1.png', '/images/logo2.png']}
  speed={30}
  rows={2}
/>
```

---

#### `LogoScrollScreen`

Logo 滚动展示屏幕。

```jsx
import { LogoScrollScreen } from './components/PhaseScreens'

<LogoScrollScreen images={[...]} />
```

---

#### `LogoStructureScreen`

Logo 结构解析屏幕。

```jsx
import { LogoStructureScreen } from './components/PhaseScreens'

<LogoStructureScreen 
  image="/images/logo-structure.png"
/>
```

---

#### `LogoFocusLensScreen`

Logo 聚焦镜头效果，鼠标跟随放大。

```jsx
import { LogoFocusLensScreen } from './components/PhaseScreens'

<LogoFocusLensScreen />
```

---

#### `DocumentFocusLensScreen`

文档聚焦镜头效果。

```jsx
import { DocumentFocusLensScreen } from './components/PhaseScreens'

<DocumentFocusLensScreen images={[...]} />
```

---

#### `FlashlightMaskV2`

手电筒遮罩效果，鼠标位置显示内容。

```jsx
import { FlashlightMaskV2 } from './components/PhaseScreens'

<FlashlightMaskV2 
  radius={150}
  bgImage="/images/dark.png"
  revealImage="/images/light.png"
/>
```

---

#### `ColorRevealScreen`

颜色揭示屏幕，滚动时显示颜色。

```jsx
import { ColorRevealScreen } from './components/PhaseScreens'

<ColorRevealScreen />
```

---

#### `ThreeRowMarquee`

三行跑马灯效果。

```jsx
import { ThreeRowMarquee } from './components/PhaseScreens'

<ThreeRowMarquee 
  rows={[
    { images: [...], speed: 20, direction: 'left' },
    { images: [...], speed: 30, direction: 'right' },
    { images: [...], speed: 25, direction: 'left' },
  ]}
/>
```

---

#### `StripRowScreen`

条带行屏幕，展示横向图片条。

```jsx
import { StripRowScreen } from './components/PhaseScreens'

<StripRowScreen images={[...]} />
```

---

#### `ConsistencyMosaicScreen`

一致性马赛克屏幕。

```jsx
import { ConsistencyMosaicScreen } from './components/PhaseScreens'

<ConsistencyMosaicScreen images={[...]} />
```

---

#### `BoundariesScreen`

边界展示屏幕。

```jsx
import BoundariesScreen from './components/PhaseScreens/BoundariesScreen'

<BoundariesScreen images={[...]} />
```

---

#### `FullscreenImageScreen`

全屏图片屏幕。

```jsx
import FullscreenImageScreen from './components/PhaseScreens/FullscreenImageScreen'

<FullscreenImageScreen bgImage="/images/fullscreen.png" />
```

---

#### `ComponentAssemblyScreen`

组件装配屏幕，Leva 可调参。

```jsx
import ComponentAssemblyScreen from './components/PhaseScreens/ComponentAssemblyScreen'

<ComponentAssemblyScreen />
```

---

#### `ComponentShowcaseScreen`

组件展示屏幕。

```jsx
import { ComponentShowcaseScreen } from './components/PhaseScreens'

<ComponentShowcaseScreen 
  variant="text"         // 'text' | 'kit' | 'pod'
/>
```

---

#### `TypographyStickyScreen`

排版粘性屏幕。

```jsx
import { TypographyStickyScreen } from './components/PhaseScreens'

<TypographyStickyScreen images={[...]} />
```

---

#### `ValidationStickyScreen`

验证粘性屏幕。

```jsx
import { ValidationStickyScreen } from './components/PhaseScreens'

<ValidationStickyScreen images={[...]} />
```

---

#### `BrandIdentityScreen`

品牌识别屏幕。

```jsx
import { BrandIdentityScreen } from './components/PhaseScreens'

<BrandIdentityScreen />
```

---

### 工具与辅助类

#### `Common` 通用组件

`Common.jsx` 导出多个小型辅助组件：

```jsx
import { 
  SectionDivider,
  ImagePlaceholder,
  ProgressIndicator,
  ScreenNumber,
  ScreenLabel,
  ScreenTitle
} from './components/PhaseScreens/Common'

// 分隔线
<SectionDivider color="#eee" thickness={1} margin={40} />

// 图片占位符
<ImagePlaceholder hint="请添加图片" aspectRatio="16/9" />

// 进度指示器
<ProgressIndicator currentScreen={3} totalScreens={10} />

// 屏幕编号
<ScreenNumber>01</ScreenNumber>

// 屏幕标签
<ScreenLabel>Introduction</ScreenLabel>

// 屏幕标题
<ScreenTitle>Brand Identity</ScreenTitle>
```

---

#### `ProcessAnchor`

进度锚点导航，显示当前所在位置。

```jsx
import ProcessAnchor from './components/PhaseScreens/ProcessAnchor'

<ProcessAnchor 
  screens={['intro', 'content', 'gallery', 'closing']}
  labels={['介绍', '内容', '画廊', '结束']}
  phaseId="phase-01"
/>
```

---

#### `TransitionContext`

过渡动画上下文，管理屏幕间过渡。

```jsx
import { TransitionProvider, useTransitions, useScreenTransition } from './components/PhaseScreens/TransitionContext'

// 包裹整个 Phase
<TransitionProvider debug={false}>
  <PhaseContent />
</TransitionProvider>

// 在组件中使用
function MyScreen() {
  const { progress } = useScreenTransition('my-screen')
  return <div style={{ opacity: progress }}>...</div>
}
```

---

#### `TransitionDebugger`

过渡调试器，可视化调试过渡参数。

```jsx
import { TransitionDebugger } from './components/PhaseScreens/TransitionDebugger'

// 开发时启用
<TransitionDebugger enabled={process.env.NODE_ENV === 'development'} />
```

---

#### `ExportConfigButton`

导出配置按钮，用于导出 Leva 调参结果。

```jsx
import { ExportConfigButton } from './components/PhaseScreens/ExportConfigButton'

<ExportConfigButton />
```

---

## 滚动叙事组件

位于 `src/components/Scrollytelling/` 目录，用于创建滚动叙事效果。

### `Phase1_Space`

空间主题滚动叙事。

```jsx
import Phase1_Space from './components/Scrollytelling/Phase1_Space'

<Phase1_Space />
```

### `Phase2_Fragment`

碎片主题滚动叙事。

```jsx
import Phase2_Fragment from './components/Scrollytelling/Phase2_Fragment'

<Phase2_Fragment />
```

### `Phase3_Color`

色彩主题滚动叙事。

```jsx
import Phase3_Color from './components/Scrollytelling/Phase3_Color'

<Phase3_Color />
```

### `Phase4_Layout`

布局主题滚动叙事。

```jsx
import Phase4_Layout from './components/Scrollytelling/Phase4_Layout'

<Phase4_Layout />
```

---

## 其他组件

### `BlindsTransition`

百叶窗过渡效果组件。

```jsx
import BlindsTransition from './components/BlindsTransition'

<BlindsTransition 
  isActive={true}
  direction="horizontal"
  duration={0.8}
/>
```

---

### `ScrollParallaxShowcase`

滚动视差展示组件。

```jsx
import ScrollParallaxShowcase from './components/ScrollParallaxShowcase'

<ScrollParallaxShowcase 
  layers={[
    { image: '/images/layer1.png', speed: 0.5 },
    { image: '/images/layer2.png', speed: 1 },
  ]}
/>
```

---

### `ServiceSection`

服务区块组件。

```jsx
import ServiceSection from './components/ServiceSection'

<ServiceSection 
  services={[
    { title: '品牌设计', description: '...' },
    { title: '产品设计', description: '...' },
  ]}
/>
```

---

## 📌 组件使用原则

1. **按需导入**：只导入需要的组件，支持 Tree Shaking
2. **Props 验证**：生产环境会进行 PropTypes 检查
3. **响应式设计**：所有组件默认支持响应式
4. **主题适配**：组件自动适配亮/暗主题
5. **国际化就绪**：文本内容通过 i18n 管理

---

> 📝 **更新记录**：当添加新组件时，请同步更新本文档。
