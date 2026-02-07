
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLenis } from '../contexts/LenisContext';

/**
 * useLenisScroll - 与 Lenis 集成的滚动监听 Hook
 * 
 * 优势：
 * 1. 直接监听 Lenis 的 scroll 事件，避免原生 scroll 事件的性能问题
 * 2. 自动处理 RAF 节流
 * 3. 提供滚动进度、方向等信息
 * 
 * @param {Object} options
 * @param {React.RefObject} options.target - 目标元素的 ref
 * @param {string} options.offset - 偏移量配置，如 "start start", "end end"
 * @param {function} options.onScroll - 滚动回调
 * @returns {{ progress: number, velocity: number, direction: number, isInView: boolean }}
 */
export function useLenisScroll({ target, offset = ["start end", "end start"], onScroll } = {}) {
  const { lenis, isReady } = useLenis();
  const [scrollState, setScrollState] = useState({
    progress: 0,
    velocity: 0,
    direction: 0,
    isInView: false
  });
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (!isReady || !lenis) return;

    const handleScroll = ({ scroll, velocity, direction }) => {
      let progress = 0;
      let isInView = false;

      if (target?.current) {
        const rect = target.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;

        // 解析 offset 配置
        const [startOffset, endOffset] = offset;
        
        // 计算进入和离开的阈值
        let startThreshold, endThreshold;
        
        if (startOffset === "start start") {
          startThreshold = elementTop;
        } else if (startOffset === "start end") {
          startThreshold = elementTop - windowHeight;
        } else {
          startThreshold = elementTop - windowHeight;
        }

        if (endOffset === "end end") {
          endThreshold = elementTop + elementHeight - windowHeight;
        } else if (endOffset === "end start") {
          endThreshold = elementTop + elementHeight;
        } else {
          endThreshold = elementTop + elementHeight;
        }

        // 计算进度 (0 到 1)
        const totalDistance = endThreshold - startThreshold;
        if (totalDistance !== 0) {
          progress = Math.max(0, Math.min(1, -startThreshold / totalDistance));
        }

        // 判断是否在视口内
        isInView = rect.bottom > 0 && rect.top < windowHeight;
      } else {
        // 全局滚动进度
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress = maxScroll > 0 ? scroll / maxScroll : 0;
        isInView = true;
      }

      // 只有进度变化超过阈值时才更新状态
      if (Math.abs(progress - lastProgressRef.current) > 0.001) {
        lastProgressRef.current = progress;
        
        const newState = {
          progress,
          velocity,
          direction,
          isInView
        };
        
        setScrollState(newState);
        
        if (onScroll) {
          onScroll(newState);
        }
      }
    };

    // 监听 Lenis 的 scroll 事件
    lenis.on('scroll', handleScroll);
    
    // 初始调用
    handleScroll({ 
      scroll: lenis.scroll, 
      velocity: 0, 
      direction: 0 
    });

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [isReady, lenis, target, offset, onScroll]);

  return scrollState;
}

/**
 * useLenisScrollProgress - 简化版的滚动进度 Hook
 * 专门用于获取元素相对于视口的滚动进度
 * 
 * @param {React.RefObject} containerRef - 容器元素的 ref
 * @param {Array} offsetConfig - 偏移配置 ["start start", "end end"]
 * @returns {{ progress: number, isInView: boolean }}
 */
export function useLenisScrollProgress(containerRef, offsetConfig = ["start start", "end end"]) {
  const { lenis, isReady } = useLenis();
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const rafRef = useRef(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (!isReady || !lenis || !containerRef?.current) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerTop = rect.top;
      const containerHeight = rect.height;

      // 解析 offset 配置
      const [startConfig, endConfig] = offsetConfig;
      
      // 计算开始位置
      let scrollStart = 0;
      if (startConfig === "start start") {
        scrollStart = containerTop;
      } else if (startConfig === "start end") {
        scrollStart = containerTop - viewportHeight;
      }

      // 计算结束位置
      let scrollEnd = 0;
      if (endConfig === "end end") {
        scrollEnd = containerTop + containerHeight - viewportHeight;
      } else if (endConfig === "end start") {
        scrollEnd = containerTop + containerHeight;
      }

      // 计算进度
      const totalScrollable = scrollEnd - scrollStart;
      const scrolled = -scrollStart;
      const newProgress = totalScrollable > 0 
        ? Math.max(0, Math.min(1, scrolled / totalScrollable))
        : 0;

      // 判断是否在视口内
      const inView = rect.bottom > 0 && rect.top < viewportHeight;
      setIsInView(inView);

      // 只有进度变化超过阈值时才更新
      if (Math.abs(newProgress - lastProgressRef.current) > 0.005) {
        lastProgressRef.current = newProgress;
        setProgress(newProgress);
      }
    };

    lenis.on('scroll', handleScroll);
    handleScroll(); // 初始调用

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [isReady, lenis, containerRef, offsetConfig]);

  return { progress, isInView };
}

/**
 * useInViewLenis - 使用 Lenis 实现的 InView 检测
 * 
 * @param {React.RefObject} ref - 目标元素的 ref
 * @param {Object} options
 * @param {boolean} options.once - 是否只触发一次
 * @param {string} options.margin - 视口边距
 * @returns {boolean}
 */
export function useInViewLenis(ref, { once = true, margin = '0px' } = {}) {
  const [isInView, setIsInView] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!ref?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            hasTriggeredRef.current = true;
            observer.disconnect();
          }
        } else if (!once && !hasTriggeredRef.current) {
          setIsInView(false);
        }
      },
      { threshold: 0.1, rootMargin: margin }
    );

    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [ref, once, margin]);

  return isInView;
}

export default useLenisScroll;
