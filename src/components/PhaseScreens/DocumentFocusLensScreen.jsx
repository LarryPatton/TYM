import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLenisScrollProgress } from '../../hooks/useLenisScroll';

/**
 * DocumentFocusLensScreen - 文档 Focus Lens 展示组件
 * 
 * 特性：
 * - 4张 A4 竖向文档依次聚焦
 * - 滚动驱动切换
 * - 当前激活的文档放大居中
 * - 非激活文档模糊淡化
 * - 透明底 PNG 支持
 * - 支持 contentKey 获取翻译文案
 * 
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 * @param {string} contentKey - i18n 翻译键
 */
export const DocumentFocusLensScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  contentKey,
  images = [],
  bgColor = '#000'
}) => {
  const ref = useRef(null);
  const { t } = useTranslation();
  
  // 文案状态
  const [textVisible, setTextVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTextTriggeredRef = useRef(false);
  
  // 获取文案内容（优先使用 contentKey，其次使用 content）
  const caption = contentKey ? t(contentKey) : (content || '');
  
  // 解析文案，识别高亮文本（「」内的内容 + 特定类型名词）
  const parsedContent = useMemo(() => {
    if (!caption) return [];
    
    // 需要高亮的类型名词列表
    const highlightKeywords = ['KV', 'CMF', 'SKU', 'VI', 'UI', 'UX'];
    
    const parts = [];
    let currentIndex = 0;
    
    // 合并正则：匹配「...」或 "..." 或 "..." 或 特定关键词
    const keywordsPattern = highlightKeywords.map(kw => `\\b${kw}\\b`).join('|');
    const regex = new RegExp(`([「""])([^」""]+)([」""])|(${keywordsPattern})`, 'g');
    let match;
    
    while ((match = regex.exec(caption)) !== null) {
      // 添加普通文本
      if (match.index > currentIndex) {
        const text = caption.slice(currentIndex, match.index);
        [...text].forEach(char => parts.push({ char, highlight: false }));
      }
      
      // 添加高亮文本
      const fullMatch = match[0];
      [...fullMatch].forEach(char => parts.push({ char, highlight: true }));
      
      currentIndex = match.index + match[0].length;
    }
    
    // 添加剩余文本
    if (currentIndex < caption.length) {
      const text = caption.slice(currentIndex);
      [...text].forEach(char => parts.push({ char, highlight: false }));
    }
    
    return parts;
  }, [caption]);
  
  // 是否有文案需要显示
  const hasCaption = !!caption && parsedContent.length > 0;
  
  // Lenis 驱动的滚动进度
  const { progress } = useLenisScrollProgress(ref, ["start start", "end end"]);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const itemCount = images.length;

  // 滚动进度 → 激活索引映射
  useEffect(() => {
    // 将 0~0.85 的滚动进度映射到 0~(itemCount-1) 的索引
    // 保留 15% 用于最后一张停留
    const adjustedProgress = Math.min(progress / 0.85, 1);
    const index = Math.round(adjustedProgress * (itemCount - 1));
    setActiveIndex(Math.min(index, itemCount - 1));
  }, [progress, itemCount]);
  
  // 文案立即显示（组件挂载时触发）
  useEffect(() => {
    if (!hasCaption || hasTextTriggeredRef.current) return;
    
    // 立即触发文案显示
    hasTextTriggeredRef.current = true;
    setTextVisible(true);
    
    // 逐字显示
    const charInterval = 30;
    parsedContent.forEach((_, index) => {
      const timer = setTimeout(() => {
        setRevealedCharCount(prev => Math.max(prev, index + 1));
      }, index * charInterval);
      textTimersRef.current.push(timer);
    });
    
    return () => {
      textTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [hasCaption, parsedContent.length]);

  if (images.length === 0) return null;

  // 计算滚动高度：每张图 100vh + 额外 50vh
  const scrollHeight = itemCount * 100 + 50;
  
  // Item 基础尺寸配置 (用于 Carousel 计算)
  const ITEM_HEIGHT_VH = 65; // 基准高度 65vh
  const ASPECT_RATIO = 2164 / 3063;
  const ITEM_WIDTH_VH = ITEM_HEIGHT_VH * ASPECT_RATIO;
  const GAP_PX = 60; // 间距

  return (
    <div 
      ref={ref} 
      style={{ 
        height: `${scrollHeight}vh`, 
        position: 'relative', 
        background: bgColor 
      }}
    >
      <div style={{ 
        position: 'sticky', 
        top: '0', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* 顶部文案区 - 使用统一的 CAPTION 样式，居中显示在图片上方 */}
        {hasCaption && (
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '60px 32px 24px',
            boxSizing: 'border-box',
            zIndex: 20,
            flexShrink: 0
          }}>
            <p style={{
              margin: 0,
              maxWidth: 'var(--caption-max-width, 1100px)',
              color: 'var(--caption-color, #fff)',
              fontSize: 'var(--caption-font-size)',
              lineHeight: 'var(--caption-line-height, 1.7)',
              letterSpacing: 'var(--caption-letter-spacing, 0.04em)',
              fontWeight: 'var(--caption-font-weight, 300)',
              textAlign: 'center'
            }}>
              {parsedContent.map((item, i) => {
                const isRevealed = i < revealedCharCount;
                return (
                  <span
                    key={i}
                    style={{
                      display: 'inline',
                      color: item.highlight ? 'var(--caption-color-highlight, #FF5722)' : 'inherit',
                      fontWeight: item.highlight ? 'var(--caption-font-weight-highlight, 600)' : 'var(--caption-font-weight, 300)',
                      opacity: isRevealed ? 1 : 0,
                      transition: 'var(--caption-fade-transition, opacity 0.4s ease-out, color 0.3s ease)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {item.char}
                  </span>
                );
              })}
            </p>
          </div>
        )}

        {/* 文档卡片容器 - 中间区域 (Centered Carousel) */}
        <div style={{ 
          flex: 1,
          width: '100%',
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div 
            animate={{
              x: `calc(50vw - ${(activeIndex * ITEM_WIDTH_VH + ITEM_WIDTH_VH / 2)}vh - ${activeIndex * GAP_PX}px)`
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.8 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: `${GAP_PX}px`,
              paddingLeft: '0', // 居中是通过 x 偏移实现的
              height: '100%'
            }}
          >
            {images.map((image, i) => {
              const isActive = activeIndex === i;
              const distance = Math.abs(activeIndex - i);
              
              // 视觉层级参数优化
              const blurValue = isActive ? 0 : Math.min(8, 2 + distance * 3);
              const opacityValue = isActive ? 1 : Math.max(0.15, 0.4 - distance * 0.15);
              const scaleValue = isActive ? 1.15 : Math.max(0.8, 0.9 - distance * 0.05);

              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: scaleValue,
                    opacity: opacityValue,
                    zIndex: isActive ? 10 : 5 - distance,
                    filter: `blur(${blurValue}px)`
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    height: `${ITEM_HEIGHT_VH}vh`, // 使用固定基准高度，缩放通过 scale 实现
                    aspectRatio: `${ASPECT_RATIO}`,
                    flexShrink: 0, // 防止压缩
                    position: 'relative',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // originX: 0.5, // 默认中心缩放
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                    alt={image.label || `Document ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: 'transparent',
                      boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.5)' : 'none' // 激活时增加阴影
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* 底部导航区域 */}
        <div style={{
          height: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          flexShrink: 0
        }}>
          {/* 当前索引显示 */}
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-mono, monospace)',
            letterSpacing: '2px'
          }}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(itemCount).padStart(2, '0')}
          </div>
          
          {/* 底部指示器 */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            alignItems: 'center'
          }}>
            {images.map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  width: activeIndex === i ? '32px' : '8px',
                  background: activeIndex === i ? '#fff' : 'rgba(255,255,255,0.3)'
                }}
                transition={{ duration: 0.3 }}
                style={{ 
                  height: '8px', 
                  borderRadius: '4px' 
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentFocusLensScreen;