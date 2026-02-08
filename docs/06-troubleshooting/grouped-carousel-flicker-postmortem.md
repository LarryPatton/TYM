# GroupedCarouselScreen 闪烁问题排查复盘

> **日期**：2025-06  
> **涉及组件**：`GroupedCarouselScreen.jsx`、`LoadingScreen.jsx`、`useImagePreloader.js`  
> **影响范围**：Phase-05 所有 `grouped-carousel` 类型屏幕（kv-kiyomi、kv-marquee-mix、photo-display、photo-store）  
> **最终状态**：✅ 已修复 + Lenis 接管滚动

---

## 1. 问题描述

Phase-05 的 `kv-kiyomi` 屏幕在以下场景中出现明显闪烁：

- **首次加载**后进入 kv-kiyomi 区域
- **滚动切换**组时，离开又返回的图片会重新从透明淡入
- Phase-06 的 `AutoSequencePopup` 组件无此问题

用户感知：LoadingScreen 消失后，短暂看到黑色空白，然后图片逐张弹入。

---

## 2. 根本原因

### 一句话总结

> **LoadingScreen 的 `exit` 淡出动画（0.5s）与被遮挡内容的 `whileInView` 入场动画（0.8s）在时间上重叠，用户在 LoadingScreen 半透明阶段看到了处于 `opacity: 0` 初始状态的内容层。**

### 详细机制

```
时间线 (T=0 为组件 mount)

T+0ms        GroupedCarouselScreen mount，所有 6 组图片渲染到 DOM
             图片 initial={{ opacity: 0, scale: 0.9 }} → 全部不可见
             LoadingScreen 覆盖在最上层 (z-index: 999)

T+665ms      图片从浏览器缓存加载完成 (<img> onLoad)

T+670ms      LoadingScreen 开始退出 (exit={{ opacity: 0 }}, duration: 0.5s)
             ↓ framer-motion 的 IntersectionObserver 检测到元素进入视口
             ↓ 所有 6 组的 whileInView 同时触发

T+678ms      所有图片开始入场动画 (opacity: 0 → 1)
             KIYOMI 01 有 6 张图片，stagger delay = 0.08s × 5 = 0.4s
             最后一张动画总时长 = 0.4s delay + 0.4s duration = 0.8s

T+678~1170ms LoadingScreen 淡出过程中：
             ├── LoadingScreen opacity: 1 → 0（渐变透明）
             └── 图片 opacity: 0 → 0.5（还没渐完）
             用户透过半透明遮罩看到：大片空白 + 少量半透明图片 = 闪烁感！

T+1170ms     LoadingScreen 完全消失
T+1478ms     最后一张图片动画完成
```

### 为什么 Phase-06 没有闪烁？

Phase-06 的 `AutoSequencePopup` 不使用 framer-motion 的 `initial`/`whileInView`：

```jsx
// Phase-06：用 CSS opacity + state 控制，不存在 initial={{ opacity: 0 }} 的 FOIC 问题
style={{ opacity: index < visibleCount ? 1 : 0, transition: `opacity ${duration}s ease` }}
```

---

## 3. 排查过程

### 轮次 1：假设 whileInView 重复触发

**方法**：给 `onAnimationStart` 加计数器，红/绿标记区分首次/重复触发。

**结果**：

```
[whileInView] start | KIYOMI 03 / img-3 | 第4次触发 ⚠️ 重复！闪烁嫌疑
```

确认存在重复触发（最高 4 次），因为所有组在同一个 sticky 容器中。

**修复尝试**：添加 `viewport={{ once: true }}`。

**效果**：重复触发消除（全绿），**但闪烁未消**。

**结论**：重复触发不是根因。

### 轮次 2：假设图片 DOM 未就绪（预加载是 `new Image()`，DOM `<img>` 需重新解码）

**方法**：给每张图片追踪 3 个时间戳：

| 事件 | 追踪方式 |
|------|---------|
| `imgLoad` | `<img onLoad>` — 浏览器完成图片解码 |
| `animStart` | `onAnimationStart` — whileInView 动画开始 |
| `animEnd` | `onAnimationComplete` — 动画完成 |

所有时间相对于组件 mount 时刻 (T+0ms)。

**关键数据**（缓存命中场景）：

```
T+665ms   imgLoad    KIYOMI 01/img-0    ← 图片已就绪
T+678ms   animStart  KIYOMI 01/img-0    ← 动画才开始（LoadingScreen 刚退出）
T+1193ms  animEnd    KIYOMI 01/img-0
✅ 图片在动画前已就绪 (提前 7ms)
```

