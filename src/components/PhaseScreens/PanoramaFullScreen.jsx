import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * PanoramaFullScreen - 沉浸式信息展示 (优化版：Cinematic Scan)
 * 
 * 优化点：
 * 1. 增加沉浸感：暗角氛围 (Vignette) + 缓慢推进 (Zoom In)
 * 2. 模拟"扫描"体验：随着滚动，视角由于微弱的 Scale 和 Y轴位移，仿佛在扫描整个仪表盘
 * 3. 光感增强：在图片上方添加一层 subtle 的光效层
 * 
 * @param {Object} image - 图片对象 {src, label}
 * @param {string} bgColor - 背景颜色
 */
export const PanoramaFullScreen = ({
  screenNumber,
  screenLabel,
  image,
  bgColor = '#000'
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  if (!image) return null;

  // -----------------------------------------------------------
  // 动效参数
  // -----------------------------------------------------------
  
  // 1. 缩放推进 (Cinema Zoom): 1.0 -> 1.15
  // 入场时略微缩小，随着滚动慢慢推近，增加临场感
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1.15]);
  
  // 2. 垂直扫描 (Vertical Pan): 
  // 如果图片很高，这会有帮助；即使图片不高，轻微的位移也能增加动态感
  const yPan = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  
  // 3. 氛围暗角 (Vignette Fade):
  // 初始时暗角较重(聚焦中心)，滚动中慢慢散开，看清全貌
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 0.2]);
  
  // 4. 文字离场：开始滚动后，Label 慢慢消失，以免干扰
  const labelOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div 
      ref={containerRef}
      style={{
        height: '250vh', // 增加高度，提供足够的"凝视"时间
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
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 屏幕标识 */}
        <motion.div style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          zIndex: 20,
          opacity: labelOpacity
        }}>
          {screenNumber} / {screenLabel}
        </motion.div>

        {/* 核心展示区 */}
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* Layer 1: 图片层 (Zoom & Pan) */}
          <motion.div
            style={{
              scale: scale,
              y: yPan,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
              alt={image.label || 'Panorama'}
              style={{
                width: '90%', // 留出一点边距，避免贴边
                height: '90%',
                objectFit: 'contain', // 保证完整显示所有信息
                filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))', // 增加深邃的投影浮空感
                willChange: 'transform'
              }}
            />
          </motion.div>

          {/* Layer 2: 电影感暗角 (Vignette Overlay) */}
          {/* 四周暗，中间亮，聚焦视线 */}
          <motion.div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 30%, #0a0a0a 100%)',
              opacity: vignetteOpacity,
              pointerEvents: 'none',
              zIndex: 10
            }}
          />
          
          {/* Layer 3: 底部文字说明 (随滚动淡出) */}
          {image.label && (
            <motion.div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                x: '-50%',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1px',
                opacity: labelOpacity,
                zIndex: 20
              }}
            >
              {image.label}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PanoramaFullScreen;