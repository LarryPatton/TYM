import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

/**
 * Lenis 平滑滚动 Provider
 * 用法：在 App.jsx 中包裹 LenisProvider
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Object} props.options - Lenis 配置选项
 */
export function LenisProvider({ children, options = {} }) {
  const lenisRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 创建 Lenis 实例
    const lenis = new Lenis({
      // 默认配置
      duration: 1.2,           // 滚动持续时间（秒）
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical', // 滚动方向
      gestureOrientation: 'vertical',
      smoothWheel: true,       // 平滑鼠标滚轮
      wheelMultiplier: 1,      // 滚轮速度倍数
      touchMultiplier: 2,      // 触摸速度倍数
      infinite: false,         // 无限滚动
      // 合并自定义配置
      ...options,
    });

    lenisRef.current = lenis;
    setIsReady(true);

    // 使用 requestAnimationFrame 驱动 Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 清理函数
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 提供 Lenis 实例和实用方法
  const value = {
    lenis: lenisRef.current,
    isReady,
    // 滚动到指定位置
    scrollTo: (target, options = {}) => {
      lenisRef.current?.scrollTo(target, options);
    },
    // 滚动到顶部
    scrollToTop: (options = {}) => {
      lenisRef.current?.scrollTo(0, { duration: 1.5, ...options });
    },
    // 暂停滚动
    stop: () => {
      lenisRef.current?.stop();
    },
    // 恢复滚动
    start: () => {
      lenisRef.current?.start();
    },
  };

  return (
    <LenisContext.Provider value={value}>
      {children}
    </LenisContext.Provider>
  );
}

/**
 * 使用 Lenis 的 Hook
 * @returns {{ lenis: Lenis | null, isReady: boolean, scrollTo: Function, scrollToTop: Function, stop: Function, start: Function }}
 */
export function useLenis() {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
}

export default LenisContext;
