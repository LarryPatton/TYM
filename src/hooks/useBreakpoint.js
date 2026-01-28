import { useState, useEffect, useMemo } from 'react';
import { BREAKPOINTS } from './useMediaQuery';

/**
 * useBreakpoint Hook
 * 返回当前屏幕宽度对应的断点名称
 * 
 * @returns {Object} 断点信息对象
 * - breakpoint: 当前断点名称 ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
 * - width: 当前窗口宽度
 * - isMobile: 是否为移动端 (< md)
 * - isTablet: 是否为平板 (md - lg)
 * - isDesktop: 是否为桌面 (>= lg)
 * 
 * @example
 * const { breakpoint, isMobile, isDesktop } = useBreakpoint();
 * 
 * // 根据断点渲染不同内容
 * {isMobile ? <MobileNav /> : <DesktopNav />}
 * 
 * // 获取具体断点
 * {breakpoint === 'xs' && <ExtraSmallComponent />}
 */
export function useBreakpoint() {
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024; // SSR 默认值
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 使用 ResizeObserver 或 resize 事件
    window.addEventListener('resize', handleResize);
    
    // 初始化
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 计算当前断点
  const breakpointInfo = useMemo(() => {
    const width = windowWidth;
    
    let breakpoint;
    if (width < BREAKPOINTS.xs) {
      breakpoint = 'xs';
    } else if (width < BREAKPOINTS.sm) {
      breakpoint = 'sm';
    } else if (width < BREAKPOINTS.md) {
      breakpoint = 'md';
    } else if (width < BREAKPOINTS.lg) {
      breakpoint = 'lg';
    } else if (width < BREAKPOINTS.xl) {
      breakpoint = 'xl';
    } else {
      breakpoint = '2xl';
    }

    return {
      breakpoint,
      width,
      // 便捷布尔值
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      // 更细粒度的断点检测
      isXs: width < BREAKPOINTS.xs,
      isSm: width >= BREAKPOINTS.xs && width < BREAKPOINTS.sm,
      isMd: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
      isLg: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isXl: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
      is2xl: width >= BREAKPOINTS.xl,
      // 范围检测
      isAbove: (bp) => width >= BREAKPOINTS[bp],
      isBelow: (bp) => width < BREAKPOINTS[bp],
      isBetween: (minBp, maxBp) => width >= BREAKPOINTS[minBp] && width < BREAKPOINTS[maxBp],
    };
  }, [windowWidth]);

  return breakpointInfo;
}

/**
 * useWindowSize Hook
 * 返回窗口尺寸
 * 
 * @returns {{ width: number, height: number }}
 */
export function useWindowSize() {
  const [size, setSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 1024, height: 768 };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * useResponsiveValue Hook
 * 根据断点返回对应的值
 * 
 * @param {Object} values - 断点对应的值 { base, sm, md, lg, xl }
 * @returns {*} 当前断点对应的值
 * 
 * @example
 * const columns = useResponsiveValue({ base: 1, sm: 2, md: 3, lg: 4 });
 * const padding = useResponsiveValue({ base: '16px', md: '32px', lg: '48px' });
 */
export function useResponsiveValue(values) {
  const { width } = useBreakpoint();
  
  return useMemo(() => {
    // 按断点顺序从大到小检查
    const breakpointOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs', 'base'];
    const breakpointWidths = {
      '2xl': BREAKPOINTS['2xl'],
      'xl': BREAKPOINTS.xl,
      'lg': BREAKPOINTS.lg,
      'md': BREAKPOINTS.md,
      'sm': BREAKPOINTS.sm,
      'xs': BREAKPOINTS.xs,
      'base': 0,
    };

    for (const bp of breakpointOrder) {
      if (values[bp] !== undefined && width >= breakpointWidths[bp]) {
        return values[bp];
      }
    }

    // 返回 base 值或第一个定义的值
    return values.base ?? Object.values(values)[0];
  }, [values, width]);
}

export default useBreakpoint;
