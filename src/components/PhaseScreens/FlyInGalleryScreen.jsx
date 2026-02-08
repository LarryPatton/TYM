import React from 'react';
import { SECTION_PADDING } from './Common';

// ============================================
// 屏幕: 交错瀑布流画廊 (FlyInGalleryScreen)
// 布局: 3+4 两行错落布局，增加视觉层次感
// 无入场动画 — 避免与 LoadingScreen exit 产生闪烁
// ============================================
export const FlyInGalleryScreen = ({ 
  id,
  phaseId,
  screenNumber,
  screenLabel,
  title,
  content,
  images = [],
  imageHeight = '50vh',
  gap = 'var(--space-lg)',
  bgAlt = false
}) => {
  
  // 将图片分为两行: 第一行3张，第二行4张
  const firstRowCount = Math.min(3, images.length);
  const firstRow = images.slice(0, firstRowCount);
  const secondRow = images.slice(firstRowCount);

  // 计算单行图片的高度（第二行稍小，增加层次）
  const firstRowHeight = imageHeight;
  const secondRowHeight = `calc(${imageHeight} * 0.85)`;

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SECTION_PADDING,
      background: bgAlt ? 'transparent' : 'var(--phase-bg-color, #0a0a0a)',
      color: '#fff',
      overflow: 'hidden'
    }}>
      <div
        style={{ 
          maxWidth: '100%',
          width: '100%',
          padding: '0 var(--space-xl)'
        }}
      >
        {/* 头部文本 - 可选 */}
        {(title || screenNumber) && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 'var(--space-3xl)', 
            maxWidth: '800px', 
            margin: '0 auto var(--space-3xl) auto' 
          }}>
            <div>
              {screenNumber && (
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
              {title && (
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
              )}
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
        )}

        {/* 交错瀑布流布局容器 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-xl)',
          width: '100%'
        }}>
          {/* 第一行: 3张图片 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: gap,
              width: '100%',
              paddingLeft: '5%'
            }}
          >
            {firstRow.map((img, index) => (
              <div
                key={`row1-${index}`}
                style={{
                  height: firstRowHeight,
                  flexShrink: 0,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'transparent',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <img 
                  src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                  alt={img.label || `Gallery image ${index + 1}`}
                  style={{ 
                    height: '100%', 
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>

          {/* 第二行: 4张图片，稍小一些 */}
          {secondRow.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: gap,
                width: '100%',
                paddingRight: '5%'
              }}
            >
              {secondRow.map((img, index) => (
                <div
                  key={`row2-${index}`}
                  style={{
                    height: secondRowHeight,
                    flexShrink: 0,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'transparent',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <img 
                    src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                    alt={img.label || `Gallery image ${firstRowCount + index + 1}`}
                    style={{ 
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 图片标签 - 可选显示，两行分开 */}
        {images.some(img => img.label) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-2xl)'
          }}>
            {/* 第一行标签 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-3xl)',
                paddingLeft: '5%'
              }}
            >
              {firstRow.map((img, index) => (
                img.label && (
                  <span
                    key={`label1-${index}`}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(255,255,255,0.6)',
                      textAlign: 'center',
                      minWidth: '80px'
                    }}
                  >
                    {img.label}
                  </span>
                )
              ))}
            </div>
            {/* 第二行标签 */}
            {secondRow.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-2xl)',
                  paddingRight: '5%'
                }}
              >
                {secondRow.map((img, index) => (
                  img.label && (
                    <span
                      key={`label2-${index}`}
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center',
                        minWidth: '70px'
                      }}
                    >
                      {img.label}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlyInGalleryScreen;