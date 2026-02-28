import { useEffect } from 'react';

export const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    
    // 页面卸载时恢复之前的标题（可选，通常不需要）
    return () => {
      // document.title = prevTitle; 
    };
  }, [title]);
};
