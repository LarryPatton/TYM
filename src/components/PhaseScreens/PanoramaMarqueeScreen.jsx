import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ThreeRowMarquee } from './ThreeRowMarquee';

/**
 * ============================================
 * 屏幕: 跑马灯展示 (PanoramaMarqueeScreen) (优化版：紧凑密集一屏)
 * ============================================
 * 优化目标：
 * 1. 跑马灯更密 (Denser Layout)
 * 2. 只有跑马灯，且在一屏内展示完 (Fits 3 rows tightly in 100vh)
 * 3. 使用统一的文案渲染样式（带高亮、逐字显示）
 * ============================================
 */
export const PanoramaMarqueeScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  contentKey,
  marqueeImages = [], 
  bgAlt = false
}) => {
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const bgColor = '#000'; // 统一纯黑背景
  
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
  
  // 文案逐字显示（组件挂载时触发）
  useEffect(() => {
    if (!hasCaption || hasTextTriggeredRef.current) return;
    
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
  
  return (
    <section 
      ref={containerRef}
      style={{ 
        height: '100vh', // 强制一屏
        width: '100%',
        position: 'relative',
        background: bgColor,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // 垂直居中
        overflow: 'hidden',
        padding: '0'
      }}
    >
      {/* 顶部文案 - 使用统一的 CAPTION 样式 */}
      {hasCaption && (
        <div style={{
          width: '100%',
          maxWidth: 'var(--caption-max-width, 1100px)',
          margin: '0 auto clamp(24px, 3vh, 40px)',
          padding: 'var(--caption-padding, 0 32px 40px)',
          boxSizing: 'border-box',
          textAlign: 'center',
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          zIndex: 10,
          flexShrink: 0
        }}>
          <p style={{
            margin: 0,
            color: 'var(--caption-color, #fff)',
            fontSize: 'var(--caption-font-size)',
            lineHeight: 'var(--caption-line-height, 1.7)',
            letterSpacing: 'var(--caption-letter-spacing, 0.04em)',
            fontWeight: 'var(--caption-font-weight, 300)'
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

      {/* 跑马灯区域 - 核心展示 */}
      {marqueeImages.length > 0 && (
        <div style={{
          width: '100%',
          flex: 1, // 占据剩余空间
          display: 'flex',
          alignItems: 'center',
          minHeight: 0 // 防止 flex 子项溢出
        }}>
          {/* 传递 isDense=true，需要在 ThreeRowMarquee 内部实现紧凑逻辑 */}
          <ThreeRowMarquee 
            images={marqueeImages} 
            bgColor="transparent" 
            isDense={true} 
          />
        </div>
      )}
    </section>
  );
};

export default PanoramaMarqueeScreen;