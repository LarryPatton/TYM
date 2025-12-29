import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // 路由切换时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 页面刷新/初次加载时滚动到顶部
  useEffect(() => {
    // 使用 history.scrollRestoration 禁用浏览器的自动滚动恢复
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // 页面加载时滚动到顶部
    window.scrollTo(0, 0);
    
    return () => {
      // 组件卸载时恢复默认行为
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return null;
};

export default ScrollToTop;
