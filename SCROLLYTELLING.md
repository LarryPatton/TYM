# Scrollytelling 交互模式指南

本文档详细介绍了本项目中实现的 6 种 Scrollytelling（滚动叙事）交互模式。这些模式利用用户的滚动行为来驱动视觉变化，从而增强沉浸感和叙事性。

演示页面路由：`/scrollytelling-demo`

## 1. Parallax Hero (视差首屏)

### 效果描述
当用户向下滚动时，背景图片/渐变的移动速度慢于前景内容（如标题文字）。这种速度差异创造了一种深度的错觉，使背景看起来比前景更远。

### 技术原理
- **核心 Hook**: `useScroll`, `useTransform` (Framer Motion)
- **实现**: 
  - 监听滚动进度 `scrollYProgress`。
  - 将滚动进度映射为 `y` 轴位移。
  - 背景层移动范围较小（例如 `0%` -> `50%`）。
  - 前景层移动范围较大（例如 `0%` -> `200%`）。

### 适用场景
- 页面首屏（Hero Section）。
- 章节过渡页。
- 需要营造氛围和空间感的场景。

---

## 2. Horizontal Scroll (横向滚动)

### 效果描述
打破常规的垂直滚动体验。当用户向下滚动鼠标滚轮时，页面内容不是垂直移动，而是水平向左移动。这通常用于展示一系列的卡片、图片或时间轴。

### 技术原理
- **核心 CSS**: `position: sticky`, `height: 300vh` (或其他大高度)
- **核心 Hook**: `useTransform`
- **实现**:
  - 创建一个高度很大的容器（如 `300vh`）以提供足够的滚动空间。
  - 内部包含一个 `sticky` 定位的视口容器，高度为 `100vh`，保持在屏幕可视区域。
  - 将垂直滚动进度映射为内部内容容器的 `translateX`（例如 `0%` -> `-100%`）。

### 适用场景
- 作品集列表展示。
- 历史时间轴。
- 流程步骤说明。

---

## 3. Zoom Reveal (缩放揭示)

### 效果描述
随着滚动，一张图片或元素逐渐放大，最终填满整个屏幕或揭示出隐藏在其中的细节/下层内容。

### 技术原理
- **核心 Hook**: `useTransform`
- **实现**:
  - 将滚动进度映射到 `scale` 属性（例如 `0.5` -> `1.0`）。
  - 可配合 `opacity` 属性，在放大到一定程度后淡入文字或其他内容。

### 适用场景
- 产品细节展示。
- 沉浸式图片浏览。
- 强调某个核心视觉元素。

---

## 4. Layered Parallax (分层视差)

### 效果描述
这是 Parallax Hero 的进阶版。场景被分为多个层级（背景、中景、前景），每个层级以完全不同的速度和方向移动。这模拟了真实世界中观察者移动时，近处物体移动快、远处物体移动慢的物理现象。

### 技术原理
- **核心概念**: 多层 `z-index` + 差异化速度。
- **实现**:
  - **背景层**: 移动极慢或反向微动。
  - **中景层**: 移动速度适中，可添加模糊效果 (`blur`) 模拟景深。
  - **前景层**: 移动速度最快，迅速划过视口。
  - 使用像素值（如 `y: [0, -500]`）比百分比更能精确控制视差幅度。

### 适用场景
- 复杂的插画或合成图片展示。
- 具有明确空间关系的场景构建。
- 创意品牌形象展示。

---

## 5. Sequence / State Change (序列/状态变化)

### 效果描述
随着滚动，一个元素平滑地改变其状态（形状、颜色、位置、旋转等）。在更复杂的应用中，这通常用于控制视频播放进度或图片序列帧（Image Sequence）的切换，实现类似“定格动画”的效果。

### 技术原理
- **核心 Hook**: `useTransform` 映射多个属性。
- **实现**:
  - 将滚动进度 `[0, 1]` 分段映射到不同的样式值。
  - 例如：`0-0.5` 改变圆角，`0.5-1.0` 改变颜色。
  - 对于视频/序列帧：将滚动进度映射到当前帧索引 (`currentFrame = Math.floor(progress * totalFrames)`)。

