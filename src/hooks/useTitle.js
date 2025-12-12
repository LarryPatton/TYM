import { useEffect } from 'react';

export const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | LOGO.`; // 后缀可以统一修改，例如 " | 提示词库"
    
    // 页面卸载时恢复之前的标题（可选，通常不需要）
    return () => {
      // document.title = prevTitle; 
    };
  }, [title]);
};
