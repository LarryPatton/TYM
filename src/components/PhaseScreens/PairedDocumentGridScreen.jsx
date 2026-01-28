import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * PairedDocumentGridScreen - 三列配对文档网格（优化版）
 * 
 * 特点：
 * 1. 3×3 网格布局，共 9 组
 * 2. 每组 2 张图片横向堆叠（左右并排）
 * 3. 奇偶列错落视差（中间列慢，两侧列快）
 * 4. 更大的单组尺寸，更醒目
 * 
 * @param {Array} imageGroups - 图片组数组 [{images: [{src, label}, {src, label}]}]
 * @param {string} bgColor - 背景颜色
 */
export const PairedDocumentGridScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  imageGroups = [],
  bgColor = '#000'
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 两侧列 (0, 2) - 快速移动
  const yFast = useTransform(scrollYProgress, [0, 1], [100, -100]);
  // 中间列 (1) - 慢速移动
  const ySlow = useTransform(scrollYProgress, [0, 1], [30, -30]);

  if (imageGroups.length === 0) return null;

  // 确保最多显示 9 组
  const displayGroups = imageGroups.slice(0, 9);
  
  // 分配到 3 列（每列 3 组）
  const columns = [[], [], []];
  displayGroups.forEach((group, index) => {
    const colIndex = index % 3;
    columns[colIndex].push({ ...group, originalIndex: index });
  });

  return (
    <div 
      ref={containerRef}
      style={{
        height: '300vh',  // 滚动驱动用
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 屏幕标识 */}
        {screenNumber && (
          <motion.div style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            zIndex: 10
          }}>
            {screenNumber} / {screenLabel}
          </motion.div>
        )}

        {/* 三列网格容器 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          maxWidth: '1400px',
          width: '100%',
          padding: '0 60px',
          alignItems: 'center'
        }}>
          
          {columns.map((colGroups, colIndex) => {
            // 两侧列 (0, 2) 快速，中间列 (1) 慢速
            const isCenter = colIndex === 1;
            const yMotion = isCenter ? ySlow : yFast;
            
            return (
              <motion.div
                key={`col-${colIndex}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '28px',
                  y: yMotion,
                  // 中间列添加顶部偏移，形成错落
                  paddingTop: isCenter ? '80px' : '0'
                }}
              >
                {colGroups.map((group) => (
                  <DocumentPair
                    key={`group-${group.originalIndex}`}
                    images={group.images}
                    index={group.originalIndex}
                  />
                ))}
              </motion.div>
            );
          })}
          
        </div>
      </div>
    </div>
  );
};

/**
 * 单组文档对（2张图片横向并排）
 */
const DocumentPair = ({ images, index }) => {
  if (!images || images.length < 2) return null;
  
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        background: 'transparent'
      }}
      whileHover={{ 
        scale: 1.04,
        transition: { duration: 0.3 }
      }}
    >
      {images.slice(0, 2).map((img, imgIndex) => (
        <div
          key={imgIndex}
          style={{
            flex: 1,
            aspectRatio: '1 / 1.414',  // A4 比例
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '6px'
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
            alt={img.label || `Document ${index * 2 + imgIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
            }}
            onError={(e) => {
              console.error('PairedDocumentGrid image load error:', img.src);
              e.target.style.display = 'none';
            }}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default PairedDocumentGridScreen;