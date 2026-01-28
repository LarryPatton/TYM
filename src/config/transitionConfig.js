/**
 * ============================================
 * Phase-01 过渡效果统一配置文件
 * ============================================
 * 
 * 所有屏幕的过渡动画参数集中管理
 * 修改此文件即可调整全局过渡效果
 * 
 * 参数说明:
 * - scrollRange: [起始进度, 结束进度] (0-1之间)
 * - valueRange: [起始值, 结束值]
 * - 四关键帧: [入开始, 入结束, 出开始, 出结束] 对应 [0, 1, 1, 0]
 */

// ============================================
// 【全局默认值】
// ============================================
export const TRANSITION_DEFAULTS = {
  // 淡出动画默认区间 (滚动进度)
  fadeOut: {
    start: 0.85,        // 85% 开始淡出
    end: 1.0,           // 100% 完全消失
  },
  
  // 淡入动画默认区间
  fadeIn: {
    start: 0,
    end: 0.15,          // 前 15% 完成淡入
  },
  
  // Y轴位移默认值
  displacement: {
    entry: 30,          // 入场时从下方 30px 处开始
    exit: '-20%',       // 离场时向上移动 20%
  },
  
  // 缩放默认值
  scale: {
    start: 0.9,
    end: 1.0,
  },
};

// ============================================
// 【渐变遮罩预设】
// ============================================
export const GRADIENT_PRESETS = {
  // 标准顶部遮罩 (与上屏衔接)
  topFade: {
    height: '40vh',
    gradient: 'linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)',
  },
  
  // 标准底部遮罩 (与下屏衔接)
  bottomFade: {
    height: '50vh',
    gradient: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 70%, #0a0a0a 100%)',
  },
  
  // 柔和底部遮罩
  bottomSoft: {
    height: '60vh',
    gradient: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.5) 50%, #0a0a0a 100%)',
  },
  
  // 强底部遮罩
  bottomStrong: {
    height: '40vh',
    gradient: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 60%)',
  },
};

