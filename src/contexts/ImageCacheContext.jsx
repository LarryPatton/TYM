import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * 全局图片缓存 Context
 * 
 * 功能：
 * 1. 记录已成功加载的图片 URL（当前会话内）
 * 2. 提供方法检查图片是否已缓存
 * 3. 提供方法批量检查和标记图片
 * 
 * 使用场景：
 * - 用户在页面间导航时，避免重复显示加载页
 * - 预加载时快速跳过已加载的图片
 */

const ImageCacheContext = createContext(null);

/**
 * 图片缓存 Provider
 */
export const ImageCacheProvider = ({ children }) => {
  // 使用 Set 存储已加载的图片 URL（高效查找）
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  // 记录每个页面是否已完成加载
  const [loadedPages, setLoadedPages] = useState(new Set());

  /**
   * 检查单张图片是否已缓存
   * @param {string} url - 图片 URL
   * @returns {boolean} - 是否已缓存
   */
  const isImageCached = useCallback((url) => {
    if (!url) return false;
    return loadedImages.has(url);
  }, [loadedImages]);

  /**
   * 检查图片是否已在浏览器缓存中（通过 img.complete）
   * 注意：这是同步操作，会创建临时 Image 对象
   * @param {string} url - 图片 URL
   * @returns {boolean} - 是否在浏览器缓存中
   */
  const isImageInBrowserCache = useCallback((url) => {
    if (!url) return false;
    
    // 如果已在我们的缓存记录中，直接返回 true
    if (loadedImages.has(url)) return true;
    
    // 检查浏览器缓存
    try {
      const img = new Image();
      img.src = url;
      return img.complete && img.naturalWidth > 0;
    } catch {
      return false;
    }
  }, [loadedImages]);

  /**
   * 标记单张图片为已加载
   * @param {string} url - 图片 URL
   */
  const markImageAsLoaded = useCallback((url) => {
    if (!url) return;
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
  }, []);

  /**
   * 批量标记图片为已加载
   * @param {string[]} urls - 图片 URL 数组
   */
  const markImagesAsLoaded = useCallback((urls) => {
    if (!urls || urls.length === 0) return;
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      urls.forEach(url => {
        if (url) newSet.add(url);
      });
      return newSet;
    });
  }, []);

  /**
   * 检查一组图片中有多少已缓存
   * @param {string[]} urls - 图片 URL 数组
   * @returns {{ cached: number, total: number, allCached: boolean }}
   */
  const checkCacheStatus = useCallback((urls) => {
    if (!urls || urls.length === 0) {
      return { cached: 0, total: 0, allCached: true };
    }
    
    let cachedCount = 0;
    urls.forEach(url => {
      if (isImageInBrowserCache(url)) {
        cachedCount++;
      }
    });
    
    return {
      cached: cachedCount,
      total: urls.length,
      allCached: cachedCount === urls.length
    };
  }, [isImageInBrowserCache]);

  /**
   * 检查页面是否已完成加载
   * @param {string} pageId - 页面标识符（如 'home', 'work', 'gallery'）
   * @returns {boolean}
   */
  const isPageLoaded = useCallback((pageId) => {
    return loadedPages.has(pageId);
  }, [loadedPages]);

  /**
   * 标记页面为已完成加载
   * @param {string} pageId - 页面标识符
   */
  const markPageAsLoaded = useCallback((pageId) => {
    if (!pageId) return;
    setLoadedPages(prev => {
      const newSet = new Set(prev);
      newSet.add(pageId);
      return newSet;
    });
  }, []);

  /**
   * 获取缓存统计信息（用于调试）
   */
  const getCacheStats = useCallback(() => {
    return {
      totalImages: loadedImages.size,
      totalPages: loadedPages.size,
      pages: Array.from(loadedPages),
    };
  }, [loadedImages, loadedPages]);

  /**
   * 清除所有缓存（用于测试或重置）
   */
  const clearCache = useCallback(() => {
    setLoadedImages(new Set());
    setLoadedPages(new Set());
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // 图片级别
    isImageCached,
    isImageInBrowserCache,
    markImageAsLoaded,
    markImagesAsLoaded,
    checkCacheStatus,
    
    // 页面级别
    isPageLoaded,
    markPageAsLoaded,
    
    // 调试工具
    getCacheStats,
    clearCache,
  }), [
    isImageCached,
    isImageInBrowserCache,
    markImageAsLoaded,
    markImagesAsLoaded,
    checkCacheStatus,
    isPageLoaded,
    markPageAsLoaded,
    getCacheStats,
    clearCache,
  ]);

  return (
    <ImageCacheContext.Provider value={contextValue}>
      {children}
    </ImageCacheContext.Provider>
  );
};

/**
 * 使用图片缓存的 Hook
 * @returns {Object} 缓存操作方法
 */
export const useImageCache = () => {
  const context = useContext(ImageCacheContext);
  
  if (!context) {
    // 如果没有 Provider，返回空操作（graceful degradation）
    console.warn('[ImageCache] useImageCache must be used within ImageCacheProvider');
    return {
      isImageCached: () => false,
      isImageInBrowserCache: () => false,
      markImageAsLoaded: () => {},
      markImagesAsLoaded: () => {},
      checkCacheStatus: () => ({ cached: 0, total: 0, allCached: false }),
      isPageLoaded: () => false,
      markPageAsLoaded: () => {},
      getCacheStats: () => ({ totalImages: 0, totalPages: 0, pages: [] }),
      clearCache: () => {},
    };
  }
  
  return context;
};

export default ImageCacheContext;
