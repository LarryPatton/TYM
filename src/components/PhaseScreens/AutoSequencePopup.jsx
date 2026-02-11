import React, { useState, useEffect, useRef, useMemo } from 'react';

// 调试开关
const DEBUG = false;

/**
 * AutoSequencePopup - 自动顺序弹出组件
 * 使用纯 CSS 动画，避免 framer-motion 导致的重渲染问题
 */
const AutoSequencePopup = ({ 
  images = [], 
  images2 = [],
  interval = 300,
  duration = 0.6,
  bgColor = '#000',
  dualMode = false,
  caption = '',
  categoryLabel = '', // 分类标签
  structuredContent = null // 新增: 结构化内容（替代 caption）
}) => {
  // 使用数组存储可见索引，避免 Set 的引用问题
  const [visibleCount, setVisibleCount] = useState(0);
  const [visibleCount2, setVisibleCount2] = useState(0);
  const [textVisible, setTextVisible] = useState(false); // 控制整体容器显示
  const [revealedCharCount, setRevealedCharCount] = useState(0); // 新增: 逐字显示计数器
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);
  const animationTimersRef = useRef([]);
  const hasTriggeredRef = useRef(false);

  const imageKey = useMemo(() => images.map(img => img.src).join('|'), [images]);
  const imageKey2 = useMemo(() => images2.map(img => img.src).join('|'), [images2]);

  // 解析 Caption，识别高亮文本
  const parsedContent = useMemo(() => {
    if (!caption) return [];
    
    const parts = [];
    let currentIndex = 0;
    const regex = /([「""])([^」""]+)([」""])/g;
    let match;
    
    while ((match = regex.exec(caption)) !== null) {
      if (match.index > currentIndex) {
        const text = caption.slice(currentIndex, match.index);
        [...text].forEach(char => parts.push({ char, highlight: false }));
      }
      const fullMatch = match[0];
      [...fullMatch].forEach(char => parts.push({ char, highlight: true }));
      currentIndex = match.index + match[0].length;
    }
    
    if (currentIndex < caption.length) {
      const text = caption.slice(currentIndex);
      [...text].forEach(char => parts.push({ char, highlight: false }));
    }
    
    return parts;
  }, [caption]);

  // 解析结构化内容为扁平字符数组（用于逐字打字效果）
  // 每个字符携带结构信息：{ char, role, blockIdx, itemIdx, highlight }
  const parsedStructured = useMemo(() => {
    if (!structuredContent || !Array.isArray(structuredContent)) return [];

    const chars = [];
    const highlightRegex = /([「""])([^」""]+)([」""])/g;

    const pushText = (text, role, blockIdx, itemIdx = -1) => {
      // 对文本做高亮解析
      let cursor = 0;
      let m;
      highlightRegex.lastIndex = 0;
      while ((m = highlightRegex.exec(text)) !== null) {
        if (m.index > cursor) {
          [...text.slice(cursor, m.index)].forEach(c =>
            chars.push({ char: c, role, blockIdx, itemIdx, highlight: false })
          );
        }
        [...m[0]].forEach(c =>
          chars.push({ char: c, role, blockIdx, itemIdx, highlight: true })
        );
        cursor = m.index + m[0].length;
      }
      if (cursor < text.length) {
        [...text.slice(cursor)].forEach(c =>
          chars.push({ char: c, role, blockIdx, itemIdx, highlight: false })
        );
      }
    };

    structuredContent.forEach((block, bIdx) => {
      if (block.type === 'intro') {
        pushText(block.text, 'intro', bIdx);
        // 段落末尾加换行标记
        chars.push({ char: '\n', role: 'break', blockIdx: bIdx, itemIdx: -1, highlight: false });
      } else if (block.type === 'section') {
        pushText(block.title, 'sectionTitle', bIdx);
        chars.push({ char: '\n', role: 'break', blockIdx: bIdx, itemIdx: -1, highlight: false });
        if (block.items) {
          block.items.forEach((item, iIdx) => {
            pushText(item, 'item', bIdx, iIdx);
            chars.push({ char: '\n', role: 'break', blockIdx: bIdx, itemIdx: iIdx, highlight: false });
          });
        }
      }
    });

    return chars;
  }, [structuredContent]);

  // 结构化逐字计数器（独立于 caption 的 revealedCharCount）
  const [revealedStructuredCount, setRevealedStructuredCount] = useState(0);

  // 重置状态
  useEffect(() => {
    if (DEBUG) console.log('🔄 重置状态');
    
    animationTimersRef.current.forEach(timer => clearTimeout(timer));
    animationTimersRef.current = [];
    hasTriggeredRef.current = false;
    setVisibleCount(0);
    setVisibleCount2(0);
    setTextVisible(false); // 重置文字显示
    setRevealedCharCount(0); // 重置字数
    setRevealedStructuredCount(0); // 重置结构化字数
    setIsMounted(false);
    
    const mountTimer = setTimeout(() => setIsMounted(true), 100);
    
    return () => {
      clearTimeout(mountTimer);
      animationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [imageKey, imageKey2, caption]);

  const useDualMode = dualMode && images2.length > 0;

  // IntersectionObserver - 一次性触发所有定时器（图片 + 文字）
  useEffect(() => {
    if (!isMounted) return;
    
    const currentContainer = containerRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          if (DEBUG) console.log('🚀 开始顺序显示');
          
          // 立即触发文字区域显示
          setTextVisible(true);

          // 图片定时器
          images.forEach((_, index) => {
            const timer = setTimeout(() => {
              setVisibleCount(index + 1);
            }, index * interval);
            animationTimersRef.current.push(timer);
          });
          
          // 双区域模式图片定时器
          if (useDualMode) {
            images2.forEach((_, index) => {
              const timer = setTimeout(() => {
                setVisibleCount2(index + 1);
              }, index * interval);
              animationTimersRef.current.push(timer);
            });
          }

          // 文字逐字出现定时器 (JS 驱动，确保严格顺序)
          const totalChars = parsedContent.length;
          if (totalChars > 0) {
            const charInterval = 30; // 30ms 间隔，显著加快
            
            parsedContent.forEach((_, index) => {
              const timer = setTimeout(() => {
                setRevealedCharCount(prev => Math.max(prev, index + 1));
              }, index * charInterval);
              animationTimersRef.current.push(timer);
            });
          }

          // 结构化内容逐字定时器（间隔更短，避免等太久）
          const totalStructuredChars = parsedStructured.length;
          if (totalStructuredChars > 0) {
            const structuredCharInterval = 15; // 15ms，内容多所以更快
            
            parsedStructured.forEach((_, index) => {
              const timer = setTimeout(() => {
                setRevealedStructuredCount(prev => Math.max(prev, index + 1));
              }, index * structuredCharInterval);
              animationTimersRef.current.push(timer);
            });
          }
        }
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    if (currentContainer) observer.observe(currentContainer);
    return () => { if (currentContainer) observer.unobserve(currentContainer); };
  }, [images.length, images2.length, interval, isMounted, useDualMode, parsedContent.length]);

  const FIXED_SCROLL_HEIGHT = 200;

  // CSS 动画样式
  const getImageStyle = (index, isVisible, isMobile) => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: index + 1,
    padding: isMobile ? '4px' : 0,
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`
  });

  const imgStyle = (isMobile) => ({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    filter: isMobile 
      ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' 
      : 'drop-shadow(0 20px 60px rgba(0,0,0,0.3))',
    borderRadius: isMobile ? '6px' : 0
  });

  // 双区域模式（移动端）
  if (useDualMode) {
    return (
      <div 
        ref={containerRef} 
        style={{
          height: `${FIXED_SCROLL_HEIGHT}vh`,
          position: 'relative',
          background: bgColor
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          padding: '8px 8px 64px 8px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '48%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {images.map((image, index) => (
              <div 
                key={image.src} 
                style={getImageStyle(index, index < visibleCount, true)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                  alt={image.label || `Image ${index + 1}`}
                  style={imgStyle(true)}
                />
              </div>
            ))}
          </div>
          
          <div style={{ width: '60%', height: '1px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          
          <div style={{
            position: 'relative',
            width: '100%',
            height: '48%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {images2.map((image, index) => (
              <div 
                key={image.src} 
                style={getImageStyle(index, index < visibleCount2, true)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                  alt={image.label || `Image ${index + 1}`}
                  style={imgStyle(true)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 是否有文字需要显示
  const hasCaption = !!caption;
  const hasStructured = structuredContent && Array.isArray(structuredContent) && structuredContent.length > 0;
  const hasTextArea = hasCaption || hasStructured;

  // 逐字出现的动画效果 - 显著调慢
  const staggerDelay = 0.08; // 从 0.02s 调整为 0.08s，放慢4倍

  // 渲染结构化内容（逐字打字效果）
  // 把 parsedStructured 按 blockIdx + role 重新分组，然后逐字渲染
  const renderStructuredContent = () => {
    if (!hasStructured || parsedStructured.length === 0) return null;

    // 按结构重新分组字符，用于渲染
    // 构建: { blockIdx -> { role -> { itemIdx -> chars[] } } }
    const groups = [];
    let currentGroup = null;

    parsedStructured.forEach((ch, globalIdx) => {
      if (ch.role === 'break') return; // 跳过换行标记

      const key = `${ch.blockIdx}-${ch.role}-${ch.itemIdx}`;
      if (!currentGroup || currentGroup.key !== key) {
        currentGroup = { key, role: ch.role, blockIdx: ch.blockIdx, itemIdx: ch.itemIdx, chars: [] };
        groups.push(currentGroup);
      }
      currentGroup.chars.push({ ...ch, globalIdx });
    });

    // 渲染单个字符 span
    const renderChar = (ch, i) => {
      const isRevealed = ch.globalIdx < revealedStructuredCount;
      const isHighlight = ch.highlight;
      return (
        <span
          key={i}
          style={{
            display: 'inline',
            color: isHighlight ? '#FF5722' : 'inherit',
            fontWeight: isHighlight ? 600 : 'inherit',
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 0.25s ease-out',
            whiteSpace: 'pre-wrap'
          }}
        >
          {ch.char}
        </span>
      );
    };

    // 按组渲染
    const elements = [];
    let lastBlockIdx = -1;

    groups.forEach((group, gIdx) => {
      // 检查该组是否有任何字符已经 revealed（用于整体容器显隐）
      const firstCharIdx = group.chars[0]?.globalIdx ?? Infinity;
      const groupStarted = firstCharIdx < revealedStructuredCount;

      if (group.role === 'intro') {
        elements.push(
          <p key={`g-${gIdx}`} style={{
            margin: '0 0 1.2rem 0',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 'clamp(0.85rem, 1.6vh, 1.05rem)',
            lineHeight: 1.6,
            textAlign: 'left',
            opacity: groupStarted ? 1 : 0,
            transform: groupStarted ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
          }}>
            {group.chars.map(renderChar)}
          </p>
        );
        lastBlockIdx = group.blockIdx;
      } else if (group.role === 'sectionTitle') {
        // 如果是新的 section block，加间距
        if (group.blockIdx !== lastBlockIdx) {
          lastBlockIdx = group.blockIdx;
        }
        elements.push(
          <h4 key={`g-${gIdx}`} style={{
            margin: group.blockIdx > 1 ? '1.2rem 0 0.5rem 0' : '0 0 0.5rem 0',
            fontSize: 'clamp(0.9rem, 1.8vh, 1.1rem)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '0.02em',
            lineHeight: 1.4,
            borderLeft: '2px solid rgba(255, 87, 34, 0.8)',
            paddingLeft: '10px',
            opacity: groupStarted ? 1 : 0,
            transform: groupStarted ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
          }}>
            {group.chars.map(renderChar)}
          </h4>
        );
      } else if (group.role === 'item') {
        elements.push(
          <div key={`g-${gIdx}`} style={{
            position: 'relative',
            padding: '3px 0 3px 22px',
            fontSize: 'clamp(0.75rem, 1.4vh, 0.9rem)',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.55,
            opacity: groupStarted ? 1 : 0,
            transform: groupStarted ? 'translateX(0)' : 'translateX(-6px)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
          }}>
            <span style={{
              position: 'absolute',
              left: '10px',
              top: '5px',
              color: 'rgba(255, 87, 34, 0.5)',
              fontSize: '0.45rem'
            }}>●</span>
            {group.chars.map(renderChar)}
          </div>
        );
      }
    });

    return <div style={{ width: '100%' }}>{elements}</div>;
  };

  // 单区域模式（桌面端）
  return (
    <div 
      ref={containerRef} 
      style={{
        height: `${FIXED_SCROLL_HEIGHT}vh`,
        position: 'relative',
        background: bgColor
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center', // 垂直居中
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* 左侧文字区 */}
        {hasTextArea && (
          <div style={{
            width: hasStructured ? '26%' : '22%', // 结构化内容需要更多宽度
            height: 'auto',
            minHeight: '40vh',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center', // 内容垂直居中
            padding: hasStructured ? '0 28px 0 40px' : '0 24px 0 48px',
            boxSizing: 'border-box',
            flexShrink: 0,
            overflow: hasStructured ? 'auto' : 'visible',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)', // 装饰线
            marginLeft: '4%', // 左侧留白
            opacity: textVisible ? 1 : 0, // 容器整体显隐
            transition: 'opacity 0.2s ease-out', // 容错
            zIndex: 10
          }}>
            {/* 分类标签 */}
            {categoryLabel && (
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '1.2rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 500,
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}>
                {categoryLabel}
              </div>
            )}
            
            {/* 结构化内容 或 逐字 caption */}
            {hasStructured ? renderStructuredContent() : (
              <p style={{
                margin: 0,
                color: '#fff', // 默认白色
                fontSize: 'clamp(1.2rem, 2.4vh, 2rem)', // 略微调小一点以适应更窄宽度
                lineHeight: 1.35, // 略微增加行高提升阅读舒适度
                letterSpacing: '-0.01em',
                textAlign: 'left', // 左对齐
                width: '100%',
                fontWeight: 400 // 保持轻盈
              }}>
                {parsedContent.map((item, i) => {
                  const isRevealed = i < revealedCharCount;
                  return (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        color: item.highlight ? '#FF5722' : 'inherit', // 高亮颜色：深橙色
                        fontWeight: item.highlight ? 600 : 400, // 高亮时加粗
                        opacity: isRevealed ? 1 : 0,
                        // 优化动画：起始位置更低，模糊度更高，营造"慢慢浮出来"的感觉
                        transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
                        filter: isRevealed ? 'blur(0)' : 'blur(6px)',
                        // 这里的 transition 只负责单字的"进入动画"，不再负责延迟 sequence
                        transition: `
                          opacity 0.6s ease-out, 
                          transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), 
                          filter 0.6s ease-out,
                          color 0.3s ease
                        `,
                        whiteSpace: 'pre-wrap' // 保留空格
                      }}
                    >
                      {item.char}
                    </span>
                  );
                })}
              </p>
            )}
          </div>
        )}

        {/* 右侧（或居中）图片区 */}
        <div style={{
          position: 'relative',
          width: hasTextArea ? (hasStructured ? '70%' : '74%') : '90vw',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {images.map((image, index) => (
            <div 
              key={image.src} 
              style={getImageStyle(index, index < visibleCount, false)}
            >
              <img
                src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                alt={image.label || `Image ${index + 1}`}
                style={imgStyle(false)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoSequencePopup;