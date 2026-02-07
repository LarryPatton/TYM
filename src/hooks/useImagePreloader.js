import { useState, useEffect, useCallback, useRef } from 'react';
import { useImageCache } from '../contexts/ImageCacheContext';

/**
 * 图片预加载 Hook（带缓存优化）
 * 
 * 优化策略：
 * 1. 检查全局缓存记录（ImageCacheContext）
 * 2. 检查浏览器缓存（img.complete）
 * 3. 已缓存的图片直接标记为已加载，瞬间完成
 * 
 * @param {Array<string>} imageUrls - 需要预加载的图片 URL 数组
 * @param {Object} options - 配置选项
 * @param {boolean} options.enabled - 是否启用预加载（默认 true）
 * @param {number} options.threshold - 进入阈值百分比（默认 50，即加载 50% 后可进入页面）
 * @param {string} options.pageId - 页面标识符（用于页面级缓存检测）
 * @param {Function} options.onComplete - 加载完成回调
 * @param {Function} options.onProgress - 进度更新回调
 * @param {Function} options.onThresholdReached - 达到阈值回调
 * @returns {Object} { isLoading, canEnter, progress, loadedCount, totalCount, error, fromCache }
 */
export const useImagePreloader = (imageUrls = [], options = {}) => {
  const {
    enabled = true,
    threshold = 50,
    pageId = '',
    onComplete,
    onProgress,
    onThresholdReached
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [canEnter, setCanEnter] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  
  // 全局缓存 Context
  const { 
    isImageInBrowserCache, 
    markImagesAsLoaded, 
    isPageLoaded, 
    markPageAsLoaded 
  } = useImageCache();
  
  // 用于防止重复触发阈值回调
  const thresholdReachedRef = useRef(false);

  // 计算真实加载进度（百分比）
  const progress = totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0;

  /**
   * 检查单张图片是否已在缓存中（浏览器缓存）
   * @param {string} url - 图片 URL
   * @returns {boolean}
   */
  const checkBrowserCache = useCallback((url) => {
    if (!url) return false;
    try {
      const img = new Image();
      img.src = url;
      // 如果图片已在浏览器缓存中，complete 会立即为 true
      return img.complete && img.naturalWidth > 0;
    } catch {
      return false;
    }
  }, []);

  /**
   * 预加载单张图片
   * @param {string} url - 图片 URL
   * @returns {Promise<{url: string, success: boolean, cached: boolean}>}
   */
  const preloadImage = useCallback((url) => {
    return new Promise((resolve) => {
      // 先检查浏览器缓存
      if (checkBrowserCache(url)) {
        resolve({ url, success: true, cached: true });
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        resolve({ url, success: true, cached: false });
      };
      
      img.onerror = () => {
        console.warn(`[ImagePreloader] Failed to load: ${url}`);
        // 即使加载失败，也视为"完成"，避免阻塞整体进度
        resolve({ url, success: false, cached: false });
      };
      
      // 设置 crossOrigin 避免 CORS 问题
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }, [checkBrowserCache]);

  // 执行预加载
  useEffect(() => {
    if (!enabled || !imageUrls || imageUrls.length === 0) {
      return;
    }
    
    // 重置阈值触发标志
    thresholdReachedRef.current = false;

    let isCancelled = false;
    
    const loadImages = async () => {
      // 🚀 优化：检查页面级缓存
      if (pageId && isPageLoaded(pageId)) {
        console.log(`[ImagePreloader] 🚀 Page "${pageId}" already loaded, skipping preload`);
        setFromCache(true);
        setCanEnter(true);
        setTotalCount(imageUrls.length);
        setLoadedCount(imageUrls.length);
        
        // 触发完成回调
        if (onComplete) {
          onComplete({
            total: imageUrls.length,
            success: imageUrls.length,
            failed: 0,
            fromCache: true
          });
        }
        return;
      }
      
      // 🚀 优化：检查所有图片是否都已在浏览器缓存中
      let cachedCount = 0;
      imageUrls.forEach(url => {
        if (isImageInBrowserCache(url) || checkBrowserCache(url)) {
          cachedCount++;
        }
      });
      
      const allCached = cachedCount === imageUrls.length;
      console.log(`[ImagePreloader] Cache check: ${cachedCount}/${imageUrls.length} cached`);
      
      // 如果全部已缓存，快速完成
      if (allCached) {
        console.log('[ImagePreloader] 🚀 All images cached! Fast-forwarding...');
        setFromCache(true);
        setTotalCount(imageUrls.length);
        setLoadedCount(imageUrls.length);
        setCanEnter(true);
        
        // 标记页面为已加载
        if (pageId) {
          markPageAsLoaded(pageId);
        }
        markImagesAsLoaded(imageUrls);
        
        // 触发回调
        if (onThresholdReached && !thresholdReachedRef.current) {
          thresholdReachedRef.current = true;
          onThresholdReached({
            loaded: imageUrls.length,
            total: imageUrls.length,
            progress: 100,
            fromCache: true
          });
        }
        
        if (onComplete) {
          onComplete({
            total: imageUrls.length,
            success: imageUrls.length,
            failed: 0,
            fromCache: true
          });
        }
        return;
      }
      
      // 正常加载流程
      setIsLoading(true);
      setLoadedCount(0);
      setTotalCount(imageUrls.length);
      setError(null);
      setFromCache(false);

      try {
        let loaded = 0;
        
        // 并发加载所有图片
        const loadPromises = imageUrls.map(async (url) => {
          const result = await preloadImage(url);
          
          if (!isCancelled) {
            loaded += 1;
            setLoadedCount(loaded);
            
            const currentProgress = Math.round((loaded / imageUrls.length) * 100);
            
            // 检查是否达到阈值
            if (currentProgress >= threshold && !thresholdReachedRef.current) {
              thresholdReachedRef.current = true;
              setCanEnter(true);
              
              // 触发阈值达到回调
              if (onThresholdReached) {
                onThresholdReached({
                  loaded,
                  total: imageUrls.length,
                  progress: currentProgress,
                  fromCache: false
                });
              }
            }
            
            // 触发进度回调
            if (onProgress) {
              onProgress({
                loaded,
                total: imageUrls.length,
                progress: currentProgress,
                cached: result.cached
              });
            }
          }
          
          return result;
        });

        // 等待所有图片加载完成
        const results = await Promise.all(loadPromises);
        
        if (!isCancelled) {
          // 统计结果
          const failedCount = results.filter(r => !r.success).length;
          const cachedFromLoad = results.filter(r => r.cached).length;
          
          console.log(`[ImagePreloader] Completed: ${imageUrls.length - failedCount} success, ${failedCount} failed, ${cachedFromLoad} from browser cache`);
          
          // 如果之前未达到阈值（异常情况），现在设置为可进入
          if (!thresholdReachedRef.current) {
            setCanEnter(true);
          }
          
          // 标记所有成功加载的图片到全局缓存
          const successUrls = results.filter(r => r.success).map(r => r.url);
          markImagesAsLoaded(successUrls);
          
          // 标记页面为已加载
          if (pageId) {
            markPageAsLoaded(pageId);
          }
          
          // 添加短暂延迟，确保用户看到完成状态
          await new Promise(resolve => setTimeout(resolve, 300));
          
          setIsLoading(false);
          
          // 触发完成回调
          if (onComplete) {
            onComplete({
              total: imageUrls.length,
              success: imageUrls.length - failedCount,
              failed: failedCount,
              fromCache: false
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
  }, [imageUrls, enabled, pageId, threshold, preloadImage, checkBrowserCache, isImageInBrowserCache, isPageLoaded, markImagesAsLoaded, markPageAsLoaded]);

  return {
    isLoading,
    canEnter,
    progress,
    loadedCount,
    totalCount,
    error,
    fromCache
  };
};

export default useImagePreloader;