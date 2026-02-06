import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useScrollLock } from '../../contexts/ScrollLockContext';
import { useTheme } from '../../hooks/useTheme';
import ScrollIndicator from '../ScrollIndicator';

/**
 * 服务区域主组件 - Sticky Scroll Design
 * 滚动到此区域时固定，通过滚动切换服务项，看完后继续向下滚动
 * 支持亮色/暗色主题适配
 */
const ServiceSection = ({ 
  services, 
  title = "SERVICE",
  sectionLabel = "专业能力",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const { isScrollLocked, targetSection } = useScrollLock();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 主题色配置
  const colors = {
    bg: isDark ? '#111' : '#f5f5f5',
    bgSecondary: isDark ? '#0a0a0a' : '#eee',
    text: isDark ? '#fff' : '#111',
    textMuted: isDark ? '#888' : '#666',
    textSecondary: isDark ? '#666' : '#888',
    textLight: isDark ? '#555' : '#999',
    border: isDark ? '#333' : '#ddd',
    progressBg: isDark ? '#222' : '#ccc',
    progressFill: isDark ? '#fff' : '#111',
    tagBorder: isDark ? '#444' : '#ccc',
    tagText: isDark ? '#bbb' : '#555',
    buttonBg: isDark ? '#fff' : '#111',
    buttonText: isDark ? '#000' : '#fff',
    cardBg: isDark ? '#222' : '#fff',
    cardBgAlt: isDark ? '#1a1a1a' : '#f0f0f0',
    cardPlaceholder: isDark ? '#444' : '#999',
    indicatorBg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    indicatorText: isDark ? '#888' : '#666',
    dotActive: isDark ? '#fff' : '#111',
    dotInactive: isDark ? '#444' : '#ccc',
  };

  // 计算需要的滚动高度：每个服务项占一个视口高度
  const totalScrollHeight = services.length * 100; // vh

  // 使用 useScroll 监听容器内的滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 根据滚动进度计算当前激活的服务索引
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      // 将 0-1 的进度映射到 0 到 services.length-1
      const newIndex = Math.min(
        Math.floor(progress * services.length),
        services.length - 1
      );
      if (newIndex !== activeIndex && newIndex >= 0) {
        setActiveIndex(newIndex);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, services.length, activeIndex]);

  // 当导航到 services section 时，重置 activeIndex 为 0
  useEffect(() => {
    if (isScrollLocked && targetSection === 'services') {
      setActiveIndex(0);
    }
  }, [isScrollLocked, targetSection]);

  // 每个服务的示例图片（后续可通过 props 传入）
  const serviceImages = {
    'brand-foundation': [
      '/images/services/brand-1.jpg',
      '/images/services/brand-2.jpg',
      '/images/services/brand-3.jpg',
    ],
    'product-physical': [
      '/images/services/product-1.jpg',
      '/images/services/product-2.jpg',
      '/images/services/product-3.jpg',
    ],
    'visual-communication': [
      '/images/services/visual-1.jpg',
      '/images/services/visual-2.jpg',
      '/images/services/visual-3.jpg',
    ],
    'campaign-marketing': [
      '/images/services/campaign-1.jpg',
      '/images/services/campaign-2.jpg',
      '/images/services/campaign-3.jpg',
    ],
    'offline-applications': [
      '/images/services/offline-1.jpg',
      '/images/services/offline-2.jpg',
      '/images/services/offline-3.jpg',
    ],
    'creative-exploration': [
      '/images/services/creative-1.jpg',
      '/images/services/creative-2.jpg',
      '/images/services/creative-3.jpg',
    ],
  };

  // 获取当前服务的图片
  const currentService = services[activeIndex];
  // 支持新的对象格式 {main, sub1, sub2} 或旧的数组格式
  const rawImages = currentService?.images || serviceImages[currentService?.id] || [];
  const currentImages = Array.isArray(rawImages) 
    ? rawImages 
    : [rawImages.main, rawImages.sub1, rawImages.sub2].filter(Boolean);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: `${totalScrollHeight}vh`, // 总滚动高度
        background: colors.bg,
      }}
    >
      {/* Sticky 容器 - 固定在视口中 */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          background: colors.bg,
          color: colors.text,
          overflow: 'hidden',
        }}
      >
        {/* Left: Service Info */}
        <div 
          style={{ 
            width: 'clamp(400px, 55vw, 750px)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 clamp(40px, 6vw, 80px)',
            borderRight: `1px solid ${colors.border}`,
            position: 'relative',
          }}
        >
          {/* 滚动进度条 */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '3px',
            height: '100%',
            background: colors.progressBg,
          }}>
            <motion.div
              style={{
                width: '100%',
                background: colors.progressFill,
                height: `${((activeIndex + 1) / services.length) * 100}%`,
                transition: 'height 0.4s ease-out',
              }}
            />
          </div>

          {/* Service Content - AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 序号 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: '20px',
                marginBottom: '20px',
              }}>
                <span style={{ 
                  fontFamily: 'var(--font-mono, monospace)', 
                  color: colors.textSecondary, 
                  fontSize: '1rem',
                }}>
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: colors.textLight,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  / {String(services.length).padStart(2, '0')}
                </span>
              </div>

              {/* 标题 */}
              <h3 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                margin: '0 0 25px 0', 
                fontWeight: '400',
                color: colors.text,
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.1,
              }}>
                {currentService?.title}
              </h3>

              {/* 问题描述 */}
              {currentService?.problem && (
                <p style={{ 
                  fontSize: '1rem', 
                  color: colors.textMuted, 
                  lineHeight: 1.7, 
                  marginBottom: '8px',
                  maxWidth: '500px',
                }}>
                  {currentService.problem}
                </p>
              )}

              {/* 服务描述 */}
              <p style={{ 
                fontSize: '1rem', 
                color: colors.textMuted, 
                lineHeight: 1.7, 
                marginBottom: '25px',
                maxWidth: '500px',
              }}>
                {currentService?.desc}
              </p>

              {/* Tags */}
              {currentService?.tags && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
                  {currentService.tags.map(tag => (
                    <span 
                      key={tag} 
                      style={{ 
                        padding: '6px 14px', 
                        border: `1px solid ${colors.tagBorder}`, 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.85rem', 
                        color: colors.tagText 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* 底部导航点 */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(30px, 5vh, 50px)',
            left: 'clamp(40px, 6vw, 80px)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}>
            {services.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  width: activeIndex === index ? '28px' : '10px',
                  background: activeIndex === index ? colors.dotActive : colors.dotInactive,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  height: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* 滚动提示 */}
          <ScrollIndicator
            variant="default"
            position="bottom-right"
            color={colors.textLight}
            opacity={activeIndex < services.length - 1 ? 1 : 0}
          />
        </div>

        {/* Right: Image Gallery - 扩大区域 */}
        <div 
          style={{ 
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(20px, 3vw, 40px)',
            background: colors.bgSecondary,
            position: 'relative',
          }}
        >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '900px',
              maxHeight: '75vh',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {/* 主图片 - 占据左侧两行 */}
            <motion.div
              style={{
                gridRow: '1 / 3',
                gridColumn: '1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: colors.cardBg,
                position: 'relative',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {currentImages[0] ? (
                <img 
                  src={currentImages[0]} 
                  alt={`${currentService?.title} - 1`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{
                display: currentImages[0] ? 'none' : 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.cardPlaceholder,
                fontSize: '0.9rem',
                fontWeight: '500',
                textAlign: 'center',
                padding: '20px',
              }}>
                {currentService?.title || 'Image 1'}
              </div>
            </motion.div>

            {/* 右上图片 */}
            <motion.div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: colors.cardBgAlt,
                position: 'relative',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {currentImages[1] ? (
                <img 
                  src={currentImages[1]} 
                  alt={`${currentService?.title} - 2`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{
                display: currentImages[1] ? 'none' : 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.cardPlaceholder,
                fontSize: '0.85rem',
                fontWeight: '500',
              }}>
                Image 2
              </div>
            </motion.div>

            {/* 右下图片 */}
            <motion.div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: colors.cardBgAlt,
                position: 'relative',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {currentImages[2] ? (
                <img 
                  src={currentImages[2]} 
                  alt={`${currentService?.title} - 3`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{
                display: currentImages[2] ? 'none' : 'flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.cardPlaceholder,
                fontSize: '0.85rem',
                fontWeight: '500',
              }}>
                Image 3
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* 当前服务指示器 */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(20px, 4vh, 40px)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}>
          {services.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: activeIndex === index ? '24px' : '8px',
                background: activeIndex === index ? colors.dotActive : colors.dotInactive,
              }}
              transition={{ duration: 0.3 }}
              style={{
                height: '8px',
                borderRadius: '4px',
              }}
            />
          ))}
        </div>

          {/* 服务编号标签 */}
          <motion.div
            key={`label-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 'clamp(20px, 4vh, 40px)',
              right: 'clamp(20px, 4vw, 40px)',
              padding: '8px 16px',
              background: colors.indicatorBg,
              borderRadius: 'var(--radius-full)',
              color: colors.indicatorText,
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono, monospace)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
