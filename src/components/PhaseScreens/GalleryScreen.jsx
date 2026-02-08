import React from 'react';
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
  images = [],                          // 图片数组 [{ src, hint, label }]
  columns = 2,                          // 网格列数 (默认2列)
  bgAlt = false                         // 是否使用交替背景色
}) => {
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
          {img.label && (
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              textAlign: 'center'
            }}>
              {img.label}
            </div>
          )}
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
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)', maxWidth: '800px', margin: '0 auto var(--space-3xl) auto' }}>
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 'var(--space-lg)'
            }}>
              {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
            </div>
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

        {/* 画廊区域 */}
        {renderGalleryContent()}
      </div>
    </section>
  );
};