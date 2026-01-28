import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

// ============================================
// 屏幕: 验证阶段 Sticky 展示 (ValidationStickyScreen)
// 布局: 左侧固定文案 (28%)，右侧滚动展示图片 (72%)
// 效果: 滚动时左侧文案保持固定，右侧图片依次进入视口
// ============================================
export const ValidationStickyScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  images = null // 接受外部传入的 images 配置
}) => {
  const containerRef = useRef(null);
  
  // ============================================
  // 【图片资源配置】
  // ============================================
  
  /**
   * 默认图片列表配置 (Phase 01 Validation)
   */
  const defaultImages = [
    { 
      src: `${import.meta.env.BASE_URL}images/phase-01/validation-preview-01.png`,
      type: 'wide', // 16:9
      label: 'Preview 01'
    },
    { 
      src: `${import.meta.env.BASE_URL}images/phase-01/validation-preview-02.png`,
      type: 'wide', // 16:9
      label: 'Preview 02'
    },
    { 
      src: `${import.meta.env.BASE_URL}images/phase-01/validation-packaging.png`,
      type: 'wide', // 16:9
      label: 'Packaging Validation'
    },
    { 
      type: 'group', // 组合展示
      items: [
        { src: `${import.meta.env.BASE_URL}images/phase-01/validation-material-01.png`, label: 'Material 01' },
        { src: `${import.meta.env.BASE_URL}images/phase-01/validation-material-02.png`, label: 'Material 02' }
      ],
      label: 'Material Validation'
    }
  ];

  // 使用传入的 images 或默认配置
  const displayImages = images || defaultImages;

  return (
    <section 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        background: '#0a0a0a', 
        color: '#fff',
        minHeight: '400vh' // 确保有足够的滚动空间
      }}
    >
      <div style={{ 
        display: 'flex', 
        maxWidth: MAX_WIDTH_WIDE, 
        margin: '0 auto',
        padding: '0 50px',
        position: 'relative'
      }}>
        
        {/* 左侧 Sticky 区域 (28%) */}
        <div style={{ 
          width: '28%', 
          height: '100vh', 
          position: 'sticky', 
          top: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          paddingRight: '40px'
        }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 'var(--space-lg)'
            }}>
              {screenNumber} / {screenLabel}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '3rem',
              fontWeight: '400',
              marginBottom: 'var(--space-lg)',
              lineHeight: 1.2,
              color: '#fff'
            }}>
              {title}
            </h2>
            {content && (
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}>
                {content}
              </p>
            )}
          </motion.div>
        </div>

        {/* 右侧滚动区域 (72%) */}
        <div style={{ width: '72%', paddingBottom: '10vh' }}>
          {displayImages.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '40px 0'
              }}
            >
              {item.type === 'group' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                  {item.items.map((subItem, subIndex) => (
                    <motion.div
                      key={subIndex}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: subIndex * 0.2 }}
                      viewport={{ margin: "-10%" }}
                      style={{
                        flex: 1,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        background: '#1a1a1a'
                      }}
                    >
                    <img 
                      src={subItem.src} 
                      alt={subItem.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ margin: "-20%" }}
                  style={{
                    width: '100%',
                    aspectRatio: item.type === 'wide' ? '16/9' : '3/4',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    background: '#1a1a1a',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={item.src} 
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  {/* 标签 */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}>
                    {item.label}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};