**结论**：图片解码不是问题（全部 ✅）。真正问题是 **`animStart` 和 `imgLoad` 几乎同时发生在 T+670ms** — 这个时间点正好是 LoadingScreen 开始退出的时刻。

### 轮次 3：定位根因

对照 LoadingScreen 的 `exit={{ opacity: 0 }}, transition={{ duration: 0.5 }}`：

- T+670ms：LoadingScreen 开始退出
- T+670~1170ms：LoadingScreen 淡出的 0.5s 内，图片还在从 opacity:0 做入场动画
- 用户同时看到：半透明遮罩 + 透明/半透明图片 = **闪烁**

**根因确认**。

---

## 4. 修复方案

### 选择方案 A：移除图片个体入场动画

将桌面端图片容器从 `motion.div` 改为普通 `div`，移除 `initial`/`whileInView`/`viewport`/`transition`。

图片始终 `opacity: 1`，入场效果完全由外层 `GroupScene` 的 `useTransform` 控制：

| 属性 | 滚动驱动范围 |
|------|-------------|
| opacity | 0 → 0.3 → 1 → 1 → 0.3 → 0 |
| x | 80% → 30% → 0% → 0% → -30% → -80% |
| scale | 0.9 → 1 → 1 → 0.9 |
| filter | blur(8px) → blur(0px) → blur(0px) → blur(8px) |

**结果**：闪烁完全消除。

### 后续优化：Lenis 接管滚动

原本 `useScroll` + `useTransform`（framer-motion）与全局 Lenis 平滑滚动存在时序差，导致滚动手感不佳。

改为 `useLenisScrollProgress` + 自定义 `interpolate()` 函数，实现统一的平滑滚动体验。

---

## 5. 关键教训

### 教训 1：LoadingScreen 遮罩下不要用 `initial={{ opacity: 0 }}` + `whileInView`

> 在有 `AnimatePresence` + `LoadingScreen` 覆盖的架构中，被遮挡的内容组件一旦 mount 到 DOM，就已经在视口中。LoadingScreen 退出的瞬间，所有 `whileInView` 会同时触发。如果入场动画从 `opacity: 0` 开始，用户就会在遮罩淡出过程中看到空白。

**安全做法**：

- ✅ 用滚动驱动（`useTransform` / `useLenisScrollProgress`）控制内容可见性
- ✅ 用 CSS `opacity: 1` + state 控制（如 Phase-06 的做法）
- ✅ 条件渲染：`canEnter && <Content />`（但会导致内容延迟 mount）
- ❌ 避免：`initial={{ opacity: 0 }}` + `whileInView` 在 sticky/固定容器中

### 教训 2：`whileInView` 在 sticky 容器中的陷阱

sticky 容器内的所有元素始终在视口中。`whileInView` 没有 `once: true` 时，每次 layout 变化（如其他组的 transform 改变）都可能触发 IntersectionObserver 重新计算，导致动画反复重播。

### 教训 3：时序调试比猜测更有效

第一轮排查（猜测"重复触发是根因"）只解决了表面问题。第二轮加入**精确时间戳**后，10 秒内定位到了真正的时序冲突。

**调试模板**：

```jsx
const mountTimeRef = useRef(Date.now());
const trackEvent = (key, event) => {
  console.log(`[T+${Date.now() - mountTimeRef.current}ms] ${event} | ${key}`);
};
// 用于 onAnimationStart / onAnimationComplete / <img onLoad>
```

### 教训 4：Lenis 与 framer-motion 的 useScroll 并存时需要注意

Lenis 接管了浏览器原生滚动（通过 `lerp` 平滑插值），但 framer-motion 的 `useScroll` 监听的是原生 `scroll` 事件。两者的进度计算存在时序差，表现为：

- 滚动时动画有轻微"跳帧"感
- 快速滚动时进度值抖动

**解决方案**：统一使用 Lenis 的进度值（`useLenisScrollProgress`），用自定义 `interpolate()` 替代 `useTransform`。

---

## 6. 改动文件清单

| 文件 | 改动内容 |
|------|---------|
| `src/components/PhaseScreens/GroupedCarouselScreen.jsx` | 移除图片 `initial`/`whileInView`；`motion.div` → `div`；`useScroll`/`useTransform` → `useLenisScrollProgress`/`interpolate()`；清理所有调试代码 |
| `src/hooks/useLenisScroll.js` | 无改动（已有 `useLenisScrollProgress`） |
| `src/contexts/LenisContext.jsx` | 无改动 |
