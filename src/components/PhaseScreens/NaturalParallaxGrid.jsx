import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * NaturalParallaxGrid - 自然滚动视差网格组件
 * 
 * 特性：
 * 1. 自然页面滚动（非 sticky 容器）
 * 2. 奇偶列错落视差效果
 * 3. 自动计算容器高度，确保最后一行完整展示
 * 4. 支持分组展示，组间有分隔线和过渡效果
 * 5. 支持动态列数配置
 * 
 * 移动端优化：
 * - 改为 2 列布局
 * - 禁用视差效果（性能优化）
 * - 调整间距和 padding
 * 
 * @param {string} screenNumber - 屏幕编号
 * @param {string} screenLabel - 屏幕标签
 * @param {string} title - 屏幕标题（可选）
 * @param {Array} groups - 分组数据 [{label, images: [{src, label}]}]
 * @param {Array} images - 图片数组（如果不分组则使用此参数）
 * @param {number} columns - 列数（默认3）
 * @param {string} gap - 间距（默认24px）
 * @param {number} paddingTop - 奇数列顶部偏移（默认60px）
 * @param {string} bgColor - 背景颜色（默认#000）
 * @param {number} parallaxIntensity - 视差强度（0-1，默认0.3）
 */
export const NaturalParallaxGrid = ({
  screenNumber,
  screenLabel,
  title,
  groups = [],
  images = [],
  columns = 3,
  gap = '24px',
  rowGap: customRowGap,  // 新增：自定义行间距
  paddingTop = 60,
  bgColor = '#000',
  parallaxIntensity = 0.3,
  compactMode = false  // 新增：紧凑模式
}) => {
  const containerRef = useRef(null);
  
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

  // 滚动进度监听（相对于容器的可见范围）
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] // 容器进入视口到完全离开
  });

  // 判断是否使用分组模式
  const isGrouped = groups.length > 0;
  const groupsData = isGrouped ? groups : [{ label: null, images }];

  // 视差位移量（基于 parallaxIntensity）- 移动端禁用
  const maxOffset = isMobile ? 0 : 200 * parallaxIntensity;
  const yFast = useTransform(scrollYProgress, [0, 1], [maxOffset * 1.2, -maxOffset * 1.2]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [maxOffset * 0.4, -maxOffset * 0.4]);

  // 收集所有图片用于移动端展示
  const allImages = groupsData.flatMap(g => g.images || []);

  // 移动端：简化为 2 列网格布局
  if (isMobile) {
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
          <motion.div
            style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center',
              marginBottom: '24px',
              letterSpacing: '2px'
            }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.div>
        )}

        {/* 移动端 2 列网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          maxWidth: '100%'
        }}>
          {allImages.map((img, index) => (
            <motion.div
              key={`mobile-grid-${index}`}
              style={{
                aspectRatio: compactMode ? '4 / 3' : '3 / 4',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 'var(--radius-image, 8px)'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: Math.min(index * 0.03, 0.3) // 最大延迟 0.3s
              }}
              viewport={{ once: true, margin: '-5%' }}
            >
              <img
                src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                alt={img.label || `Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: 'var(--radius-image, 8px)'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // ============ 桌面端渲染 ============
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        background: bgColor,
        padding: '80px 0',
        minHeight: '100vh'
      }}
    >
      {/* 屏幕标识 - 只在有内容时显示 */}
      {(screenNumber || screenLabel || title) && (
        <motion.div
          style={{
            position: 'sticky',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            zIndex: 10,
            textAlign: 'center'
          }}
        >
          {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel || '')}
          {title && <div style={{ marginTop: '8px', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>{title}</div>}
        </motion.div>
      )}

      {/* 分组内容 - 每组独立 sticky */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        {groupsData.map((group, groupIndex) => (
          <StickyGroup
            key={`group-${groupIndex}`}
            group={group}
            groupIndex={groupIndex}
            totalGroups={groupsData.length}
            columns={columns}
            gap={gap}
            rowGap={customRowGap}
            paddingTop={paddingTop}
            yFast={yFast}
            ySlow={ySlow}
            compactMode={compactMode}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * StickyGroup - 带 sticky 效果的分组容器
 */
const StickyGroup = ({ group, groupIndex, totalGroups, columns, gap, rowGap, paddingTop, yFast, ySlow, compactMode, aspectRatio }) => {
  const groupRef = useRef(null);
  
  // 每组的 sticky 滚动高度（vh）- 多组时更长，单组时较短
  const stickyScrollHeight = totalGroups > 1 ? 280 : 100;
  
  // 组间距（vh）- 只有多组时才添加
  const groupSpacing = totalGroups > 1 ? '50vh' : '0';
  
  return (
    <div
      ref={groupRef}
      style={{
        height: totalGroups > 1 ? `${stickyScrollHeight}vh` : 'auto',
        minHeight: totalGroups > 1 ? undefined : '100vh',
        position: 'relative',
        marginBottom: groupIndex < totalGroups - 1 ? groupSpacing : '0'
      }}
    >
      {/* Sticky 内容容器 */}
      <div
        style={{
          position: totalGroups > 1 ? 'sticky' : 'relative',
          top: totalGroups > 1 ? 0 : undefined,
          height: totalGroups > 1 ? '100vh' : 'auto',
          minHeight: totalGroups > 1 ? undefined : '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          padding: totalGroups > 1 ? 0 : '60px 0'
        }}
      >
        {/* 网格容器 */}
        <ParallaxGridGroup
          images={group.images}
          columns={columns}
          gap={gap}
          rowGap={rowGap}
          paddingTop={paddingTop}
          yFast={yFast}
          ySlow={ySlow}
          compactMode={compactMode}
          aspectRatio={aspectRatio}
        />
      </div>
    </div>
  );
};

/**
 * ParallaxGridGroup - 单个分组的视差网格
 */
const ParallaxGridGroup = ({ images, columns, gap, rowGap: customRowGap, paddingTop, yFast, ySlow, compactMode, aspectRatio }) => {
  // 将图片分配到各列
  const columnsData = Array.from({ length: columns }, () => []);
  images.forEach((img, index) => {
    const colIndex = index % columns;
    columnsData[colIndex].push({ ...img, originalIndex: index });
  });

  // 使用传入的 gap，如果是紧凑模式则使用特定值
  const colGap = compactMode ? '24px' : gap;
  const rowGap = customRowGap || (compactMode ? '4px' : gap);
  const gridWidth = compactMode ? '95%' : '100%';
  const offsetMultiplier = compactMode ? 0.3 : 0.5;
  const imgAspectRatio = aspectRatio || (compactMode ? '4 / 3' : '3 / 4');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: colGap,
        rowGap: rowGap,
        width: gridWidth,
        margin: '0 auto'
      }}
    >
      {columnsData.map((colImages, colIndex) => {
        const isEvenCol = colIndex % 2 === 0;
        const yMotion = isEvenCol ? yFast : ySlow;

        return (
          <motion.div
            key={`col-${colIndex}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: rowGap,
              y: yMotion,
              paddingTop: isEvenCol ? '0' : `${paddingTop * offsetMultiplier}px`
            }}
          >
            {colImages.map((img, i) => (
              <GridItem key={`item-${i}`} image={img} aspectRatio={imgAspectRatio} compactMode={compactMode} />
            ))}
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * GridItem - 单张图片项
 */
const GridItem = ({ image, aspectRatio = '3 / 4', compactMode = false }) => {
  if (!image) return null;

  return (
    <motion.div
      style={{
        aspectRatio: aspectRatio,
        background: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--radius-image, 12px)'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || 'Grid Image'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: 'var(--radius-image, 12px)',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
        }}
      />
      {/* 标签（鼠标悬停显示） */}
      {image.label && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: '12px',
            opacity: 0,
            transition: 'opacity 0.3s'
          }}
          className="grid-item-label"
        >
          {image.label}
        </div>
      )}
      <style>
        {`
          .grid-item-label {
            opacity: 0;
          }
          div:hover > .grid-item-label {
            opacity: 1;
          }
        `}
      </style>
    </motion.div>
  );
};

export default NaturalParallaxGrid;
