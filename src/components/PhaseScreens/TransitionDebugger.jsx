/**
 * ============================================
 * 过渡效果调试面板 (TransitionDebugger)
 * ============================================
 * 
 * 使用 Leva 库创建的 GUI 调试面板
 * - 仅在开发环境中显示
 * - 实时调整过渡参数
 * - 支持导出配置到 JSON
 * 
 * 使用方法:
 * 1. 在页面中引入 <TransitionDebugger />
 * 2. 拖动滑块调整参数
 * 3. 点击 "Export Config" 按钮导出配置
 */

import React, { useEffect } from 'react';
import { useControls, folder, button, Leva } from 'leva';

// ============================================
// 创建一个函数来生成 scrollRange 控件
// ============================================
const createRangeControl = (label, defaultStart, defaultEnd, step = 0.01) => ({
  [`${label}Start`]: { value: defaultStart, min: 0, max: 1, step, label: 'start' },
  [`${label}End`]: { value: defaultEnd, min: 0, max: 1, step, label: 'end' },
});

// ============================================
// 过渡配置状态管理 Hook
// ============================================
export const useTransitionDebugger = () => {
  // IntroScreen 配置
  const introConfig = useControls('1. IntroScreen', {
    maskReveal: folder({
      ...createRangeControl('maskReveal', 0, 0.6),
    }),
    breathingLayer: folder({
      ...createRangeControl('breathing', 0, 0.05),
    }),
    textExit: folder({
      ...createRangeControl('textExitY', 0.6, 1),
      ...createRangeControl('textExitOpacity', 0.6, 0.9),
    }),
    parallax: folder({
      ...createRangeControl('parallax', 0, 1),
    }),
  });

  // CorePrinciplesScreen 配置
  const corePrinciplesConfig = useControls('2. CorePrinciples', {
    '阶段1: 节点出现': folder({
      ...createRangeControl('nodeCenter', 0, 0.05),
      ...createRangeControl('nodeTop', 0.1, 0.15),
      ...createRangeControl('nodeLeft', 0.2, 0.25),
      ...createRangeControl('nodeRight', 0.3, 0.35),
    }),
    '阶段1: 连线绘制': folder({
      ...createRangeControl('pathCenterToTop', 0.05, 0.1),
      ...createRangeControl('pathCenterToLeft', 0.15, 0.2),
      ...createRangeControl('pathCenterToRight', 0.25, 0.3),
      ...createRangeControl('pathBorder', 0.35, 0.45),
    }),
    '阶段切换': folder({
      ...createRangeControl('phase1Exit', 0.5, 0.6),
      ...createRangeControl('phase2Entry', 0.5, 0.6),
    }),
    '阶段2: Identity步骤': folder({
      ...createRangeControl('identityStep1', 0.6, 0.68),
      ...createRangeControl('identityStep2', 0.68, 0.76),
      ...createRangeControl('identityStep3', 0.76, 0.84),
      ...createRangeControl('identityStep4', 0.84, 0.92),
      ...createRangeControl('identityStep5', 0.92, 1.0),
    }),
  });

  // StabilityMessageScreen 配置
  const stabilityConfig = useControls('3. StabilityMessage', {
    '流式文字': folder({
      ...createRangeControl('line1', 0, 0.15),
      ...createRangeControl('line2', 0.15, 0.3),
      ...createRangeControl('line3', 0.3, 0.45),
    }),
    'STABILITY大字': folder({
      stabilityFadeIn: { value: [0.45, 0.52], min: 0, max: 1, step: 0.01 },
      stabilityFadeOut: { value: [0.85, 0.95], min: 0, max: 1, step: 0.01 },
      ...createRangeControl('stabilityScale', 0.45, 0.52),
    }),
    '结论文字': folder({
      conclusionFadeIn: { value: [0.5, 0.55], min: 0, max: 1, step: 0.01 },
      ...createRangeControl('conclusionY', 0.5, 0.55),
    }),
    '离场动画': folder({
      ...createRangeControl('linesExit', 0.85, 0.95),
      ...createRangeControl('containerExit', 0.92, 1.0),
    }),
  });

  // LogoMarqueeScreen 配置
  const marqueeConfig = useControls('6. LogoMarquee', {
    '跑马灯': folder({
      ...createRangeControl('marqueeX', 0, 1),
    }),
    '标题入场': folder({
      ...createRangeControl('titleEntry', 0, 0.1),
    }),
    '离场动画': folder({
      ...createRangeControl('containerExit', 0.85, 1),
    }),
  });

  // ColorRevealScreen 配置
  const colorRevealConfig = useControls('7. ColorReveal', {
    '粒子聚合': folder({
      ...createRangeControl('convergence', 0.1, 0.5),
    }),
    '爆炸扩散': folder({
      ...createRangeControl('explosionScale', 0.6, 0.8),
      ...createRangeControl('explosionOpacity', 0.75, 0.8),
    }),
    '背景色过渡': folder({
      ...createRangeControl('backgroundColor', 0.7, 0.8),
    }),
    '内容入场': folder({
      ...createRangeControl('contentEntry', 0.8, 0.88),
    }),
    '关键词出现': folder({
      ...createRangeControl('circle1', 0.82, 0.88),
      ...createRangeControl('circle2', 0.85, 0.91),
      ...createRangeControl('circle3', 0.88, 0.94),
    }),
  });

  return {
    intro: introConfig,
    corePrinciples: corePrinciplesConfig,
    stability: stabilityConfig,
    marquee: marqueeConfig,
    colorReveal: colorRevealConfig,
  };
};