### 适用场景
- 产品拆解演示（如手机内部结构）。
- 复杂的交互动画。
- 逐步引导的用户教育。

---

## 6. Sticky Sections (粘性章节)

### 效果描述
屏幕一侧（通常是文字说明）保持固定，而另一侧（通常是图片或图表）随着滚动不断切换。这允许用户在阅读相关说明的同时，看到对应的视觉内容变化。

### 技术原理
- **核心 CSS**: `position: sticky`, `top: 0`
- **实现**:
  - 使用 Flexbox 或 Grid 布局。
  - 左侧栏设置 `position: sticky; top: 0; height: 100vh;`。
  - 右侧栏包含多个高高度的区块，自然滚动。

### 适用场景
- 长篇图文故事。
- 案例研究详情页。
- 功能特性对比。

---

## 7. Mask Reveal (遮罩揭示)

### 效果描述
随着滚动，一个遮罩（如圆形）逐渐扩大，最终 revealing out underlying full-screen image or video. This effect commonly used from a local detail transition to a grander scene.

### 技术原理
- **核心 CSS**: `clip-path`
- **核心 Hook**: `useTransform`
- **实现**:
  - 使用 `clip-path: circle(radius at center)`。
  - 将滚动进度映射到半径大小（例如 `0%` -> `150%`）。
  - 确保最大半径足够覆盖整个屏幕角落。

### 适用场景
- 沉浸式开场。
- 强调核心视觉元素。
- 场景转换。

---

## 8. Text Highlight (文字滚动高亮)

### 效果描述
随着用户阅读（滚动），长段文本中的文字逐行或逐词变为高亮状态，其余部分保持暗淡。这引导用户的阅读节奏，确保注意力集中在当前内容上。

### 技术原理
- **核心 Hook**: `useTransform`
- **实现**:
  - 将文本拆分为单词或行。
  - 计算每个单词在滚动进度中的对应区间（例如单词 1 对应 `0.0-0.1`，单词 2 对应 `0.1-0.2`）。
  - 将滚动进度映射到每个单词的 `opacity` 或 `color`。

### 适用场景
- 宣言或使命陈述。
- 关键引言展示。
- 诗歌或歌词展示。

---

## 9. 3D Flip (3D 翻转叙事)

### 效果描述
利用 CSS 3D 变换，随着滚动控制卡片翻转或类似书页的折叠动画。这种物理隐喻增强了交互的趣味性和真实感。

