import { useState, useEffect, useCallback } from 'react';

/**
 * useMediaQuery Hook
 * 用于检测媒体查询是否匹配
 * 
 * @param {string} query - CSS 媒体查询字符串，如 '(max-width: 768px)'
 * @returns {boolean} - 媒体查询是否匹配
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query) {
  // 获取初始匹配状态（SSR 安全）
  const getMatches = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  }, [query]);

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // 初始化
    setMatches(mediaQuery.matches);

    // 监听变化
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // 使用新 API（如果可用），否则回退到旧 API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 兼容旧浏览器
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * 预定义的断点查询 Hooks
 * 基于 index.css 中定义的断点系统
 */

// 断点值（与 CSS 变量保持一致）
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * 检测是否为移动端（< 768px）
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

/**
 * 检测是否为平板（768px - 1023px）
 */
export function useIsTablet() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
}

/**
 * 检测是否为桌面端（>= 1024px）
 */
export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

/**
 * 检测是否为小手机（< 480px）
 */
export function useIsSmallMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.xs - 1}px)`);
}

/**
 * 检测是否为触摸设备
 */
export function useIsTouchDevice() {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

/**
 * 检测是否偏好减少动画
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * 检测是否偏好深色模式（系统级）
 */
export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * 检测是否为横屏模式
 */
export function useIsLandscape() {
  return useMediaQuery('(orientation: landscape)');
}

/**
 * 检测是否为竖屏模式
 */
export function useIsPortrait() {
  return useMediaQuery('(orientation: portrait)');
}

export default useMediaQuery;
