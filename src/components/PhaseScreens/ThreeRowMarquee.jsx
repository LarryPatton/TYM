import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * ThreeRowMarquee - 三行交错跑马灯组件
 * 
 * 特性：
 * - 3-4-3 分布 (10张图: 第1行3张, 第2行4张, 第3行3张)
 * - 方向交错: 第1/3行向左 ←, 第2行向右 →
 * - 速度交错: 第1行 60s(慢), 第2行 45s(中), 第3行 30s(快)
 * - 透明底 PNG 支持
 * - 顶部文案支持（逐字显示 + 高亮）
 * 
 * 移动端优化：
 * - 两行模式（隐藏第三行）
 * - 减慢动画速度
 * - 缩小图片高度
 * 
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 * @param {string} content - 文案内容
 */
export const ThreeRowMarquee = ({
  images = [], 
  bgColor = '#000',
  isDense = false, // 新增 prop 控制密度
  showGradient = true, // 新增 prop 控制渐变遮罩
  // 文案支持
  content = '',
  contentKey = '',
  // 可配置参数
  rowGap = null, // 三行之间的间距，如 '20px' 或 '2vh'
  rowHeights = null, // 每行高度数组，如 [220, 200, 220]
  rowDurations = null, // 每行动画速度数组（秒），如 [50, 38, 28]
  containerPadding = null // 整体容器的内边距，如 '40px 0'
}) => {
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  // 文案逐字显示状态
  const [textVisible, setTextVisible] = useState(false);
  const [revealedCharCount, setRevealedCharCount] = useState(0);
  const textTimersRef = useRef([]);
  const hasTextTriggeredRef = useRef(false);
  const captionRef = useRef(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 解析文案，识别高亮文本（「」内的内容 + 特定类型名词）
  const parsedContent = useMemo(() => {
    if (!content) return [];
    
    // 需要高亮的类型名词列表
    const highlightKeywords = ['KV', 'CMF', 'SKU', 'VI', 'UI', 'UX'];
    
    const parts = [];
    let currentIndex = 0;
    
    // 合并正则：匹配「...」或 "..." 或 "..." 或 特定关键词
    const keywordsPattern = highlightKeywords.map(kw => `\\b${kw}\\b`).join('|');
    const regex = new RegExp(`([「""])([^」""]+)([」""])|(${keywordsPattern})`, 'g');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // 添加普通文本
      if (match.index > currentIndex) {
        const text = content.slice(currentIndex, match.index);
        [...text].forEach(char => parts.push({ char, highlight: false }));
      }
      
      // 添加高亮文本
      const fullMatch = match[0];
      [...fullMatch].forEach(char => parts.push({ char, highlight: true }));
      
      currentIndex = match.index + match[0].length;
    }
    
    // 添加剩余文本
    if (currentIndex < content.length) {
      const text = content.slice(currentIndex);
      [...text].forEach(char => parts.push({ char, highlight: false }));
    }
    
    return parts;
  }, [content]);
  
  // 文案逐字显示的 IntersectionObserver
  useEffect(() => {
    if (!content || parsedContent.length === 0) return;
    
    const captionEl = captionRef.current;
    if (!captionEl) {
      // 如果文案 DOM 还没挂载，延迟重试
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
  }, [content, parsedContent.length]);
  
  // 动态计算每行图片数量，确保适应任意数量的图片 (如 10张, 14张等)
  const total = images.length;
  
  // 移动端：两行模式（图片平分到两行）
  // 桌面端：三行模式
  const part1 = isMobile ? Math.floor(total / 2) : Math.floor(total / 3);
  const part2 = isMobile ? total : Math.floor(total * 2 / 3);

  const row1Images = images.slice(0, part1);
  const row2Images = images.slice(part1, part2);
  const row3Images = isMobile ? [] : images.slice(part2, total); // 移动端隐藏第三行
  
  // 根据 isDense 和移动端调整参数
  // Dense 模式下：高度减小，间隙减小
  // 移动端：高度进一步减小
  const defaultHeight1 = 220, defaultHeight2 = 200, defaultHeight3 = 220;
  const denseHeight1 = 160, denseHeight2 = 140, denseHeight3 = 160;
  const mobileHeight = 120; // 移动端统一高度
  
  const defaultGap = 40;
  const denseGap = 20;
  const mobileGap = 16; // 移动端间距

  // 使用自定义 rowHeights 或默认值
  const customHeights = rowHeights && rowHeights.length >= 3 ? rowHeights : null;
  const h1 = isMobile ? mobileHeight : (customHeights ? customHeights[0] : (isDense ? denseHeight1 : defaultHeight1));
  const h2 = isMobile ? mobileHeight : (customHeights ? customHeights[1] : (isDense ? denseHeight2 : defaultHeight2));
  const h3 = isMobile ? mobileHeight : (customHeights ? customHeights[2] : (isDense ? denseHeight3 : defaultHeight3));
  const g = isMobile ? mobileGap : (isDense ? denseGap : defaultGap);
  
  // 移动端动画速度减慢 1.5 倍
  const mobileSpeedMultiplier = isMobile ? 1.5 : 1;
  
  // 使用自定义 rowDurations 或默认值
  const defaultDurations = [50, 38, 28];
  const customDurations = rowDurations && rowDurations.length >= 3 ? rowDurations : defaultDurations;
  const d1 = customDurations[0] * mobileSpeedMultiplier;
  const d2 = customDurations[1] * mobileSpeedMultiplier;
  const d3 = customDurations[2] * mobileSpeedMultiplier;

  // 配置 - 优化后的参数
  const rowConfigs = [
    { images: row1Images, direction: 'left', duration: d1, gap: g, height: h1 },   // 慢
    { images: row2Images, direction: 'right', duration: d2, gap: Math.round(g * 0.8), height: h2 },  // 中
    // 第三行仅在桌面端显示
    ...(isMobile ? [] : [{ images: row3Images, direction: 'left', duration: d3, gap: g, height: h3 }])
  ];

  // 显示文案（优先使用 content，如果为空则不显示）
  const hasContent = content && content.trim().length > 0;
  
  // 计算容器间距和内边距
  const computedRowGap = rowGap || (isDense ? '1.5vh' : '20px');
  const computedPadding = containerPadding || (isDense ? '0' : '40px 0');
  const computedPaddingBottom = !containerPadding && isDense ? '5vh' : undefined;

  return (
    <div style={{
      width: '100%',
      // minHeight: '80vh', // 移除高度限制，由外层容器控制
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: computedRowGap,
      padding: computedPadding,
      overflow: 'hidden',
      paddingBottom: computedPaddingBottom
    }}>
      {/* 顶部文案区域 - 使用全局 CAPTION TOKENS */}
      {hasContent && (
        <div 
          ref={captionRef}
          style={{
            width: '100%',
            maxWidth: 'var(--caption-max-width, 1100px)',
            padding: isMobile ? 'var(--caption-padding-mobile, 0 16px 24px)' : 'var(--caption-padding, 0 32px 40px)',
            boxSizing: 'border-box',
            textAlign: 'center',
            margin: '0 auto',
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
          }}
        >
          <p style={{
            margin: 0,
            color: 'var(--caption-color, #fff)',
            fontSize: isMobile ? 'var(--caption-font-size-mobile)' : 'var(--caption-font-size)',
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
      
      {rowConfigs.map((config, rowIndex) => (
        <MarqueeRow
          key={rowIndex}
          images={config.images}
          direction={config.direction}
          duration={config.duration}
          gap={config.gap}
          height={config.height}
          bgColor={bgColor}
          showGradient={showGradient} // Pass it down
        />
      ))}
    </div>
  );
};

/**
 * MarqueeRow - 单行跑马灯
 */
const MarqueeRow = ({ 
  images, 
  direction = 'left', 
  duration = 40,
  gap = 40,
  height = 200,
  bgColor = '#0a0a0a',
  showGradient = true
}) => {
  // 复制图片以实现无缝循环 (4份确保足够宽)
  const duplicatedImages = [...images, ...images, ...images, ...images];
  
  // 计算单组图片的总宽度（用于动画）
  const itemWidth = height * 1.8; // 根据高度估算宽度（大部分图是横向的）
  const totalWidth = images.length * (itemWidth + gap);
  
  // 动画方向
  const isLeftDirection = direction === 'left';
  
  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 左侧渐隐遮罩 */}
      {showGradient && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: `linear-gradient(to right, ${bgColor}, transparent)`,
          zIndex: 10,
          pointerEvents: 'none'
        }} />
      )}
      
      {/* 右侧渐隐遮罩 */}
      {showGradient && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: `linear-gradient(to left, ${bgColor}, transparent)`,
          zIndex: 10,
          pointerEvents: 'none'
        }} />
      )}
      
      {/* 跑马灯轨道 */}
      <motion.div
        animate={{
          x: isLeftDirection 
            ? [0, -totalWidth] 
            : [-totalWidth, 0]
        }}
        transition={{
          x: {
            duration: duration,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop'
          }
        }}
        style={{
          display: 'flex',
          gap: `${gap}px`,
          width: 'max-content',
          alignItems: 'center'
        }}
      >
        {duplicatedImages.map((image, index) => (
          <MarqueeItem
            key={`${image.src}-${index}`}
            image={image}
            height={height}
          />
        ))}
      </motion.div>
    </div>
  );
};

/**
 * MarqueeItem - 跑马灯单项
 */
const MarqueeItem = ({ image, height = 200 }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        flexShrink: 0,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || 'Marquee item'}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          background: 'transparent',
          borderRadius: '8px',
          transition: 'filter 0.3s ease'
        }}
        loading="lazy"
      />
    </motion.div>
  );
};

export default ThreeRowMarquee;