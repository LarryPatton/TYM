import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * TwoRowStaticScreen - 上下两行静态展示组件
 * 
 * 特点：
 * 1. 上下两行布局，每行独立配置数量和尺寸
 * 2. 纯纵向滚动，无横向切换动画
 * 3. 支持自定义标题和背景色
 * 4. 支持 sticky 模式：整屏固定，滚动一定距离后释放
 * 5. 支持按顺序弹出动画
 * 6. 支持自定义纵横比（aspectRatio）适配竖版图片
 * 
 * 移动端优化：
 * - 改为垂直滚动的网格布局（2列）
 * - 禁用 sticky 效果
 * - 简化动画
 * 
 * @param {string} title - 标题
 * @param {Object} layout - 布局配置 { rows: [{count, scale, aspectRatio?}, ...] }
 * @param {Array} images - 图片数组 [{src, label}]
 * @param {string} bgColor - 背景颜色
 * @param {boolean} sticky - 是否启用 sticky 效果
 * @param {number} stickyHeight - sticky 模式下的滚动高度（单位 vh，默认 150）
 * @param {boolean} showItemCount - 是否显示图片计数（默认 true）
 * @param {boolean} sequentialPopup - 是否按顺序弹出（默认 false）
 */
export const TwoRowStaticScreen = ({
  screenNumber,
  screenLabel,
  title,
  layout,
  images = [],
  bgColor = '#000',
  sticky = false,
  stickyHeight = 150,
  showItemCount = true,
  sequentialPopup = false
}) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-20%' });
  const [visibleRows, setVisibleRows] = useState([]);
  
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 按顺序弹出逻辑
  useEffect(() => {
    if (!sequentialPopup || !isInView || !layout?.rows) return;
    
    // 依次显示每一行
    layout.rows.forEach((_, rowIndex) => {
      setTimeout(() => {
        setVisibleRows(prev => [...prev, rowIndex]);
      }, rowIndex * 600); // 每行间隔 600ms
    });
  }, [isInView, sequentialPopup, layout?.rows?.length]);

  if (!layout || !layout.rows || images.length === 0) return null;

  // 移动端：简化为垂直网格布局
  if (isMobile) {
    // 获取第一行的 aspectRatio 作为统一比例（默认 A4 竖版 0.71）
    const mobileAspectRatio = layout.rows[0]?.aspectRatio || 0.71;
    
    return (
      <section
        ref={containerRef}
        style={{
          background: bgColor,
          padding: '60px 16px 80px',
          color: '#fff'
        }}
      >
        {/* 标题 */}
        {title && (
          <motion.h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 300,
              color: '#fff',
              marginBottom: '24px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>
        )}

        {/* 移动端 2 列网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {images.map((img, index) => (
            <motion.div
              key={`mobile-img-${index}`}
              style={{
                aspectRatio: `${mobileAspectRatio}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 'var(--radius-image, 8px)'
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true, margin: '-10%' }}
            >
              <img
                src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                alt={img.label || `Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: 'var(--radius-image, 8px)'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </motion.div>
          ))}
        </div>

        {/* 图片计数 */}
        {showItemCount && (
          <motion.div
            style={{
              marginTop: '24px',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '2px',
              textAlign: 'center'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {images.length} ITEMS
          </motion.div>
        )}
      </section>
    );
  }

  // ============ 桌面端渲染 ============
  
  // 基准高度（用于计算尺寸）
  const baseHeight = 200;

  // 渲染内容的函数
  const renderContent = () => (
    <>
      {/* 标题 */}
      {title && (
        <motion.h2 
          style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#fff',
            marginBottom: '32px',
            letterSpacing: '6px',
            textTransform: 'uppercase'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h2>
      )}

      {/* 两行布局容器 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        maxWidth: '1600px',
        width: '100%',
        alignItems: 'center'
      }}>
        {layout.rows.map((rowConfig, rowIndex) => {
          const startIndex = layout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0);
          const endIndex = startIndex + rowConfig.count;
          const rowImages = images.slice(startIndex, endIndex);
          
          // 按顺序弹出模式：只有在 visibleRows 中才显示
          const isRowVisible = sequentialPopup ? visibleRows.includes(rowIndex) : isInView;
          
          // 计算尺寸：支持自定义纵横比
          const aspectRatio = rowConfig.aspectRatio || 1; // 默认正方形
          const height = baseHeight * rowConfig.scale;
          const width = height * aspectRatio;

          return (
            <motion.div
              key={`row-${rowIndex}`}
              style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ 
                opacity: isRowVisible ? 1 : 0, 
                y: isRowVisible ? 0 : 40,
                scale: isRowVisible ? 1 : 0.95
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {rowImages.map((img, imgIndex) => {
                const globalIndex = startIndex + imgIndex;

                  // 判断是否使用 contain 模式（完整显示图片）
                  const useContain = rowConfig.contain !== false; // 默认使用 contain

                  return (
                    <motion.div
                      key={`img-${globalIndex}`}
                      style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        overflow: 'visible',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ 
                        opacity: isRowVisible ? 1 : 0, 
                        scale: isRowVisible ? 1 : 0.8,
                        y: isRowVisible ? 0 : 20
                      }}
                      transition={{ 
                        duration: 0.5, 
                        delay: sequentialPopup ? imgIndex * 0.06 : 0.2 + imgIndex * 0.06,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        zIndex: 10,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                        alt={img.label || `Image ${globalIndex + 1}`}
                        style={{
                          width: useContain ? 'auto' : '100%',
                          height: '100%',
                          maxWidth: '100%',
                          objectFit: useContain ? 'contain' : 'cover',
                          display: 'block',
                          borderRadius: 'var(--radius-image, 12px)',
                          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))'
                        }}
                        onError={(e) => {
                          console.error('TwoRowStatic image load error:', img.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    </motion.div>
                  );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* 图片计数 - 可通过 showItemCount 控制 */}
      {showItemCount && (
        <motion.div 
          style={{
            marginTop: '32px',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '2px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {images.length} ITEMS
        </motion.div>
      )}
    </>
  );

  // Sticky 模式
  if (sticky) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${stickyHeight}vh`,
          position: 'relative',
          background: bgColor,
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingBottom: '40px',
            overflow: 'hidden'
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  // 非 sticky 模式
  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '100px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingBottom: '40px'
      }}
    >
      {renderContent()}
    </div>
  );
};

export default TwoRowStaticScreen;