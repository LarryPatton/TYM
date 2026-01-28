/**
 * ============================================
 * 过渡效果上下文 (TransitionContext)
 * ============================================
 * 
 * 提供可在运行时动态修改的过渡配置
 * 配合 Leva 调试面板实现实时预览
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useControls, folder } from 'leva';
import { SCREEN_TRANSITIONS as DEFAULT_TRANSITIONS } from '../../config/transitionConfig';

// 创建上下文 - 默认值设为 DEFAULT_TRANSITIONS
const TransitionContext = createContext(DEFAULT_TRANSITIONS);

// ============================================
// 辅助函数: 创建滚动区间控件
// ============================================
const rangeControl = (start, end, step = 0.01) => ({
  value: [start, end],
  min: 0,
  max: 1,
  step,
});

// ============================================
// Provider 组件
// ============================================
export const TransitionProvider = ({ children, debug = false }) => {
  const isDev = import.meta.env.DEV;
  const enableDebug = isDev && debug;

  // ============================================
  // IntroScreen 配置
  // ============================================
  const introControls = enableDebug ? useControls('1. IntroScreen', {
    maskReveal: rangeControl(0, 0.6),
    breathingLayer: rangeControl(0, 0.05),
    textExitY: rangeControl(0.6, 1),
    textExitOpacity: rangeControl(0.6, 0.9),
    parallax: rangeControl(0, 1),
  }, { collapsed: true }) : null;

  // ============================================
  // CorePrinciplesScreen 配置
  // ============================================
  const coreControls = enableDebug ? useControls('2. CorePrinciples', {
    nodeCenter: rangeControl(0, 0.05),
    nodeTop: rangeControl(0.1, 0.15),
    nodeLeft: rangeControl(0.2, 0.25),
    nodeRight: rangeControl(0.3, 0.35),
    pathCenterToTop: rangeControl(0.05, 0.1),
    pathCenterToLeft: rangeControl(0.15, 0.2),
    pathCenterToRight: rangeControl(0.25, 0.3),
    pathBorder: rangeControl(0.35, 0.45),
    phase1Scale: rangeControl(0, 0.5),
    phase1Exit: rangeControl(0.5, 0.6),
    phase2Entry: rangeControl(0.5, 0.6),
    phase2Scale: rangeControl(0.5, 1),
    identityStep1: rangeControl(0.6, 0.68),
    identityStep2: rangeControl(0.68, 0.76),
    identityStep3: rangeControl(0.76, 0.84),
    identityStep4: rangeControl(0.84, 0.92),
    identityStep5: rangeControl(0.92, 1.0),
  }, { collapsed: true }) : null;

  // ============================================
  // StabilityMessageScreen 配置
  // 注意: scrollHintOpacity 需要4元素数组，Leva 不支持，使用默认配置
  // ============================================
  const stabilityControls = enableDebug ? useControls('3. StabilityMessage', {
    line1Progress: rangeControl(0, 0.15),
    line2Progress: rangeControl(0.15, 0.3),
    line3Progress: rangeControl(0.3, 0.45),
    stabilityOpacityIn: rangeControl(0.45, 0.52),
    stabilityOpacityOut: rangeControl(0.85, 0.95),
    stabilityScale: rangeControl(0.45, 0.52),
    conclusionOpacityIn: rangeControl(0.5, 0.55),
    conclusionY: rangeControl(0.5, 0.55),
    linesExitOpacity: rangeControl(0.85, 0.95),
    containerExitOpacity: rangeControl(0.92, 1.0),
    // scrollHintOpacity 使用默认配置，不暴露在调试面板
  }, { collapsed: true }) : null;

  // ============================================
  // LogoStructureScreen 配置 (屏幕4)
  // ============================================
  const logoStructureControls = enableDebug ? useControls('4. LogoStructure', {
    zoomScale: rangeControl(0, 0.5),
    cardOpacity: rangeControl(0, 0.3),
    blurStart: { value: 20, min: 0, max: 50, step: 1 },
    blurEnd: { value: 0, min: 0, max: 50, step: 1 },
    textEntryOpacity: rangeControl(0.5, 0.8),
    textEntryY: rangeControl(0.5, 0.8),
  }, { collapsed: true }) : null;

  // ============================================
  // LogoFocusLensScreen 配置 (屏幕5)
  // ============================================
  const logoFocusControls = enableDebug ? useControls('5. LogoFocusLens', {
    totalCards: { value: 5, min: 1, max: 10, step: 1 },
  }, { collapsed: true }) : null;

  // ============================================
  // LogoMarqueeScreen 配置 (屏幕6)
  // ============================================
  const marqueeControls = enableDebug ? useControls('6. LogoMarquee', {
    marqueeX: rangeControl(0, 1),
    titleEntryOpacity: rangeControl(0, 0.1),
    titleEntryY: rangeControl(0, 0.1),
    containerExitOpacity: rangeControl(0.85, 1),
    progressWidth: rangeControl(0, 1),
  }, { collapsed: true }) : null;

  // ============================================
  // ColorRevealScreen 配置
  // ============================================
  const colorControls = enableDebug ? useControls('7. ColorReveal', {
    convergenceProgress: rangeControl(0.1, 0.5),
    explosionScale: rangeControl(0.6, 0.8),
    explosionOpacity: rangeControl(0.75, 0.8),
    backgroundColor: rangeControl(0.7, 0.8),
    contentEntryOpacity: rangeControl(0.8, 0.88),
    contentEntryY: rangeControl(0.8, 0.88),
    circle1: rangeControl(0.82, 0.88),
    circle2: rangeControl(0.85, 0.91),
    circle3: rangeControl(0.88, 0.94),
  }, { collapsed: true }) : null;

  // ============================================
  // 构建动态配置
  // ============================================
  const dynamicTransitions = useMemo(() => {
    if (!enableDebug) {
      return DEFAULT_TRANSITIONS;
    }

    // 辅助函数：从 [start, end] 数组创建配置对象
    const fromRange = (range, valueRange) => ({
      scrollRange: range,
      valueRange: valueRange,
    });

    return {
      ...DEFAULT_TRANSITIONS,
      
      // IntroScreen
      'intro': {
        ...DEFAULT_TRANSITIONS['intro'],
        maskReveal: fromRange(introControls.maskReveal, ['0%', '150%']),
        breathingLayer: fromRange(introControls.breathingLayer, [1, 0]),
        textExitY: fromRange(introControls.textExitY, ['0%', '-50%']),
        textExitOpacity: fromRange(introControls.textExitOpacity, [1, 0]),
        parallax: fromRange(introControls.parallax, ['0%', '10%']),
      },

      // CorePrinciplesScreen
      'core-principles': {
        ...DEFAULT_TRANSITIONS['core-principles'],
        nodeCenter: fromRange(coreControls.nodeCenter, [0, 1]),
        nodeTop: fromRange(coreControls.nodeTop, [0, 1]),
        nodeLeft: fromRange(coreControls.nodeLeft, [0, 1]),
        nodeRight: fromRange(coreControls.nodeRight, [0, 1]),
        pathCenterToTop: fromRange(coreControls.pathCenterToTop, [0, 1]),
        pathCenterToLeft: fromRange(coreControls.pathCenterToLeft, [0, 1]),
        pathCenterToRight: fromRange(coreControls.pathCenterToRight, [0, 1]),
        pathBorder: fromRange(coreControls.pathBorder, [0, 1]),
        phase1Scale: fromRange(coreControls.phase1Scale, [0.9, 1]),
        phase1ExitOpacity: fromRange(coreControls.phase1Exit, [1, 0]),
        phase1ExitY: fromRange(coreControls.phase1Exit, ['0%', '-20%']),
        phase2EntryOpacity: fromRange(coreControls.phase2Entry, [0, 1]),
        phase2EntryY: fromRange(coreControls.phase2Entry, ['20%', '0%']),
        phase2Scale: fromRange(coreControls.phase2Scale, [0.9, 1]),
        identityStep1: fromRange(coreControls.identityStep1, [0, 1]),
        identityStep2: fromRange(coreControls.identityStep2, [0, 1]),
        identityStep3: fromRange(coreControls.identityStep3, [0, 1]),
        identityStep4: fromRange(coreControls.identityStep4, [0, 1]),
        identityStep5: fromRange(coreControls.identityStep5, [0, 1]),
      },

      // StabilityMessageScreen
      'stability-message': {
        ...DEFAULT_TRANSITIONS['stability-message'],
        line1Progress: fromRange(stabilityControls.line1Progress, [0, 1]),
        line2Progress: fromRange(stabilityControls.line2Progress, [0, 1]),
        line3Progress: fromRange(stabilityControls.line3Progress, [0, 1]),
        stabilityOpacity: {
          scrollRange: [...stabilityControls.stabilityOpacityIn, ...stabilityControls.stabilityOpacityOut],
          valueRange: [0, 1, 1, 0],
        },
        stabilityScale: fromRange(stabilityControls.stabilityScale, [0.85, 1]),
        conclusionOpacity: {
          scrollRange: [...stabilityControls.conclusionOpacityIn, ...stabilityControls.stabilityOpacityOut],
          valueRange: [0, 1, 1, 0],
        },
        conclusionY: fromRange(stabilityControls.conclusionY, [15, 0]),
        linesExitOpacity: fromRange(stabilityControls.linesExitOpacity, [1, 0]),
        containerExitOpacity: fromRange(stabilityControls.containerExitOpacity, [1, 0]),
        // scrollHintOpacity 保持默认配置 (4元素数组，Leva 不支持调节)
      },

      // LogoStructureScreen
      'logo-structure': {
        ...DEFAULT_TRANSITIONS['logo-structure'],
        zoomScale: fromRange(logoStructureControls.zoomScale, [0.5, 1]),
        cardOpacity: fromRange(logoStructureControls.cardOpacity, [0, 1]),
        blurValue: fromRange(logoStructureControls.zoomScale, [logoStructureControls.blurStart, logoStructureControls.blurEnd]),
        textEntryOpacity: fromRange(logoStructureControls.textEntryOpacity, [0, 1]),
        textEntryY: fromRange(logoStructureControls.textEntryY, [50, 0]),
      },

      // LogoFocusLensScreen
      'logo-focus-lens': {
        ...DEFAULT_TRANSITIONS['logo-focus-lens'],
        totalCards: logoFocusControls.totalCards,
      },

      // LogoMarqueeScreen
      'logo-marquee': {
        ...DEFAULT_TRANSITIONS['logo-marquee'],
        marqueeX: fromRange(marqueeControls.marqueeX, ['0%', '-50%']),
        titleEntryOpacity: fromRange(marqueeControls.titleEntryOpacity, [0, 1]),
        titleEntryY: fromRange(marqueeControls.titleEntryY, [30, 0]),
        containerExitOpacity: fromRange(marqueeControls.containerExitOpacity, [1, 0]),
        progressWidth: fromRange(marqueeControls.progressWidth, ['0%', '100%']),
      },

      // ColorRevealScreen
      'color-reveal': {
        ...DEFAULT_TRANSITIONS['color-reveal'],
        convergenceProgress: fromRange(colorControls.convergenceProgress, [0, 1]),
        explosionScale: fromRange(colorControls.explosionScale, [1, 50]),
        explosionOpacity: fromRange(colorControls.explosionOpacity, [1, 0]),
        backgroundColor: fromRange(colorControls.backgroundColor, ['#0a0a0a', '#FF4600']),
        contentEntryOpacity: fromRange(colorControls.contentEntryOpacity, [0, 1]),
        contentEntryY: fromRange(colorControls.contentEntryY, [40, 0]),
        circle1Opacity: fromRange(colorControls.circle1, [0, 1]),
        circle1Scale: fromRange(colorControls.circle1, [0.8, 1]),
        circle2Opacity: fromRange(colorControls.circle2, [0, 1]),
        circle2Scale: fromRange(colorControls.circle2, [0.8, 1]),
        circle3Opacity: fromRange(colorControls.circle3, [0, 1]),
        circle3Scale: fromRange(colorControls.circle3, [0.8, 1]),
      },
    };
  }, [enableDebug, introControls, coreControls, stabilityControls, logoStructureControls, logoFocusControls, marqueeControls, colorControls]);

  return (
    <TransitionContext.Provider value={dynamicTransitions}>
      {children}
    </TransitionContext.Provider>
  );
};

// ============================================
// 使用 Hook
// ============================================
export const useTransitions = () => {
  const context = useContext(TransitionContext);
  // Context 已有默认值，始终返回有效配置
  return context || DEFAULT_TRANSITIONS;
};

// 获取特定屏幕的配置
export const useScreenTransition = (screenId) => {
  const transitions = useTransitions();
  const screenConfig = transitions[screenId];
  
  // 如果找不到屏幕配置，回退到默认配置
  if (!screenConfig) {
    console.warn(`[TransitionContext] 屏幕 "${screenId}" 配置未找到，使用默认配置`);
    return DEFAULT_TRANSITIONS[screenId] || {};
  }
  
  return screenConfig;
};

export default TransitionProvider;
