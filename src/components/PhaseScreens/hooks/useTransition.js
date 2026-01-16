/**
 * ============================================
 * 过渡效果自定义 Hook
 * ============================================
 * 
 * 简化组件中过渡动画的使用
 * 从统一配置文件读取参数
 */

import { useTransform } from 'framer-motion';
import { getScreenTransition, getTransitionParam } from '../../../config/transitionConfig';

/**
 * 创建过渡动画值
 * 根据配置自动生成 useTransform
 * 
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @param {object} config - 过渡配置 { scrollRange, valueRange }
 * @returns {MotionValue} 动画值
 * 
 * @example
 * const opacity = useTransitionValue(scrollYProgress, { 
 *   scrollRange: [0, 0.3], 
 *   valueRange: [0, 1] 
 * });
 */
export const useTransitionValue = (scrollYProgress, config) => {
  if (!config || !config.scrollRange || !config.valueRange) {
    console.warn('Invalid transition config:', config);
    return useTransform(scrollYProgress, [0, 1], [1, 1]);
  }
  return useTransform(scrollYProgress, config.scrollRange, config.valueRange);
};

/**
 * 使用屏幕过渡配置
 * 自动从配置文件读取并生成所有动画值
 * 
 * @param {string} screenId - 屏幕 ID
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @returns {object} 包含所有动画值的对象
 * 
 * @example
 * const T = useScreenTransitions('intro', scrollYProgress);
 * // 使用: T.maskReveal, T.textExitOpacity, T.textExitY 等
 */
export const useScreenTransitions = (screenId, scrollYProgress) => {
  const config = getScreenTransition(screenId);
  const transitions = {};
  
  Object.entries(config).forEach(([key, value]) => {
    // 跳过非动画配置 (如 scrollHeight, totalCards 等)
    if (value && typeof value === 'object' && value.scrollRange && value.valueRange) {
      transitions[key] = useTransform(scrollYProgress, value.scrollRange, value.valueRange);
    }
  });
  
  return transitions;
};

/**
 * 快捷：获取单个过渡参数并创建动画值
 * 
 * @param {string} screenId - 屏幕 ID
 * @param {string} paramName - 参数名
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @returns {MotionValue} 动画值
 * 
 * @example
 * const opacity = useTransitionParam('intro', 'textExitOpacity', scrollYProgress);
 */
export const useTransitionParam = (screenId, paramName, scrollYProgress) => {
  const param = getTransitionParam(screenId, paramName);
  return useTransform(scrollYProgress, param.scrollRange, param.valueRange);
};

/**
 * 快捷：标准离场动画
 * 在滚动末尾淡出并上移
 * 
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @param {object} options - 配置选项
 * @returns {object} { opacity, y }
 * 
 * @example
 * const exit = useExitTransition(scrollYProgress, { start: 0.85 });
 * <motion.div style={{ opacity: exit.opacity, y: exit.y }}>
 */
export const useExitTransition = (scrollYProgress, options = {}) => {
  const { 
    start = 0.85, 
    end = 1.0, 
    yOffset = '-20%' 
  } = options;
  
  return {
    opacity: useTransform(scrollYProgress, [start, end], [1, 0]),
    y: useTransform(scrollYProgress, [start, end], ['0%', yOffset]),
  };
};

/**
 * 快捷：标准入场动画
 * 从下方淡入并上浮
 * 
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @param {object} options - 配置选项
 * @returns {object} { opacity, y }
 * 
 * @example
 * const entry = useEntryTransition(scrollYProgress, { end: 0.2 });
 */
export const useEntryTransition = (scrollYProgress, options = {}) => {
  const { 
    start = 0, 
    end = 0.15, 
    yOffset = 30 
  } = options;
  
  return {
    opacity: useTransform(scrollYProgress, [start, end], [0, 1]),
    y: useTransform(scrollYProgress, [start, end], [yOffset, 0]),
  };
};

/**
 * 快捷：四关键帧动画 (入-保持-出)
 * 适用于需要淡入、保持一段时间、再淡出的元素
 * 
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @param {object} options - 配置选项
 * @returns {MotionValue} 透明度动画值
 * 
 * @example
 * const opacity = useFadeInOutTransition(scrollYProgress, {
 *   fadeInStart: 0.45,
 *   fadeInEnd: 0.52,
 *   fadeOutStart: 0.85,
 *   fadeOutEnd: 0.95
 * });
 */
export const useFadeInOutTransition = (scrollYProgress, options = {}) => {
  const { 
    fadeInStart = 0.45,
    fadeInEnd = 0.52,
    fadeOutStart = 0.85,
    fadeOutEnd = 0.95 
  } = options;
  
  return useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0]
  );
};

/**
 * 快捷：缩放动画
 * 从小到大的缩放效果
 * 
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @param {object} options - 配置选项
 * @returns {MotionValue} 缩放动画值
 */
export const useScaleTransition = (scrollYProgress, options = {}) => {
  const { 
    start = 0, 
    end = 0.5, 
    fromScale = 0.9, 
    toScale = 1 
  } = options;
  
  return useTransform(scrollYProgress, [start, end], [fromScale, toScale]);
};

/**
 * 快捷：模糊动画
 * 从模糊到清晰
 * 
 * @param {MotionValue} scrollYProgress - 滚动进度
 * @param {object} options - 配置选项
 * @returns {MotionValue} 模糊值 (数字，需要拼接 'px')
 */
export const useBlurTransition = (scrollYProgress, options = {}) => {
  const { 
    start = 0, 
    end = 0.4, 
    fromBlur = 20, 
    toBlur = 0 
  } = options;
  
  return useTransform(scrollYProgress, [start, end], [fromBlur, toBlur]);
};

export default {
  useTransitionValue,
  useScreenTransitions,
  useTransitionParam,
  useExitTransition,
  useEntryTransition,
  useFadeInOutTransition,
  useScaleTransition,
  useBlurTransition,
};
