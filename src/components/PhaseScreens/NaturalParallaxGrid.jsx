import React, { useRef } from 'react';
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
  paddingTop = 60,
  bgColor = '#000',
  parallaxIntensity = 0.3
}) => {
  const containerRef = useRef(null);

  // 滚动进度监听（相对于容器的可见范围）
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] // 容器进入视口到完全离开
  });

  // 判断是否使用分组模式
  const isGrouped = groups.length > 0;
  const groupsData = isGrouped ? groups : [{ label: null, images }];

  // 视差位移量（基于 parallaxIntensity）
  const maxOffset = 150 * parallaxIntensity;
  const yFast = useTransform(scrollYProgress, [0, 1], [maxOffset, -maxOffset]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [maxOffset * 0.5, -maxOffset * 0.5]);

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
      {/* 屏幕标识 */}
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
        {screenNumber} / {screenLabel}
        {title && <div style={{ marginTop: '8px', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>{title}</div>}
      </motion.div>

      {/* 分组内容 */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        {groupsData.map((group, groupIndex) => (
          <React.Fragment key={`group-${groupIndex}`}>
            {/* 组标题（可选） */}
            {group.label && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                style={{
                  fontSize: '1.5rem',
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'center',
                  marginBottom: '60px',
                  marginTop: groupIndex > 0 ? '80px' : '40px',
                  textTransform: 'uppercase',
                  letterSpacing: '3px'
                }}
              >
                {group.label}
              </motion.div>
            )}

            {/* 网格容器 */}
            <ParallaxGridGroup
              images={group.images}
              columns={columns}
              gap={gap}
              paddingTop={paddingTop}
              yFast={yFast}
              ySlow={ySlow}
            />

            {/* 组间分隔符（不是最后一组时显示） */}
            {groupIndex < groupsData.length - 1 && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  width: '100%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent)',
                  margin: '100px 0',
                  transformOrigin: 'center'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * ParallaxGridGroup - 单个分组的视差网格
 */
const ParallaxGridGroup = ({ images, columns, gap, paddingTop, yFast, ySlow }) => {
  // 将图片分配到各列
  const columnsData = Array.from({ length: columns }, () => []);
  images.forEach((img, index) => {
    const colIndex = index % columns;
    columnsData[colIndex].push({ ...img, originalIndex: index });
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
        width: '100%'
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
              gap: gap,
              y: yMotion,
              paddingTop: isEvenCol ? '0' : `${paddingTop}px`
            }}
          >
            {colImages.map((img, i) => (
              <GridItem key={`item-${i}`} image={img} />
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
const GridItem = ({ image }) => {
  if (!image) return null;

  return (
    <motion.div
      style={{
        aspectRatio: '1 / 1',
        background: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '8px'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
        alt={image.label || 'Grid Image'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.3))'
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
