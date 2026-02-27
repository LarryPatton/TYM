import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';

/**
 * GallerySkeleton
 * 与 GalleryModule 网格布局完全一致的骨架屏占位组件
 * 支持 shimmer 扫光动画，深浅色主题自适应
 */
const GallerySkeleton = ({ aspectType = 'portrait', count = 12 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

  const aspectRatio = aspectType === 'landscape' ? '4/3' : '3/4';

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile
      ? (aspectType === 'landscape' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)')
      : (aspectType === 'landscape'
          ? 'repeat(3, 1fr)'
          : 'repeat(auto-fill, minmax(300px, 1fr))'),
    gap: isMobile
      ? (aspectType === 'landscape' ? '8px' : '6px')
      : (aspectType === 'landscape' ? 'clamp(16px, 2vw, 24px)' : 'clamp(30px, 4vw, 60px)'),
  };

  // shimmer 颜色
  const baseColor = isDark ? '#1a1a1a' : '#ebebeb';
  const highlightColor = isDark ? '#2a2a2a' : '#f5f5f5';
  const titleColor = isDark ? '#1a1a1a' : '#ebebeb';
  const titleHighlight = isDark ? '#252525' : '#f0f0f0';

  const keyframesId = 'gallery-skeleton-shimmer';

  return (
    <>
      {/* 注入 @keyframes，只注入一次 */}
      <style>{`
        @keyframes ${keyframesId} {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .gallery-skeleton-img {
          background: linear-gradient(
            90deg,
            ${baseColor} 25%,
            ${highlightColor} 50%,
            ${baseColor} 75%
          );
          background-size: 800px 100%;
          animation: ${keyframesId} 1.4s ease-in-out infinite;
          border-radius: ${isMobile ? '4px' : '8px'};
        }
        .gallery-skeleton-title {
          background: linear-gradient(
            90deg,
            ${titleColor} 25%,
            ${titleHighlight} 50%,
            ${titleColor} 75%
          );
          background-size: 800px 100%;
          animation: ${keyframesId} 1.4s ease-in-out infinite;
          animation-delay: 0.1s;
          border-radius: 4px;
        }
      `}</style>

      <div style={gridStyle}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.04}s` }}>
            {/* 图片占位 */}
            <div
              className="gallery-skeleton-img"
              style={{
                width: '100%',
                aspectRatio,
                marginBottom: isMobile ? '4px' : '12px',
                // 错开每张卡片的扫光起点，营造波浪感
                animationDelay: `${i * 0.07}s`,
              }}
            />
            {/* 标题占位 */}
            <div
              className="gallery-skeleton-title"
              style={{
                height: isMobile ? '10px' : '14px',
                width: `${55 + (i % 5) * 9}%`, // 长度略有错落感
                animationDelay: `${i * 0.07 + 0.1}s`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default GallerySkeleton;
