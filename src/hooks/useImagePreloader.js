import { useState, useEffect, useCallback } from 'react';

/**
 * 图片预加载 Hook
 * @param {Array<string>} imageUrls - 需要预加载的图片 URL 数组
 * @param {Object} options - 配置选项
 * @param {boolean} options.enabled - 是否启用预加载（默认 true）
 * @param {number} options.threshold - 进入阈值百分比（默认 50，即加载 50% 后可进入页面）
 * @param {Function} options.onComplete - 加载完成回调
 * @param {Function} options.onProgress - 进度更新回调
 * @param {Function} options.onThresholdReached - 达到阈值回调
 * @returns {Object} { isLoading, canEnter, progress, loadedCount, totalCount, error }
 */
export const useImagePreloader = (imageUrls = [], options = {}) => {
  const {
    enabled = true,
    threshold = 50,
    onComplete,
    onProgress,
    onThresholdReached
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [canEnter, setCanEnter] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  // 计算真实加载进度（百分比）
  const progress = totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0;

  // 预加载单张图片
  const preloadImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ url, success: true });
      };
      
      img.onerror = () => {
        console.warn(`[ImagePreloader] Failed to load: ${url}`);
        // 即使加载失败，也视为"完成"，避免阻塞整体进度
        resolve({ url, success: false });
      };
      
      // 设置 crossOrigin 避免 CORS 问题
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }, []);

  // 执行预加载
  useEffect(() => {
    if (!enabled || !imageUrls || imageUrls.length === 0) {
      console.log('[useImagePreloader] Skipping: enabled=', enabled, 'imageUrls.length=', imageUrls?.length);
      return;
    }

    let isCancelled = false;
    
    const loadImages = async () => {
      console.log('[useImagePreloader] Starting preload:', imageUrls.length, 'images');
      console.log('[useImagePreloader] Image URLs:', imageUrls);
      
      setIsLoading(true);
      setLoadedCount(0);
      setTotalCount(imageUrls.length);
      setError(null);

      try {
        let loaded = 0;
        
        // 并发加载所有图片
        const loadPromises = imageUrls.map(async (url, index) => {
          const result = await preloadImage(url);
          
          if (!isCancelled) {
            loaded += 1;
            setLoadedCount(loaded);
            
            const currentProgress = Math.round((loaded / imageUrls.length) * 100);
            console.log(`[useImagePreloader] Loaded ${loaded}/${imageUrls.length} (${currentProgress}%)`, url);
            
            // 检查是否达到阈值（例如 50%）
            if (currentProgress >= threshold && !isCancelled) {
              console.log(`[useImagePreloader] ✅ Threshold ${threshold}% reached! User can enter page.`);
              setCanEnter(true);
              
              // 触发阈值达到回调
              if (onThresholdReached) {
                onThresholdReached({
                  loaded,
                  total: imageUrls.length,
                  progress: currentProgress
                });
              }
            }
            
            // 触发进度回调
            if (onProgress) {
              onProgress({
                loaded,
                total: imageUrls.length,
                progress: currentProgress
              });
            }
          }
          
          return result;
        });

        // 等待所有图片加载完成
        const results = await Promise.all(loadPromises);
        
        if (!isCancelled) {
          console.log('[useImagePreloader] ✅ All images (100%) loaded!');
          
          // 统计失败数量
          const failedCount = results.filter(r => !r.success).length;
          if (failedCount > 0) {
            console.warn(`[useImagePreloader] ${failedCount} images failed to load`);
          }
          
          // 如果之前未达到阈值（异常情况），现在设置为可进入
          if (!canEnter) {
            setCanEnter(true);
          }
          
          // 添加短暂延迟，确保用户看到完成状态
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setIsLoading(false);
          
          // 触发完成回调
          if (onComplete) {
            onComplete({
              total: imageUrls.length,
              success: imageUrls.length - failedCount,
              failed: failedCount
            });
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('[ImagePreloader] Error:', err);
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadImages();

    // 清理函数
    return () => {
      isCancelled = true;
    };
  }, [imageUrls, enabled, preloadImage]); // 移除 onComplete 和 onProgress 依赖，使用 useRef 或在内部直接调用

  return {
    isLoading,
    canEnter,
    progress,
    loadedCount,
    totalCount,
    error
  };
};

export default useImagePreloader;
