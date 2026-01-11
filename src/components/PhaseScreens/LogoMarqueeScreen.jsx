import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MAX_WIDTH_WIDE } from './Common';

// ============================================
// 屏幕: Logo 无限跑马灯展示 (LogoMarqueeScreen)
// 滚动锁定版：需要滑动多次才能离开
// ============================================
export const LogoMarqueeScreen = ({
  screenNumber,
  screenLabel,
  title,
  content
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Logo 图片列表
  const baseImages = [
    'logo-marquee-01.png',
    'logo-marquee-02.png'
  ];
  
  // 重复多组实现无缝循环
  const marqueeImages = [...baseImages, ...baseImages, ...baseImages, ...baseImages];

  // 跑马灯位移：随滚动进度从 0% 移动到 -50%
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  
  // 标题淡入
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.1], [30, 0]);
  
  // 整体淡出（离开时）
  const containerOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  // 进度指示器
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} style={{ 
      height: '300vh', // 增加高度，需要滚动 3 个屏幕高度
      position: 'relative',
      background: '#0a0a0a'
    }}>
      {/* Sticky 容器 */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <motion.div style={{ opacity: containerOpacity }}>
          {/* 标题区域 */}
          <motion.div 
            style={{
              padding: '0 var(--space-2xl)',
              marginBottom: 'var(--space-3xl)',
              maxWidth: MAX_WIDTH_WIDE,
              margin: '0 auto',
              width: '100%',
              zIndex: 10,
              textAlign: 'center',
              opacity: titleOpacity,
              y: titleY
            }}
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
              fontSize: 'var(--text-h2)',
              fontWeight: '400',
              lineHeight: 'var(--line-height-snug)',
              color: '#fff'
            }}>
              {title}
            </h2>
          </motion.div>

          {/* 跑马灯区域 */}
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            overflow: 'hidden'
          }}>
            <motion.div 
              style={{ 
                display: 'flex', 
                gap: '0',
                width: 'max-content',
                x: marqueeX // 滚动驱动的位移
              }}
            >
              {marqueeImages.map((imgSrc, index) => (
                <div key={index} style={{
                  width: 'auto',
                  height: '55vh',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent', 
                  borderRadius: '0',
                  boxShadow: 'none',
                  padding: '0'
                }}>
                  <img 
                    src={`${import.meta.env.BASE_URL}images/phase-01/${imgSrc}`}
                    alt={`Logo Variation ${index}`}
                    style={{ 
                      width: 'auto',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* 底部进度指示器 */}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Scroll to explore
            </div>
            {/* 进度条 */}
            <div style={{
              width: '100%',
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '1px',
              overflow: 'hidden'
            }}>
              <motion.div 
                style={{
                  height: '100%',
                  background: '#E07B4C',
                  width: progressWidth,
                  borderRadius: '1px'
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};