// ============================================
// 【各屏幕过渡配置】按页面顺序排列
// ============================================
export const SCREEN_TRANSITIONS = {
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 1: IntroScreen (阶段引导页)
  // 滚动高度: 250vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'intro': {
    scrollHeight: '250vh',
    
    // 遮罩揭示效果
    maskReveal: {
      scrollRange: [0, 0.6],        // 0-60% 完成揭示
      valueRange: ['0%', '150%'],   // 从 0 扩展到 150%
    },
    
    // 呼吸层消失
    breathingLayer: {
      scrollRange: [0, 0.05],       // 前 5% 消失
      valueRange: [1, 0],
    },
    
    // 文字离场 - Y轴位移
    textExitY: {
      scrollRange: [0.6, 1],
      valueRange: ['0%', '-50%'],
    },
    
    // 文字离场 - 透明度
    textExitOpacity: {
      scrollRange: [0.6, 0.9],
      valueRange: [1, 0],
    },
    
    // 背景视差
    parallax: {
      scrollRange: [0, 1],
      valueRange: ['0%', '10%'],
    },
    
    // 底部渐变遮罩
    bottomGradient: GRADIENT_PRESETS.bottomSoft,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 2: CorePrinciplesScreen (核心原则 + 品牌架构)
  // 滚动高度: 600vh (包含两阶段)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'core-principles': {
    scrollHeight: '600vh',
    
    // === 阶段1: Core Principles (0% - 50%) ===
    
    // 节点顺序出现
    nodeCenter: { scrollRange: [0, 0.05], valueRange: [0, 1] },
    nodeTop: { scrollRange: [0.1, 0.15], valueRange: [0, 1] },
    nodeLeft: { scrollRange: [0.2, 0.25], valueRange: [0, 1] },
    nodeRight: { scrollRange: [0.3, 0.35], valueRange: [0, 1] },
    
    // 连线绘制
    pathCenterToTop: { scrollRange: [0.05, 0.1], valueRange: [0, 1] },
    pathCenterToLeft: { scrollRange: [0.15, 0.2], valueRange: [0, 1] },
    pathCenterToRight: { scrollRange: [0.25, 0.3], valueRange: [0, 1] },
    pathBorder: { scrollRange: [0.35, 0.45], valueRange: [0, 1] },
    
    // 整体缩放
    phase1Scale: { scrollRange: [0, 0.5], valueRange: [0.9, 1] },
    
    // 阶段1离场
    phase1ExitOpacity: { scrollRange: [0.5, 0.6], valueRange: [1, 0] },
    phase1ExitY: { scrollRange: [0.5, 0.6], valueRange: ['0%', '-20%'] },
    
    // === 阶段2: Brand Identity (50% - 100%) ===
    
    // 阶段2入场
    phase2EntryOpacity: { scrollRange: [0.5, 0.6], valueRange: [0, 1] },
    phase2EntryY: { scrollRange: [0.5, 0.6], valueRange: ['20%', '0%'] },
    phase2Scale: { scrollRange: [0.5, 1], valueRange: [0.9, 1] },
    
    // 内部元素顺序出现
    identityStep1: { scrollRange: [0.6, 0.68], valueRange: [0, 1] },   // ZMR
    identityStep2: { scrollRange: [0.68, 0.76], valueRange: [0, 1] },  // 左上
    identityStep3: { scrollRange: [0.76, 0.84], valueRange: [0, 1] },  // 右上
    identityStep4: { scrollRange: [0.84, 0.92], valueRange: [0, 1] },  // 底部
    identityStep5: { scrollRange: [0.92, 1.0], valueRange: [0, 1] },   // 外框
    
    // 渐变遮罩
    topGradient: GRADIENT_PRESETS.topFade,
    bottomGradient: GRADIENT_PRESETS.bottomFade,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 3: StabilityMessageScreen (稳定性文字)
  // 滚动高度: 350vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'stability-message': {
    scrollHeight: '350vh',
    
    // 流式文字进度
    line1Progress: { scrollRange: [0.00, 0.15], valueRange: [0, 1] },
    line2Progress: { scrollRange: [0.15, 0.30], valueRange: [0, 1] },
    line3Progress: { scrollRange: [0.30, 0.45], valueRange: [0, 1] },
    
    // STABILITY 大字 (四关键帧: 入-保持-出)
    stabilityOpacity: {
      scrollRange: [0.45, 0.52, 0.85, 0.95],
      valueRange: [0, 1, 1, 0],
    },
    stabilityScale: {
      scrollRange: [0.45, 0.52],
      valueRange: [0.85, 1],
    },
    
    // 结论文字
    conclusionOpacity: {
      scrollRange: [0.50, 0.55, 0.85, 0.95],
      valueRange: [0, 1, 1, 0],
    },
    conclusionY: {
      scrollRange: [0.50, 0.55],
      valueRange: [15, 0],
    },
    
    // 文字行提前淡出 (层次感)
    linesExitOpacity: {
      scrollRange: [0.85, 0.95],
      valueRange: [1, 0],
    },
    
    // 整体容器离场
    containerExitOpacity: {
      scrollRange: [0.92, 1.0],
      valueRange: [1, 0],
    },
    
    // 滚动提示显隐
    scrollHintOpacity: {
      scrollRange: [0.55, 0.60, 0.80, 0.85],
      valueRange: [0, 0.5, 0.5, 0],
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 4: LogoStructureScreen (Logo结构)
  // 滚动高度: 250vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'logo-structure': {
    scrollHeight: '250vh',
    
    // Zoom Reveal 效果
    zoomScale: {
      scrollRange: [0, 0.5],
      valueRange: [0.5, 1],
    },
    cardOpacity: {
      scrollRange: [0, 0.3],
      valueRange: [0, 1],
    },
    blurValue: {
      scrollRange: [0, 0.4],
      valueRange: [20, 0],         // 模糊值 px
    },
    
    // 文字入场
    textEntryOpacity: {
      scrollRange: [0.5, 0.8],
      valueRange: [0, 1],
    },
    textEntryY: {
      scrollRange: [0.5, 0.8],
      valueRange: [50, 0],
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 5: LogoFocusLensScreen (Logo变体卡片)
  // 滚动高度: 300vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'logo-focus-lens': {
    scrollHeight: '300vh',
    
    // 卡片切换配置
    totalCards: 5,
    // 计算公式: activeIndex = Math.round(progress * (totalCards - 1))
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 6: LogoMarqueeScreen (Logo跑马灯)
  // 滚动高度: 300vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'logo-marquee': {
    scrollHeight: '300vh',
    
    // 跑马灯位移
    marqueeX: {
      scrollRange: [0, 1],
      valueRange: ['0%', '-50%'],
    },
    
    // 标题入场
    titleEntryOpacity: {
      scrollRange: [0, 0.1],
      valueRange: [0, 1],
    },
    titleEntryY: {
      scrollRange: [0, 0.1],
      valueRange: [30, 0],
    },
    
    // 整体离场
    containerExitOpacity: {
      scrollRange: [0.85, 1],
      valueRange: [1, 0],
    },
    
    // 进度条
    progressWidth: {
      scrollRange: [0, 1],
      valueRange: ['0%', '100%'],
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 7: ColorRevealScreen (色彩揭示)
  // 滚动高度: 400vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'color-reveal': {
    scrollHeight: '400vh',
    
    // 粒子聚合
    convergenceProgress: {
      scrollRange: [0.1, 0.5],
      valueRange: [0, 1],
    },
    
    // 爆炸扩散
    explosionScale: {
      scrollRange: [0.6, 0.8],
      valueRange: [1, 50],
    },
    explosionOpacity: {
      scrollRange: [0.75, 0.8],
      valueRange: [1, 0],
    },
    
    // 背景色过渡
    backgroundColor: {
      scrollRange: [0.7, 0.8],
      valueRange: ['#0a0a0a', '#FF4600'],
    },
    
    // 内容入场
    contentEntryOpacity: {
      scrollRange: [0.8, 0.88],
      valueRange: [0, 1],
    },
    contentEntryY: {
      scrollRange: [0.8, 0.88],
      valueRange: [40, 0],
    },
    
    // 关键词顺序出现
    circle1Opacity: { scrollRange: [0.82, 0.88], valueRange: [0, 1] },
    circle1Scale: { scrollRange: [0.82, 0.88], valueRange: [0.8, 1] },
    circle2Opacity: { scrollRange: [0.85, 0.91], valueRange: [0, 1] },
    circle2Scale: { scrollRange: [0.85, 0.91], valueRange: [0.8, 1] },
    circle3Opacity: { scrollRange: [0.88, 0.94], valueRange: [0, 1] },
    circle3Scale: { scrollRange: [0.88, 0.94], valueRange: [0.8, 1] },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 8: GalleryScreen (Logo探索画廊)
  // 无滚动动画，仅悬停效果
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'logo-exploration': {
    hoverY: -10,  // 悬停上浮距离
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 9: TypographyStickyScreen (字体版式)
  // 滚动高度: 400vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'typography': {
    scrollHeight: '400vh',
    viewportMargin: '-20%',  // 图片进入视口20%时触发动画
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 10: ValidationStickyScreen (验证阶段)
  // 滚动高度: 400vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'validation': {
    scrollHeight: '400vh',
    viewportMargin: '-20%',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 11: SummaryTextHighlightScreen (目录高亮)
  // 滚动高度: 250vh
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'summary': {
    scrollHeight: '250vh',
    
    // 网格高亮切换
    totalGroups: 5,
    transitionBuffer: 0.1,    // 过渡缓冲区
    
    // 高亮样式
    activeOpacity: 1,
    inactiveOpacity: 0.3,
    activeColor: '#fff',
    inactiveColor: '#666',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 屏幕 12: PhaseClosingScreen (封底)
  // 无滚动动画，whileInView 入场
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'phase-closing': {
    // 背景图入场
    bgEntry: {
      initial: { opacity: 0, scale: 1.05 },
      animate: { opacity: 1, scale: 1 },
      duration: 1.2,
    },
    // 文字入场延迟
    textEntryDelay: 0.3,
    // 按钮入场延迟
    buttonEntryDelay: 0.5,
  },
};

// ============================================
// 【工具函数】
// ============================================

/**
 * 获取屏幕过渡配置
 * @param {string} screenId - 屏幕 ID
 * @returns {object} 过渡配置
 */
export const getScreenTransition = (screenId) => {
  return SCREEN_TRANSITIONS[screenId] || {};
};

/**
 * 获取过渡参数
 * @param {string} screenId - 屏幕 ID
 * @param {string} paramName - 参数名
 * @returns {object} { scrollRange, valueRange }
 */
export const getTransitionParam = (screenId, paramName) => {
  const screen = SCREEN_TRANSITIONS[screenId];
  if (!screen || !screen[paramName]) {
    console.warn(`Transition param not found: ${screenId}.${paramName}`);
    return { scrollRange: [0, 1], valueRange: [0, 1] };
  }
  return screen[paramName];
};

/**
 * 合并默认值和自定义配置
 */
export const mergeWithDefaults = (customConfig, type) => {
  const defaults = TRANSITION_DEFAULTS[type] || {};
  return { ...defaults, ...customConfig };
};

export default SCREEN_TRANSITIONS;