// ============================================
// 导出配置为 JSON
// ============================================
const exportConfig = (configs) => {
  // 将 Leva 控件值转换为 transitionConfig 格式
  const formatConfig = {
    'intro': {
      scrollHeight: '250vh',
      maskReveal: {
        scrollRange: [configs.intro.maskRevealStart, configs.intro.maskRevealEnd],
        valueRange: ['0%', '150%'],
      },
      breathingLayer: {
        scrollRange: [configs.intro.breathingStart, configs.intro.breathingEnd],
        valueRange: [1, 0],
      },
      textExitY: {
        scrollRange: [configs.intro.textExitYStart, configs.intro.textExitYEnd],
        valueRange: ['0%', '-50%'],
      },
      textExitOpacity: {
        scrollRange: [configs.intro.textExitOpacityStart, configs.intro.textExitOpacityEnd],
        valueRange: [1, 0],
      },
      parallax: {
        scrollRange: [configs.intro.parallaxStart, configs.intro.parallaxEnd],
        valueRange: ['0%', '10%'],
      },
    },
    'stability-message': {
      scrollHeight: '350vh',
      line1Progress: {
        scrollRange: [configs.stability.line1Start, configs.stability.line1End],
        valueRange: [0, 1],
      },
      line2Progress: {
        scrollRange: [configs.stability.line2Start, configs.stability.line2End],
        valueRange: [0, 1],
      },
      line3Progress: {
        scrollRange: [configs.stability.line3Start, configs.stability.line3End],
        valueRange: [0, 1],
      },
      stabilityOpacity: {
        scrollRange: [...configs.stability.stabilityFadeIn, ...configs.stability.stabilityFadeOut],
        valueRange: [0, 1, 1, 0],
      },
      stabilityScale: {
        scrollRange: [configs.stability.stabilityScaleStart, configs.stability.stabilityScaleEnd],
        valueRange: [0.85, 1],
      },
      conclusionOpacity: {
        scrollRange: [...configs.stability.conclusionFadeIn, ...configs.stability.stabilityFadeOut],
        valueRange: [0, 1, 1, 0],
      },
      conclusionY: {
        scrollRange: [configs.stability.conclusionYStart, configs.stability.conclusionYEnd],
        valueRange: [15, 0],
      },
      linesExitOpacity: {
        scrollRange: [configs.stability.linesExitStart, configs.stability.linesExitEnd],
        valueRange: [1, 0],
      },
      containerExitOpacity: {
        scrollRange: [configs.stability.containerExitStart, configs.stability.containerExitEnd],
        valueRange: [1, 0],
      },
    },
    'logo-marquee': {
      scrollHeight: '300vh',
      marqueeX: {
        scrollRange: [configs.marquee.marqueeXStart, configs.marquee.marqueeXEnd],
        valueRange: ['0%', '-50%'],
      },
      titleEntryOpacity: {
        scrollRange: [configs.marquee.titleEntryStart, configs.marquee.titleEntryEnd],
        valueRange: [0, 1],
      },
      titleEntryY: {
        scrollRange: [configs.marquee.titleEntryStart, configs.marquee.titleEntryEnd],
        valueRange: [30, 0],
      },
      containerExitOpacity: {
        scrollRange: [configs.marquee.containerExitStart, configs.marquee.containerExitEnd],
        valueRange: [1, 0],
      },
    },
  };

  return formatConfig;
};

// ============================================
// 调试面板主组件
// ============================================
export const TransitionDebugger = ({ enabled = true }) => {
  // 仅在开发环境启用
  const isDev = import.meta.env.DEV;
  
  if (!isDev || !enabled) {
    return null;
  }

  return (
    <>
      <Leva 
        collapsed={true}
        oneLineLabels={false}
        flat={false}
        theme={{
          colors: {
            accent1: '#FF4600',
            accent2: '#FF7A3D',
            accent3: '#FF4600',
          },
        }}
        titleBar={{
          title: '🎛️ Transition Debugger',
          drag: true,
          filter: true,
        }}
      />
      <ExportButton />
    </>
  );
};

// ============================================
// 导出按钮组件
// ============================================
const ExportButton = () => {
  // 使用 Leva 的 button 功能
  useControls('📋 导出配置', {
    '复制到剪贴板': button(() => {
      // 获取 localStorage 中的 leva 配置
      const levaState = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('leva')) {
          try {
            levaState[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch (e) {
            levaState[key] = localStorage.getItem(key);
          }
        }
      }
      
      const configStr = JSON.stringify(levaState, null, 2);
      navigator.clipboard.writeText(configStr).then(() => {
        alert('✅ 配置已复制到剪贴板!\n\n请粘贴到 transitionConfig.js 中');
      });
    }),
    '下载 JSON 文件': button(() => {
      const levaState = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('leva')) {
          try {
            levaState[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch (e) {
            levaState[key] = localStorage.getItem(key);
          }
        }
      }
      
      const blob = new Blob([JSON.stringify(levaState, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transition-config-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }),
    '重置为默认值': button(() => {
      // 清除 leva 相关的 localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('leva')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      alert('✅ 已重置为默认值!\n\n请刷新页面');
    }),
  });

  return null;
};

export default TransitionDebugger;
