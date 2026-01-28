import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * SquareGridScreen - 方形图片网格滚动渐现 (支持动态列数)
 * 
 * 优化点：
 * 1. 支持动态列数 (默认4列，可配置为6列等)
 * 2. 通过 margin: 0 auto 和 left/right: 0 强制绝对居中。
 * 3. 奇偶列错落视差效果。
 * 4. 保持配件垂挂交互（如有）。
 * 5. 支持配件卡片翻转效果（正反面切换）。
 * 
 * @param {Array} images - 网格图片数组 [{src, label}]
 * @param {number} columns - 列数 (默认4)
 * @param {Array} accessoryImages - 配件图片数组 (正面) [{src, label}]
 * @param {Array} accessoryBackImages - 配件背面图片数组 (可选) [{src, label}]
 * @param {string} bgColor - 背景颜色
 * @param {boolean} noBorder - 是否无边框样式 (透明正方形图)
 */
export const SquareGridScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  images = [],
  columns: columnCount = 4, // 新增：列数配置，默认4
  accessoryImages = [], 
  accessoryBackImages = [], // 新增：背面图片
  bgColor = '#000',
  noBorder = false // 新增：无边框样式
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const hasAccessories = accessoryImages.length > 0;
  const hasFlip = accessoryBackImages.length > 0;
  
  // 预先计算行数（用于确定视差范围）
  const tempColumns = Array.from({ length: columnCount }, () => []);
  images.forEach((img, index) => {
    const colIndex = index % columnCount;
    tempColumns[colIndex].push(img);
  });
  const rowCount = Math.max(...tempColumns.map(col => col.length), 1);
  
  // 根据行数动态调整视差位移范围
  // 6 行需要更大的位移范围才能完整展示（使用不对称范围，起始位置更靠上）
  const is6Row = rowCount >= 6;
  
  // 6 列时使用不对称位移：起始位置更靠上，结束位置更靠下
  const fastStart = is6Row ? 100 : (rowCount >= 4 ? 200 : 120);  // 起始更靠上
  const fastEnd = is6Row ? -1100 : (rowCount >= 4 ? -200 : -120); // 结束更靠下
  const slowStart = is6Row ? 50 : (rowCount >= 4 ? 80 : 40);
  const slowEnd = is6Row ? -900 : (rowCount >= 4 ? -80 : -40); // 增大慢列位移，确保底部图片完整展示

  // ----------------------------------------------------
  // Phase 1: Grid Animation (动态列数)
  // ----------------------------------------------------
  
  // Grid 位移：奇偶列交替视差
  const gridRange = hasAccessories ? [0, 0.35] : [0, 1];
  
  // 使用不对称的位移值，让内容一开始就更靠上
  const yFast = useTransform(scrollYProgress, gridRange, [fastStart, fastEnd]);
  const ySlow = useTransform(scrollYProgress, gridRange, [slowStart, slowEnd]);
  
  // Grid 退场：往后方退去
  const gridScale = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.9]); 
  const gridOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.2]); 
  const gridBlur = useTransform(scrollYProgress, [0.3, 0.5], ['blur(0px)', 'blur(10px)']); 
  
  // ----------------------------------------------------
  // Phase 2: Accessories Animation (Drop In Center)
  // ----------------------------------------------------
  
  // 触发区间：0.35 ~ 0.55（掉落）
  const dropRange = [0.35, 0.55];
  
  // 垂直掉落位移
  const rawDropY = useTransform(scrollYProgress, dropRange, ['-150vh', '0vh']);
  const dropY = useSpring(rawDropY, { stiffness: 120, damping: 15 });
  
  // 物理摆动模拟
  const rawRotate = useTransform(scrollYProgress, dropRange, [-5, 0]);
  const smoothRotate = useSpring(rawRotate, { stiffness: 100, damping: 10 });

  // ----------------------------------------------------
  // Phase 3: Flip Animation (翻转动画)
  // ----------------------------------------------------
  
  // 翻转触发区间：0.65 ~ 0.85
  const flipRange = [0.65, 0.85];
  
  // Y轴旋转角度：0 -> 180 (水平翻转)
  const flipRotateY = useTransform(scrollYProgress, flipRange, [0, 180]);
  const smoothFlipRotateY = useSpring(flipRotateY, { stiffness: 80, damping: 15 });

  if (images.length === 0) return null;

  // 动态列数支持：根据 columnCount 分配图片（复用已计算的 tempColumns）
  const columns = tempColumns.map((col, colIndex) => 
    col.map((img, i) => ({ ...img, originalIndex: colIndex + i * columnCount }))
  );
  
  // 根据列数调整间距
  const gapSize = columnCount >= 6 ? '12px' : '24px';
  const paddingTop = columnCount >= 6 ? '30px' : '60px';

  return (
    <div 
      ref={containerRef}
      style={{
        height: hasAccessories ? (hasFlip ? '500vh' : '400vh') : '300vh', 
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
        overflow: 'hidden',
        perspective: '1500px' // 3D 透视
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
          zIndex: 10
        }}>
          {screenNumber} / {screenLabel}
        </motion.div>

        {/* -------------------------------------------------- */}
        {/* Layer 1: Background Grid (4 Columns Centered) */}
        {/* -------------------------------------------------- */}
        <motion.div style={{
          position: 'absolute',
          inset: 0,
          margin: '0 auto',
          left: 0,
          right: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`, // 动态列数
          gap: gapSize,
          maxWidth: columnCount >= 6 ? '1600px' : '1400px',
          width: '100%',
          padding: columnCount >= 6 ? '0 24px' : '0 48px',
          alignItems: 'center',
          scale: hasAccessories ? gridScale : 1,
          opacity: hasAccessories ? gridOpacity : 1,
          filter: hasAccessories ? gridBlur : 'none',
          zIndex: 1
        }}>
          
          {columns.map((colImages, colIndex) => {
            // 奇偶列交替视差：0,2,4 快，1,3,5 慢
            const isEvenCol = colIndex % 2 === 0;
            const yMotion = isEvenCol ? yFast : ySlow;
            
            return (
              <motion.div 
                key={`col-${colIndex}`}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: gapSize, 
                  y: yMotion,
                  // 奇数列添加顶部偏移，形成错落
                  paddingTop: isEvenCol ? '0' : paddingTop
                }}
              >
                {colImages.map((img, i) => (
                  <GridItem 
                    key={`col${colIndex}-${i}`} 
                    image={img} 
                    index={img.originalIndex} 
                    isCenter={!isEvenCol}
                  />
                ))}
              </motion.div>
            );
          })}

        </motion.div>

        {/* -------------------------------------------------- */}
        {/* Layer 2: Foreground Accessories (Center Drop + Flip) */}
        {/* -------------------------------------------------- */}
        {hasAccessories && (
          <motion.div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            y: dropY,
            pointerEvents: 'none'
          }}>
             <div style={{
               display: 'flex',
               gap: '30px', 
               alignItems: 'flex-start',
               maxWidth: '1400px',
               width: '100%',
               justifyContent: 'center',
               padding: '0 48px',
               perspective: '1500px' // 3D 透视
             }}>
               {accessoryImages.map((img, i) => {
                 const delay = Math.abs(i - 2) * 0.1;
                 const rotateFactor = (i % 2 === 0 ? 1 : -1) * (1 + i * 0.2); 
                 const backImage = accessoryBackImages[i];

                 return (
                   <FlipCard
                     key={i}
                     frontImage={img}
                     backImage={backImage}
                     index={i}
                     smoothRotate={smoothRotate}
                     rotateFactor={rotateFactor}
                     flipRotateY={hasFlip ? smoothFlipRotateY : null}
                   />
                 );
               })}
             </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

/**
 * FlipCard - 3D 翻转卡片组件
 */
const FlipCard = ({ frontImage, backImage, index, smoothRotate, rotateFactor, flipRotateY }) => {
  const hasBack = !!backImage;
  
  return (
    <motion.div
      style={{
        width: '16%',
        aspectRatio: '1/3',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rotate: useTransform(smoothRotate, r => r * rotateFactor),
        transformOrigin: 'top center',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 悬挂线 */}
      <div style={{
        width: '1px',
        height: '150vh',
        background: 'rgba(255,255,255,0.15)',
        position: 'absolute',
        bottom: '95%',
        left: '50%'
      }} />

      {/* 翻转容器 */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateY: flipRotateY || 0
        }}
      >
        {/* 正面 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}>
          <img
            src={`${import.meta.env.BASE_URL}${frontImage.src.replace(/^\//, '')}`}
            alt={frontImage.label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'
            }}
          />
        </div>

        {/* 背面 */}
        {hasBack && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}>
            <img
              src={`${import.meta.env.BASE_URL}${backImage.src.replace(/^\//, '')}`}
              alt={backImage.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'
              }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// 子组件：单张卡片 (保持无背景)
const GridItem = ({ image, index, isCenter }) => {
  if (!image) return null;
  return (
    <motion.div
      style={{
        aspectRatio: '1 / 1',
        background: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', 
          display: 'block',
          background: 'transparent',
          filter: isCenter 
            ? 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))' 
            : 'drop-shadow(0 12px 18px rgba(0,0,0,0.3))',
        }}
      />
      {/* Label (Hidden by default) */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        background: 'rgba(0,0,0,0.6)', 
        padding: '2px 8px',
        borderRadius: '10px',
        opacity: 0,
      }}
      >
        {image.label}
      </div>
    </motion.div>
  );
};

export default SquareGridScreen;