### 技术原理
- **核心 CSS**: `perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, `rotateX/Y`
- **核心 Hook**: `useTransform`
- **实现**:
  - 父容器设置 `perspective`。
  - 子元素设置 `transform-style: preserve-3d`。
  - 正反面元素绝对定位重叠，背面预先旋转 180 度。
  - 滚动控制整体旋转角度（`0deg` -> `180deg`）。

### 适用场景
- 展示事物的两面性（如：问题 vs 解决方案）。
- 闪卡（Flashcards）效果。
- 模拟实体书阅读体验。

---

## 10. Perspective Tunnel (时空隧道)
**效果**: 多层图片随着滚动向屏幕深处推进，产生穿越时空的视觉体验。
**原理**: `scale` + `opacity` + `zIndex` 随滚动变化。

## 11. Exploding Components (爆炸拆解)
**效果**: 产品图片分解为多个零部件悬浮，展示内部结构。
**原理**: 多个图层随滚动在 Y 轴和旋转角度上产生不同位移。

## 12. Motion Path (路径漫游)
**效果**: 元素沿着预设的曲线轨迹移动。
**原理**: 将滚动进度映射到 X/Y 坐标，模拟沿 SVG 路径运动。

## 13. Cinematic Pan (电影运镜)
**效果**: 超宽全景图随垂直滚动进行水平平移。
**原理**: 垂直滚动映射为背景图的 `background-position-x` 或 `x` 位移。

## 14. Origami Fold (折纸效果)
**效果**: 图片像折纸一样折叠或展开。
**原理**: `rotateX` + `transform-origin: bottom` + `perspective`。

## 15. Slice Transition (切片错位)
**效果**: 图片被分割成条状，滚动时交错移动。
**原理**: 多个 `div` 显示同一背景图的不同部分，奇偶行设置相反的 `y` 位移。

## 16. Pixelation Morph (像素重组)
**效果**: 图片像素化模糊后切换到另一张图。
**原理**: `scale` 缩小 + `image-rendering: pixelated` + `opacity` 切换。

## 17. Grid Shuffle (网格重组)
**效果**: 散落的图片随滚动吸附拼合成整齐网格。
**原理**: 初始设置随机或散乱的 `x/y` 偏移，滚动至 `0`。

## 18. Spread Out (扇形展开)
**效果**: 堆叠的卡片像扇子一样旋转展开。
**原理**: 不同卡片设置不同的 `rotate` 和 `x` 终点值。

## 19. Curtain Reveal (幕布揭示)
**效果**: 黑色幕布向上拉起，揭示下层内容。
**原理**: 控制遮罩层的 `height` 从 `100%` 变为 `0%`。

## 20. Color Bloom (色彩绽放)
**效果**: 黑白图片中心扩散出彩色。
**原理**: `clip-path: circle()` 半径随滚动增大，揭示上层彩色图。

## 21. Focus Shift (景深切换)
**效果**: 前景和背景交替模糊/清晰。
**原理**: `filter: blur()` 值随滚动在前后层之间反向变化。

## 22. Liquid Distortion (液化扰动)
**效果**: 图片产生水波纹扭曲。
**原理**: SVG `feTurbulence` + `feDisplacementMap` 滤镜。

## 23. Velocity Skew (速度倾斜)
**效果**: 滚动越快，图片倾斜越明显。
**原理**: 监听滚动速度（或模拟）映射到 `skewY`。

## 24. Circular Carousel (摩天轮旋转)
**效果**: 图片在圆环上旋转切换。
**原理**: 容器整体 `rotate`，子元素反向 `rotate` 保持直立（可选）。

## 25. Card Stack (卡片堆叠)
**效果**: 卡片堆叠，随滚动逐张飞出。
**原理**: 不同的 `start/end` 滚动区间触发 `y` 和 `rotate` 变化。

## 26. Scale-down-to-Grid (缩放归位)
**效果**: 全屏大图缩小并移动到网格特定位置。
**原理**: `scale` 从 1 变小，`x/y` 从 0 移至目标位置。

## 27. Pin & Zoom (定点探查)
**效果**: 图片固定并放大查看细节。
**原理**: `position: sticky` + `scale` 增大。

## 28. Typography Mask (文字遮罩)
**效果**: 图片只在巨大文字内部显示。
**原理**: `mix-blend-mode: screen` 或 `background-clip: text`。

## 29. Split Screen Reveal (中分揭示)
**效果**: 屏幕从中间裂开，露出背后内容。
**原理**: 左右两半容器分别向左/右移动 `x: -50% / 50%`。

---

# Scrollytelling Advanced (进阶版)

本文档第二部分介绍了进阶版的 26 种 Scrollytelling 技术，涵盖媒体控制、SVG 绘制、数据可视化、3D 效果、交互增强、图片处理、页面结构和特效等 8 大类别。

**演示页面路由**: `/scrollytelling-advanced`

---

## Phase 1: 媒体控制类 (Media Control)

### 30. Scroll-driven Video (滚动控制视频)
**效果**: 滚动直接控制视频播放进度，实现苹果官网式的产品展示体验。
**原理**: 
- 监听 `scrollYProgress` 变化
- 将滚动进度映射到 `video.currentTime = progress * video.duration`
**适用场景**: 产品 3D 展示、复杂动画序列、沉浸式叙事

### 31. Image Sequence Frame (图片序列帧)
**效果**: 滚动切换图片帧，实现定格动画效果（如 AirPods Pro 页面）。
**原理**: `currentFrame = Math.floor(scrollProgress * totalFrames)`
**适用场景**: 产品旋转展示、动画分解、过程演示

### 32. Lottie Animation Control (Lottie 动画控制)
**效果**: 滚动控制 Lottie 或 CSS 动画的播放进度。
**原理**: 将滚动进度映射到动画的 `rotate`、`scale`、`borderRadius` 等属性
**适用场景**: 复杂矢量动画、品牌动效、交互式图标

### 33. Scroll-triggered Audio (滚动触发音效)
**效果**: 滚动到特定区域触发音效变化或背景音乐切换。
**原理**: 将滚动区间分段，每段对应不同音效状态
**适用场景**: 沉浸式故事、游戏化体验、情绪引导

---

## Phase 2: SVG 与绘制类 (SVG & Drawing)

### 34. SVG Path Drawing (SVG 路径绘制)
**效果**: 滚动时 SVG 路径逐渐绘制出来，呈现手绘动画效果。
**原理**: 
- 使用 `motion.path` 的 `pathLength` 属性
- 将滚动进度映射到 `pathLength: [0, 1]`
**适用场景**: 签名动画、路线展示、插图揭示

### 35. SVG Morphing (SVG 形状变形)
**效果**: SVG 形状在滚动过程中平滑变形（圆形→星形→方形）。
**原理**: 使用 `animate` + `d` 属性过渡不同的 SVG path
**适用场景**: 品牌动效、状态转换可视化、创意展示

### 36. Handwriting Reveal (手写文字显现)
**效果**: 模拟手写文字逐笔画显现的效果。
**原理**: 复杂 SVG 路径 + `pathLength` 动画
**适用场景**: 个性化签名、艺术字展示、创意文案

---

## Phase 3: 数据可视化类 (Data Visualization)

### 37. Counter Animation (数字滚动计数器)
**效果**: 数字从 0 滚动增加到目标值。
**原理**: `displayValue = Math.floor(targetValue * scrollProgress)`
**适用场景**: 数据统计展示、成就展示、里程碑庆祝

### 38. Chart Animation (图表动画)
**效果**: 柱状图、折线图等图表随滚动生长。
**原理**: 将滚动进度映射到柱状图的 `height` 属性
**适用场景**: 年度报告、数据故事、业绩展示

### 39. Progress Ring (环形进度条)
**效果**: 环形进度条随滚动填充，显示百分比。
**原理**: 
- SVG `circle` + `strokeDasharray` + `strokeDashoffset`
- `strokeDashoffset = circumference * (1 - progress)`
**适用场景**: 技能展示、项目进度、目标达成

---

## Phase 4: 3D 与 WebGL 类 (3D & WebGL)

### 40. 3D Scene Control (3D 场景控制)
**效果**: 滚动控制 3D 立方体或场景的旋转角度和位置。
**原理**: CSS 3D transforms + `perspective` + `rotateX/Y/Z`
**适用场景**: 产品 3D 展示、空间导览、创意展示

### 41. 3D Model Rotation (3D 模型旋转)
**效果**: 滚动 360° 旋转查看产品模型。
**原理**: `rotateY: [0, 360]` + `scale` 变化
**适用场景**: 电商产品展示、工业设计、艺术品展览

### 42. Particle System (粒子系统)
**效果**: 粒子随滚动扩散或聚合，创造动态视觉。
**原理**: 
- 生成随机位置的粒子数组
- 滚动控制每个粒子的 `x/y` 偏移量
**适用场景**: 背景装饰、情绪表达、品牌氛围

---

## Phase 5: 交互增强类 (Interaction Enhancement)

### 43. Scroll Snap Sections (滚动吸附)
**效果**: 滚动自动吸附到各个章节，创造分页浏览体验。
**原理**: CSS `scroll-snap-type: y mandatory` + `scroll-snap-align: start`
**适用场景**: 全屏幻灯片、产品特性展示、章节导航

### 44. Magnetic Scroll (磁性滚动)
**效果**: 滚动时元素像被磁铁吸引一样聚焦到当前项。
**原理**: 根据滚动进度计算 `activeIndex`，高亮对应元素
**适用场景**: 列表导航、时间轴、步骤指引

### 45. Scroll Direction Animation (滚动方向动画)
**效果**: 检测滚动方向（上/下），触发不同的动画效果。
**原理**: 
- 比较 `currentScrollY` 和 `lastScrollY`
- 根据方向设置不同的 `rotate`、`color` 等属性
**适用场景**: 导航栏显隐、方向指示、差异化反馈

### 46. Scroll Velocity Effects (滚动速度效果)
**效果**: 滚动速度影响元素的倾斜、模糊等视觉效果。
**原理**: 
- 计算 `velocity = (currentProgress - lastProgress) / deltaTime`
- 映射到 `skewX`、`filter: blur()` 等属性
**适用场景**: 运动感强化、速度可视化、动态反馈

---

## Phase 6: 图片处理类 (Image Processing)

### 47. Ken Burns Effect (肯伯恩斯效果)
**效果**: 图片缓慢缩放 + 平移，纪录片风格的静态图片动态化。
**原理**: 
- `scale: [1, 1.5]`
- `x/y` 同时产生小幅位移
**适用场景**: 纪录片叙事、照片故事、历史回顾

### 48. Before/After Slider (前后对比滑块)
**效果**: 滚动控制对比图的分割线位置，展示前后差异。
**原理**: 
- 使用 `clip-path: inset()` 控制可见区域
- 分割线位置随滚动移动
**适用场景**: 设计对比、修复前后、改版展示

### 49. Image Comparison Morph (图片对比融合)
**效果**: 两张图片通过透明度渐变平滑切换。
**原理**: 
- 图片 1: `opacity: [1, 0]`
- 图片 2: `opacity: [0, 1]`
**适用场景**: 时间推移、季节变化、状态切换

---

## Phase 7: 页面结构类 (Page Structure)

### 50. Page Turning (翻页效果)
**效果**: 模拟真实的书页翻转动画。
**原理**: 
- `rotateY` 控制翻转角度
- `transform-origin: left center` 设置旋转轴心
- `backface-visibility: hidden` 隐藏背面
**适用场景**: 电子书、产品手册、故事叙述

### 51. Infinite Loop Scroll (无限循环滚动)
**效果**: 内容无缝循环滚动，到达末尾后无感接续。
**原理**: 
- 复制内容三份拼接
- 循环移动 `translateX`
**适用场景**: 品牌展示墙、合作伙伴 logo、滚动公告

### 52. Scroll Hijacking (滚动劫持)
**效果**: 接管默认滚动行为，实现分步推进的叙事节奏。
**原理**: 
- 大高度容器 + `position: sticky`
- 根据滚动进度计算当前步骤 `activeStep`
**适用场景**: 流程说明、教程引导、故事分段

---

## Phase 8: 特效类 (Special Effects)

### 53. Confetti / Celebration (庆祝彩带)
**效果**: 滚动到特定位置触发彩带飘落的庆祝动画。
**原理**: 
- 滚动超过阈值时生成随机彩带粒子
- 每个粒子独立执行下落 + 旋转动画
**适用场景**: 成就解锁、活动庆祝、重要里程碑

### 54. Glitch Effect (故障效果)
**效果**: 模拟数字故障的视觉效果（RGB 色彩分离）。
**原理**: 
- 三层文字叠加（红、青、白）
- 不同的 `translate` 偏移量产生错位
- `mix-blend-mode: screen` 混合
**适用场景**: 科技感展示、错误状态、赛博朋克风格

### 55. Noise/Grain Overlay (噪点覆盖)
**效果**: 滚动控制噪点覆盖强度，创造复古胶片感。
**原理**: 
- SVG `feTurbulence` 滤镜生成噪点
- 滚动控制噪点层的 `opacity`
- 可叠加扫描线效果
**适用场景**: 复古风格、电影质感、艺术化处理

---

## 技术栈总结

### 核心依赖
- **Framer Motion**: `useScroll`, `useTransform`, `motion` 组件
- **React Hooks**: `useRef`, `useState`, `useEffect`
- **CSS**: `position: sticky`, `perspective`, `transform-style: preserve-3d`

### 最佳实践
1. **性能优化**: 使用 `will-change` 提示浏览器，避免不必要的重绘
2. **渐进增强**: 为不支持的浏览器提供降级方案
3. **可访问性**: 提供跳过动画的选项，尊重 `prefers-reduced-motion`
4. **移动端适配**: 触控设备上的滚动体验可能需要调整

### 演示页面
- **基础版 (29 种)**: `/scrollytelling-demo`
- **进阶版 (26 种)**: `/scrollytelling-advanced`
- **专家版 (7 种)**: `/scrollytelling-expert`

**总计: 62 种 Scrollytelling 技术**