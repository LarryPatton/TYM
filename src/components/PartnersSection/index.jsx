import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

/**
 * 合作品牌区域 - Sticky Scroll + 滚动渐进出现效果
 * 随着滚动逐个显示品牌卡片
 */
const PartnersSection = ({ partners }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // 导航栏高度
  const navHeight = 80; // px

  // Sticky 滚动高度
  const stickyScrollHeight = (partners.length + 1) * 50; // vh

  // Sticky scroll 进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 根据滚动进度更新当前显示到第几个卡片
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      // 将进度映射到 -1 到 partners.length - 1
      const newIndex = Math.min(
        Math.floor(progress * (partners.length + 1)) - 1,
        partners.length - 1
      );
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, partners.length, currentIndex]);

  // 网格布局计算
  const getGridPosition = (index, total) => {
    let cols = 3;
    if (total <= 3) cols = total;
    else if (total <= 4) cols = 2;
    else if (total <= 6) cols = 3;
    else cols = 4;

    const rows = Math.ceil(total / cols);
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const cellWidth = (100 - (cols - 1) * 2) / cols;
    const cellHeight = (100 - (rows - 1) * 2) / rows;
    const gapX = 2;
    const gapY = 2;
    
    return {
      left: `${col * (cellWidth + gapX)}%`,
      top: `${row * (cellHeight + gapY)}%`,
      width: `${cellWidth}%`,
      height: `${cellHeight}%`,
    };
  };

  // 主题色配置
  const colors = {
    bg: isDark ? '#0a0a0a' : '#f8f8f8',
    text: isDark ? '#fff' : '#111',
    textMuted: isDark ? '#555' : '#888',
    textSecondary: isDark ? '#777' : '#666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    cardBg: isDark ? '#1a1a1a' : '#fff',
    cardOverlay: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.4)',
    progressBg: isDark ? '#222' : '#ddd',
    progressFill: isDark ? '#fff' : '#111',
    placeholderBg: (index) => isDark 
      ? `linear-gradient(135deg, hsl(${200 + index * 25}, 25%, 18%) 0%, hsl(${200 + index * 25}, 20%, 12%) 100%)`
      : `linear-gradient(135deg, hsl(${200 + index * 25}, 15%, 92%) 0%, hsl(${200 + index * 25}, 10%, 85%) 100%)`,
    placeholderText: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  };

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: `${stickyScrollHeight}vh`,
        background: colors.bg,
      }}
    >
      {/* Sticky 容器 - 考虑导航栏高度 */}
      <div
        style={{
          position: 'sticky',
          top: `${navHeight}px`,
          height: `calc(100vh - ${navHeight}px)`,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          gap: 'clamp(16px, 2vh, 24px)',
          padding: 'clamp(20px, 2.5vh, 32px) clamp(40px, 6vw, 80px)',
          boxSizing: 'border-box',
        }}
      >
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <p style={{ 
              color: colors.textMuted, 
              fontSize: '0.85rem', 
              textTransform: 'uppercase', 
              letterSpacing: '4px',
              marginBottom: '8px',
            }}>
              {t('home.partnersTitle')}
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: '400',
              color: colors.text,
              fontFamily: 'var(--font-serif)',
              margin: 0,
            }}>
              {t('home.partnersSubtitle')}
            </h2>
          </div>

          {/* 进度指示 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}>
            <span style={{
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono, monospace)',
              color: colors.text,
              fontWeight: '600',
            }}>
              {String(Math.max(0, currentIndex + 1)).padStart(2, '0')} / {String(partners.length).padStart(2, '0')}
            </span>
            <div style={{
              width: '80px',
              height: '3px',
              background: colors.progressBg,
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${(Math.max(0, currentIndex + 1) / partners.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  height: '100%',
                  background: colors.progressFill,
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* 卡片容器 */}
        <div style={{
          position: 'relative',
          maxWidth: '1400px',
          width: '100%',
          height: '100%',
          margin: '0 auto',
          overflow: 'visible',
        }}>
          {partners.map((partner, index) => {
            const isVisible = index <= currentIndex;
            const isHighlighted = index === currentIndex;
            const pos = getGridPosition(index, partners.length);
            
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0.8,
                  y: isVisible ? 0 : 50,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  zIndex: isHighlighted ? 100 : index + 1,
                  boxShadow: isHighlighted 
                    ? (isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.15)')
                    : 'none',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                {/* 背景图片 */}
                <img
                  src={partner.image}
                  alt={t(`home.partners.${partner.id}.name`)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                
                {/* 渐变占位背景 */}
                <div style={{
                  display: 'none',
                  width: '100%',
                  height: '100%',
                  background: colors.placeholderBg(index),
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}>
                  <span style={{
                    fontSize: 'clamp(3rem, 10vw, 8rem)',
                    fontWeight: '800',
                    color: colors.placeholderText,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    userSelect: 'none',
                  }}>
                    {t(`home.partners.${partner.id}.name`).charAt(0)}
                  </span>
                </div>

                {/* 品牌标签 */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                      fontWeight: '600',
                      color: '#fff',
                      marginBottom: '2px',
                      margin: 0,
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}>
                      {t(`home.partners.${partner.id}.name`)}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(0.75rem, 0.9vw, 0.9rem)',
                      color: 'rgba(255,255,255,0.7)',
                      textShadow: '0 1px 5px rgba(0,0,0,0.5)',
                      margin: 0,
                    }}>
                      {t(`home.partners.${partner.id}.desc`)}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    color: '#fff',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* 高亮边框 */}
                {isHighlighted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                      borderRadius: '16px',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 底部滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: currentIndex < partners.length - 1 ? 1 : 0 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(20px, 3vh, 40px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: colors.textMuted,
            fontSize: '0.8rem',
          }}
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
