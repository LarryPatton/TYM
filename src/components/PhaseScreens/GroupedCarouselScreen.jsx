import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLenisScrollProgress } from '../../hooks/useLenisScroll';
import { useTranslation } from 'react-i18next';

// ========== 工具函数：线性插值（替代 framer-motion useTransform） ==========
function interpolate(value, inputRange, outputRange) {
  if (inputRange.length !== outputRange.length || inputRange.length < 2) {
    return outputRange[0];
  }
  // clamp to range
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];
  // find segment
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const t = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      const out0 = outputRange[i];
      const out1 = outputRange[i + 1];
      // 支持数字和带单位的字符串（如 '80%', 'blur(8px)'）
      if (typeof out0 === 'number' && typeof out1 === 'number') {
        return out0 + (out1 - out0) * t;
      }
      // 字符串：提取数字部分做插值
      const num0 = parseFloat(out0);
      const num1 = parseFloat(out1);
      if (!isNaN(num0) && !isNaN(num1)) {
        const interpolatedNum = num0 + (num1 - num0) * t;
        // 保留单位/格式（如 '80%' → '%', 'blur(8px)' → 'blur(Xpx)'）
        if (typeof out0 === 'string' && out0.includes('blur(')) {
          return `blur(${interpolatedNum.toFixed(1)}px)`;
        }
        if (typeof out0 === 'string' && out0.includes('%')) {
          return `${interpolatedNum.toFixed(2)}%`;
        }
        return interpolatedNum;
      }
      // fallback: 直接返回最近的值
      return t < 0.5 ? out0 : out1;
    }
  }
  return outputRange[outputRange.length - 1];
}

/**
 * GroupedCarouselScreen - 滚动驱动分组轮播展示（Lenis 驱动版）
 * 
 * 特点：
 * 1. 三组素材依次切换聚焦
 * 2. Lenis 平滑滚动驱动场景切换（左右横向）
 * 3. 每组有停顿时间（中间静止区域）
 * 4. 第三组强制横向 1×4 排列
 * 5. 当前组高亮，前后组淡出模糊
 * 
 * 移动端优化：
 * - 改为垂直堆叠展示所有分组
 * - 禁用横向切换动画
 * - 简化为普通滚动
 * 
 * @param {Array} groups - 分组数组 [{label, images: [{src, label}]}]
 * @param {string} bgColor - 背景颜色
 * @param {boolean} showGroupLabel - 是否显示分组标题（默认 true）
 * @param {boolean} showItemCount - 是否显示图片计数（默认 true）
 */
