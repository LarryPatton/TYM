import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// 创建 Theme Context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  isTransitioning: false,
  transitionOrigin: { x: 0, y: 0 },
});

/**
 * ThemeProvider - 主题提供者组件
 * 管理主题状态，支持 localStorage 持久化和系统主题检测
 * 增强版：支持圆点扩散动画效果
 */
export const ThemeProvider = ({ children }) => {
  // 初始化主题：优先读取 localStorage，否则检测系统主题
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // 动画状态
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });
  const transitionRef = useRef(null);

  // 带动画的主题切换
  const toggleTheme = useCallback((event) => {
    // 获取点击位置（按钮中心）
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    
    if (event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (event?.clientX !== undefined) {
      x = event.clientX;
      y = event.clientY;
    }

    setTransitionOrigin({ x, y });

    // 检查是否支持 View Transitions API
    if (document.startViewTransition) {
      // 使用原生 View Transitions API
      setIsTransitioning(true);
      
      const transition = document.startViewTransition(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setThemeState(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });

      transition.ready.then(() => {
        // 计算最大半径（从点击位置到最远角落的距离）
        const maxX = Math.max(x, window.innerWidth - x);
        const maxY = Math.max(y, window.innerHeight - y);
        const maxRadius = Math.sqrt(maxX * maxX + maxY * maxY);

        // 应用圆形扩散动画 - 优化性能
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 400,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design 标准缓动
            pseudoElement: '::view-transition-new(root)',
            fill: 'forwards'
          }
        );
      });

      transition.finished.then(() => {
        setIsTransitioning(false);
      });
    } else {
      // 降级方案：使用 CSS 动画
      setIsTransitioning(true);
      
      // 先设置过渡状态
      setTimeout(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setThemeState(newTheme);
        
        // 动画结束后清除状态
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 50);
    }
  }, [theme]);

  // 设置指定主题（无动画）
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  // 当主题变化时，更新 DOM 和 localStorage（仅在非 View Transition 时）
  useEffect(() => {
    if (!document.startViewTransition) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // 初始化时设置主题
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme, 
      isTransitioning, 
      transitionOrigin 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme - 主题 Hook
 * 用于在组件中访问和切换主题
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;