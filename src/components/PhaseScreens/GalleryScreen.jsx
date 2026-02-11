import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SECTION_PADDING, 
  MAX_WIDTH_WIDE, 
  ImagePlaceholder 
} from './Common';

// ============================================
// 屏幕: 画廊展示 (GalleryScreen)
// 布局: 多图网格展示，支持自定义列数
// 用途: 展示应用场景、物料、效果图等
// ============================================
export const GalleryScreen = ({ 
  id,                                   // 屏幕唯一标识
  phaseId,                              // 所属阶段 ID
  screenNumber,                         // 屏幕编号 (如 "04")
  screenLabel,                          // 屏幕标签 (如 "Validation")
  title,                                // 标题
  content,                              // 描述内容
  contentKey,                           // i18n 翻译 key（优先级高于 content）
  images = [],                          // 图片数组 [{ src, hint, label }]
  columns = 2,                          // 网格列数 (默认2列)
  bgAlt = false                         // 是否使用交替背景色
}) => {
  const { t } = useTranslation();
  const captionRef = useRef(null);
  
  // 文案显示状态（打字机动画）
  const [textVisible, setTextVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTextTriggeredRef = useRef(false);
  
  // 获取文案内容（优先使用 contentKey，其次使用 content）
  const caption = contentKey ? t(contentKey) : (content || '');
  
  // 解析文案，识别高亮文本（「」内的内容 + 特定类型名词）
  const parsedContent = useMemo(() => {
    if (!caption) return [];
    
    const highlightKeywords = ['KV', 'CMF', 'SKU', 'VI', 'UI', 'UX'];
    const parts = [];
    let currentIndex = 0;
    
    const keywordsPattern = highlightKeywords.map(kw => `\\b${kw}\\b`).join('|');
    const regex = new RegExp(`([「""])([^」""]+)([」""])|(${keywordsPattern})`, 'g');
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
  
  // 文案逐字显示的 IntersectionObserver
  useEffect(() => {
    if (!caption || parsedContent.length === 0 || title) return; // 有标题时不走打字机
    
    const captionEl = captionRef.current;
    if (!captionEl) {
      const retryTimer = setTimeout(() => {
        const el = captionRef.current;
        if (el && !hasTextTriggeredRef.current) {
          hasTextTriggeredRef.current = true;
          setTextVisible(true);
          const charInterval = 30;
          parsedContent.forEach((_, index) => {
            const timer = setTimeout(() => {
              setRevealedCharCount(prev => Math.max(prev, index + 1));
            }, index * charInterval);
            textTimersRef.current.push(timer);
          });
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTextTriggeredRef.current) {
          hasTextTriggeredRef.current = true;
          setTextVisible(true);
          
          const charInterval = 30;
          parsedContent.forEach((_, index) => {
            const timer = setTimeout(() => {
              setRevealedCharCount(prev => Math.max(prev, index + 1));
            }, index * charInterval);
            textTimersRef.current.push(timer);
          });
        }
      },
      { threshold: 0 }
    );
    
    observer.observe(captionEl);
    
    return () => {
      observer.unobserve(captionEl);
      textTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [caption, parsedContent.length, title]);

  // caption 渲染（无标题时使用，与 GroupedCarouselScreen 完全一致）
  const hasCaption = !title && !!caption && parsedContent.length > 0;

  const renderCaption = () => {
    if (!hasCaption) return null;
    
    // 按逗号分割：逗号前为第一行，逗号后为第二行
    const commaIndex = caption.indexOf('，');
    const lines = commaIndex > -1 
      ? [caption.slice(0, commaIndex + 1), caption.slice(commaIndex + 1)]
      : [caption];
    
    let charOffset = 0;
    return (
      <div ref={captionRef} style={{
        width: '100%',
        maxWidth: 'var(--caption-max-width, 1100px)',
        padding: 'var(--caption-padding, 0 32px 40px)',
        boxSizing: 'border-box',
        textAlign: 'center',
        margin: '0 auto var(--space-3xl) auto',
        opacity: textVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}>
        {lines.map((line, lineIdx) => {
          const lineStart = charOffset;
          charOffset += line.length;
          const lineContent = parsedContent.slice(lineStart, charOffset);
          
          return (
            <p key={lineIdx} style={{
              margin: lineIdx === 0 ? '0 0 8px 0' : 0,
              color: 'var(--caption-color, #fff)',
              fontSize: 'var(--caption-font-size)',
              lineHeight: 'var(--caption-line-height, 1.7)',
              letterSpacing: 'var(--caption-letter-spacing, 0.04em)',
              fontWeight: 'var(--caption-font-weight, 300)'
            }}>
              {lineContent.map((item, i) => {
                const globalIndex = lineStart + i;
                const isRevealed = globalIndex < revealedCharCount;
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
          );
        })}
      </div>
    );
  };

  // ============================================
  // 【Phase 01 专属渲染 - 包装与物料验证】
  // ============================================
  const renderValidationImages = () => (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xl)',
      height: '100%'
    }}>
      {/* 顶部优先展示 - image 167 和 image 14 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--space-xl)'
      }}>
        <div
          style={{ 
            aspectRatio: '16/9',
            overflow: 'hidden', 
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/phase-01/validation-preview-01.png`}
            alt="Validation Preview 1"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        <div
          style={{ 
            aspectRatio: '16/9',
            overflow: 'hidden', 
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/phase-01/validation-preview-02.png`}
            alt="Validation Preview 2"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      </div>

      {/* 原有三个素材 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--space-xl)'
      }}>
        {/* 包装验证 - 左侧大图 */}
        <div
          style={{ 
            aspectRatio: '3/4',
            overflow: 'hidden', 
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/phase-01/validation-packaging.png`}
            alt="Packaging Validation"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => e.target.style.display = 'none'}
          />
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            padding: 'var(--space-md)',
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            fontWeight: '500'
          }}>
            包装验证
          </div>
        </div>

        {/* 物料验证 - 右侧两张小图 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div
            style={{ 
              flex: 1,
              overflow: 'hidden', 
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/phase-01/validation-material-01.png`}
              alt="Material Validation 1"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
          <div
            style={{ 
              flex: 1,
              overflow: 'hidden', 
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <img 
              src={`${import.meta.env.BASE_URL}images/phase-01/validation-material-02.png`}
              alt="Material Validation 2"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 默认画廊渲染
  const renderDefaultGallery = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 'var(--space-xl)'
    }} className="gallery-grid">
      {images.map((img, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)'
          }}
        >
          <div style={{
            aspectRatio: '4/3',
            overflow: 'hidden',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            background: 'transparent'
          }}>
            {img.src ? (
              <img 
                src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                alt={img.label || img.hint || `Gallery image ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                      e.target.style.display = 'none';
                }}
              />
            ) : (
              <ImagePlaceholder hint={img.hint} aspectRatio="100%" style={{ height: '100%' }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderGalleryContent = () => {
    if (phaseId === 'phase-01' && id === 'validation') return renderValidationImages();
    return renderDefaultGallery();
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SECTION_PADDING,
      // 强制深色模式 - 使用 phase 统一背景色
      background: bgAlt ? '#111111' : 'var(--phase-bg-color, #0a0a0a)',
      color: '#fff'
    }}>
      <div
        style={{ maxWidth: MAX_WIDTH_WIDE, width: '100%' }}
      >
        {/* 头部文本 */}
        {title ? (
          /* 有标题 — 保持原有标题+描述布局 */
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)', maxWidth: '800px', margin: '0 auto var(--space-3xl) auto' }}>
            <div>
              {(screenNumber || screenLabel) && (
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: 'var(--space-lg)'
                }}>
                  {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
                </div>
              )}
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-h2)',
                fontWeight: '400',
                marginBottom: 'var(--space-lg)',
                lineHeight: 'var(--line-height-snug)',
                color: '#fff'
              }}>
                {title}
              </h2>
              {content && (
                <p style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 'var(--text-body-lg)',
                  lineHeight: 'var(--line-height-relaxed)'
                }}>
                  {content}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* 无标题 — caption 模式：打字机动画 + 高亮 + --caption-* token */
          renderCaption()
        )}

        {/* 画廊区域 */}
        {renderGalleryContent()}
      </div>
    </section>
  );
};