export const GroupedCarouselScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  contentKey,
  groups = [],
  bgColor = '#000',
  rowGap = '24px',
  showGroupLabel = true,
  showItemCount = true,
  showScreenLabel = false,
  aspectRatio = '1 / 1',
  imageScale = 1 // 图片缩放比例
}) => {
  const containerRef = useRef(null);
  const { t } = useTranslation();
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  // 文案显示状态
  const [textVisible, setTextVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTextTriggeredRef = useRef(false);
  const captionRef = useRef(null); // 单独引用文案区域，用于 IntersectionObserver
  
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
  
  // 文案逐字显示的 IntersectionObserver（观察文案区域本身，而非超高的外层容器）
  useEffect(() => {
    if (!caption || parsedContent.length === 0) return;
    
    const captionEl = captionRef.current;
    if (!captionEl) {
      // 如果文案 DOM 还没挂载，延迟 200ms 重试
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
          
          // 逐字显示
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
  }, [caption, parsedContent.length]);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Lenis 驱动的滚动进度（0~1 数值）
  const { progress } = useLenisScrollProgress(containerRef, ["start start", "end end"]);

  const totalGroups = groups.length;
  if (totalGroups === 0) return null;

  // 计算每个组的滚动区间（包含进入、停顿、离开三个阶段）
  const getGroupRange = (index) => {
    const segmentSize = 1 / totalGroups;
    const start = index * segmentSize;
    const end = (index + 1) * segmentSize;
    const enterEnd = start + segmentSize * 0.25;
    const holdEnd = start + segmentSize * 0.75;
    return { start, enterEnd, holdEnd, end };
  };

  // 移动端：简化为垂直堆叠布局
  if (isMobile) {
    return (
      <section
        ref={containerRef}
        style={{
          background: bgColor,
          padding: '60px 20px 80px',
          color: '#fff'
        }}
      >
        {screenNumber && (
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {groups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              viewport={{ once: true, margin: "-10%" }}
            >
              {showGroupLabel && (group.labelKey ? t(group.labelKey) : group.label) && (
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: '#fff',
                  marginBottom: '20px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  {group.labelKey ? t(group.labelKey) : group.label}
                </h3>
              )}
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {(group.images || []).map((img, imgIndex) => (
                  <div
                    key={`img-${groupIndex}-${imgIndex}`}
                    style={{
                      aspectRatio: '1 / 1',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                      alt={img.label || `Image ${imgIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-image, 12px)'
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // 是否有文案需要显示
  const hasCaption = !!caption && parsedContent.length > 0;

  // 桌面端：Lenis 驱动的滚动切换
  return (
    <div 
      ref={containerRef}
      style={{
        height: `${totalGroups * 200}vh`,
        position: 'relative',
        background: bgColor
      }}
    >
      {/* Sticky 容器 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        
        {showScreenLabel && screenNumber && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            zIndex: 10
          }}>
            {screenNumber} / {screenLabel}
          </div>
        )}

        {/* 三区域整体容器（文案+图片+指示器），整体垂直居中 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxHeight: '90vh',
          gap: 'clamp(8px, 1.5vh, 16px)'
        }}>
          {/* 顶部文案区 - 使用全局 CAPTION TOKENS，按逗号分两行 */}
          {hasCaption && (
            <div ref={captionRef} style={{
              width: '100%',
              maxWidth: 'var(--caption-max-width, 1100px)',
              padding: 'var(--caption-padding, 0 32px 40px)',
              boxSizing: 'border-box',
              textAlign: 'center',
              flexShrink: 0,
              zIndex: 15,
              opacity: textVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-out'
            }}>
              {(() => {
                // 按逗号分割：逗号前为第一行，逗号后为第二行
                const commaIndex = caption.indexOf('，');
                const lines = commaIndex > -1 
                  ? [caption.slice(0, commaIndex + 1), caption.slice(commaIndex + 1)]
                  : [caption];
                
                // 为每行生成 parsedContent
                let charOffset = 0;
                return lines.map((line, lineIdx) => {
                  const lineStart = charOffset;
                  charOffset += line.length;
                  
                  // 获取该行对应的 parsedContent
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
                });
              })()}
            </div>
          )}

          {/* 分组内容 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: hasCaption ? '65vh' : '70vh',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {groups.map((group, index) => (
              <GroupScene
                key={`group-${index}`}
                group={group}
                index={index}
                progress={progress}
                totalGroups={totalGroups}
                getGroupRange={getGroupRange}
                isLastGroup={index === totalGroups - 1}
                rowGap={rowGap}
                showGroupLabel={showGroupLabel}
                showItemCount={showItemCount}
                aspectRatio={aspectRatio}
                imageScale={imageScale}
              />
            ))}
          </div>
        </div>

        {/* 分组指示器（固定在底部） */}
        <GroupIndicator 
          groups={groups} 
          progress={progress} 
          totalGroups={totalGroups}
          getGroupRange={getGroupRange}
          showLabel={true}
        />
      </div>
    </div>
  );
};

/**
 * 分组指示器（Lenis 驱动）
 */
const GroupIndicator = ({ groups, progress, totalGroups, getGroupRange, showLabel = true }) => {
  const { t } = useTranslation();
  return (
    <div style={{
      position: 'absolute',
      bottom: '50px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '16px',
      zIndex: 20
    }}>
      {groups.map((group, index) => {
        const range = getGroupRange(index);
        
        return (
          <IndicatorDot
            key={`indicator-${index}`}
            index={index}
            label={group.labelKey ? t(group.labelKey) : group.label}
            progress={progress}
            range={range}
            showLabel={showLabel}
          />
        );
      })}
    </div>
  );
};

/**
 * 单个指示器点（Lenis 驱动）
 */
const IndicatorDot = ({ index, label, progress, range, showLabel = true }) => {
  const opacity = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.3, 1, 1, 0.3]
  );
  
  const scale = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.8, 1.2, 1.2, 0.8]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity,
        transform: `scale(${scale})`,
        transition: 'opacity 0.05s, transform 0.05s',
        willChange: 'opacity, transform'
      }}
    >
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#fff'
      }} />
      {showLabel && label && (
        <span style={{
          fontSize: '0.7rem',
          color: '#fff',
          whiteSpace: 'nowrap'
        }}>
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * 单组场景（Lenis 驱动版 - 横向切换 + 停顿）
 */
const GroupScene = ({ group, index, progress, totalGroups, getGroupRange, isLastGroup, rowGap = '24px', showGroupLabel = true, showItemCount = true, aspectRatio = '1 / 1', imageScale = 1 }) => {
  const { t } = useTranslation();
  const resolvedLabel = group.labelKey ? t(group.labelKey) : group.label;
  const range = getGroupRange(index);
  
  // 基于 Lenis progress 计算各属性值
  const opacity = interpolate(
    progress,
    [range.start - 0.05, range.start, range.enterEnd, range.holdEnd, range.end, range.end + 0.05],
    [0, 0.3, 1, 1, 0.3, 0]
  );
  
  const scale = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.9, 1, 1, 0.9]
  );
  
  const xPercent = interpolate(
    progress,
    [range.start - 0.05, range.start, range.enterEnd, range.holdEnd, range.end, range.end + 0.05],
    [80, 30, 0, 0, -30, -80]
  );

  const blurPx = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [8, 0, 0, 8]
  );

  const images = group.images || [];
  const imageCount = images.length;
  
  const customLayout = group.layout;
  
  const getGridLayout = () => {
    if (isLastGroup) {
      return { columns: imageCount, rows: 1 };
    }
    if (imageCount <= 3) {
      return { columns: imageCount, rows: 1 };
    } else if (imageCount <= 4) {
      return { columns: 2, rows: 2 };
    } else if (imageCount <= 6) {
      return { columns: 3, rows: 2 };
    } else {
      return { columns: 4, rows: 2 };
    }
  };
  
  const { columns } = getGridLayout();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `translateX(${xPercent}%) scale(${scale})`,
        filter: `blur(${blurPx.toFixed(1)}px)`,
        pointerEvents: 'none',
        willChange: 'opacity, transform, filter'
      }}
    >
      {/* 组标题 */}
      {showGroupLabel && resolvedLabel && (
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: '#fff',
          marginBottom: '32px',
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}>
          {resolvedLabel}
        </h3>
      )}
      
      {/* 图片网格 */}
      {customLayout ? (
        (() => {
          const rowCount = customLayout.rows.length;
          const customRowGap = customLayout.rowGap || '16px';
          const colGap = customLayout.colGap || '12px';
          const maxCols = Math.max(...customLayout.rows.map(r => r.count));
          const mainScale = customLayout.mainScale ?? 1.0;
          const subScale = customLayout.subScale ?? 1.0;
          const subOffsetX = customLayout.subOffset?.x || 0;
          const subOffsetY = customLayout.subOffset?.y || 0;
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: customRowGap,
              width: '100%',
              alignItems: 'center',
              padding: '0 24px',
              boxSizing: 'border-box'
            }}>
              {customLayout.rows.map((rowConfig, rowIndex) => {
                const rowImages = images.slice(
                  customLayout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0),
                  customLayout.rows.slice(0, rowIndex + 1).reduce((sum, r) => sum + r.count, 0)
                );
                // 使用 scale 控制每行的宽度：scale=1 为基线（92%/1400px），越大越宽
                const rowScale = rowConfig.scale || 1;
                const rowWidthPercent = Math.min(90 + rowScale * 2, 98);
                const rowMaxWidthPx = 1280 + rowScale * 120;
                return (
                  <div
                    key={`row-${rowIndex}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${rowConfig.count}, 1fr)`,
                      gap: colGap,
                      width: `${rowWidthPercent}%`,
                      maxWidth: `${rowMaxWidthPx}px`,
                      justifyItems: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {rowImages.map((img, imgIndex) => {
                      const globalIndex = customLayout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0) + imgIndex;
                      return (
                        <div
                          key={`img-${index}-${globalIndex}`}
                          style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            position: 'relative'
                          }}
                        >
                          {/* 衬底图（subSrc）— 通过 subScale 控制大小，translate 控制偏移 */}
                          {img.subSrc && (
                            <img
                              src={`${import.meta.env.BASE_URL}${img.subSrc.replace(/^\//, '')}`}
                              alt={`${img.label || 'Image'} - sub`}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: `${subScale * 100}%`,
                                height: `${subScale * 100}%`,
                                objectFit: 'contain',
                                display: 'block',
                                borderRadius: 'var(--radius-image, 12px)',
                                transform: `translate(calc(-50% + ${subOffsetX}px), calc(-50% + ${subOffsetY}px))`,
                                zIndex: 1
                              }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          {/* 主图 — 通过 mainScale 控制大小，居中在上层 */}
                          <img
                            src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                            alt={img.label || `Image ${globalIndex + 1}`}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: `${mainScale * 100}%`,
                              height: `${mainScale * 100}%`,
                              objectFit: 'contain',
                              display: 'block',
                              borderRadius: 'var(--radius-image, 12px)',
                              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 2
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })()
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isLastGroup ? '24px' : '16px',
          maxWidth: isLastGroup ? '90%' : `${imageScale * 1200}px`,
          width: `${imageScale * 90}%`,
          padding: '0 24px'
        }}>
          {images.map((img, imgIndex) => {
            // aspectRatio 为 'auto' 时，使用 img 原始比例；否则使用传入的比例
            const useAuto = aspectRatio === 'auto';
            
            return (
              <div
                key={`img-${index}-${imgIndex}`}
                style={{
                  aspectRatio: useAuto ? 'auto' : aspectRatio,
                  maxHeight: useAuto ? '60vh' : undefined,
                  overflow: 'hidden',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-image, 12px)'
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                  alt={img.label || `Image ${imgIndex + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: useAuto ? '60vh' : '100%',
                    width: useAuto ? 'auto' : '100%',
                    height: useAuto ? 'auto' : '100%',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 'var(--radius-image, 12px)',
                    filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* 图片计数 */}
      {showItemCount && (
        <div style={{
          marginTop: '24px',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '2px'
        }}>
          {imageCount} ITEMS
        </div>
      )}
    </div>
  );
};

export default GroupedCarouselScreen;