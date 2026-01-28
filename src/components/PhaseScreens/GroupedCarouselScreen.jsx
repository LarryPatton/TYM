import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * GroupedCarouselScreen - 滚动驱动分组轮播展示（优化版：横向切换 + 停顿）
 * 
 * 特点：
 * 1. 三组素材依次切换聚焦
 * 2. 滚动驱动场景切换（左右横向）
 * 3. 每组有停顿时间（中间静止区域）
 * 4. 第三组强制横向 1×4 排列
 * 5. 当前组高亮，前后组淡出模糊
 * 
 * @param {Array} groups - 分组数组 [{label, images: [{src, label}]}]
 * @param {string} bgColor - 背景颜色
 */
export const GroupedCarouselScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  groups = [],
  bgColor = '#000'
}) => {
  const containerRef = useRef(null);
  
  // 滚动进度监听
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const totalGroups = groups.length;
  if (totalGroups === 0) return null;

  // 计算每个组的滚动区间（包含进入、停顿、离开三个阶段）
  // 每组占用的滚动比例：进入(0.15) + 停顿(0.15) + 离开(0.15) ≈ 0.33
  const getGroupRange = (index) => {
    const segmentSize = 1 / totalGroups;
    const start = index * segmentSize;
    const end = (index + 1) * segmentSize;
    // 返回 [进入开始, 进入结束/停顿开始, 停顿结束/离开开始, 离开结束]
    const enterEnd = start + segmentSize * 0.25;
    const holdEnd = start + segmentSize * 0.75;
    return { start, enterEnd, holdEnd, end };
  };

  return (
    <div 
      ref={containerRef}
      style={{
        height: `${totalGroups * 200}vh`, // 每组 200vh 滚动空间（增加停顿）
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

        {/* 分组指示器 */}
        <GroupIndicator 
          groups={groups} 
          scrollYProgress={scrollYProgress} 
          totalGroups={totalGroups}
          getGroupRange={getGroupRange}
        />

        {/* 分组内容 */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {groups.map((group, index) => (
            <GroupScene
              key={`group-${index}`}
              group={group}
              index={index}
              scrollYProgress={scrollYProgress}
              totalGroups={totalGroups}
              getGroupRange={getGroupRange}
              isLastGroup={index === totalGroups - 1} // 标记最后一组
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 分组指示器
 */
const GroupIndicator = ({ groups, scrollYProgress, totalGroups, getGroupRange }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '50px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '16px',
      zIndex: 20
    }}>
      {groups.map((group, index) => {
        const range = getGroupRange(index);
        const center = (range.enterEnd + range.holdEnd) / 2;
        
        return (
          <IndicatorDot
            key={`indicator-${index}`}
            index={index}
            label={group.label}
            scrollYProgress={scrollYProgress}
            range={range}
            center={center}
          />
        );
      })}
    </div>
  );
};

/**
 * 单个指示器点
 */
const IndicatorDot = ({ index, label, scrollYProgress, range, center }) => {
  // 计算当前点的激活程度
  const opacity = useTransform(
    scrollYProgress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.3, 1, 1, 0.3]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.8, 1.2, 1.2, 0.8]
  );

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity,
        scale
      }}
    >
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#fff'
      }} />
      {label && (
        <span style={{
          fontSize: '0.7rem',
          color: '#fff',
          whiteSpace: 'nowrap'
        }}>
          {label}
        </span>
      )}
    </motion.div>
  );
};

/**
 * 单组场景（横向切换版本）
 */
const GroupScene = ({ group, index, scrollYProgress, totalGroups, getGroupRange, isLastGroup }) => {
  const range = getGroupRange(index);
  
  // 透明度：进入时渐显，停顿时保持，离开时渐隐
  const opacity = useTransform(
    scrollYProgress,
    [range.start - 0.05, range.start, range.enterEnd, range.holdEnd, range.end, range.end + 0.05],
    [0, 0.3, 1, 1, 0.3, 0]
  );
  
  // 缩放：进入时放大到1，停inction时保持，离开时缩小
  const scale = useTransform(
    scrollYProgress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.9, 1, 1, 0.9]
  );
  
  // X 位移：从右侧进入，停顿在中间，向左侧离开
  const x = useTransform(
    scrollYProgress,
    [range.start - 0.05, range.start, range.enterEnd, range.holdEnd, range.end, range.end + 0.05],
    ['80%', '30%', '0%', '0%', '-30%', '-80%']
  );
  
  // 模糊：非停顿状态时模糊
  const blur = useTransform(
    scrollYProgress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']
  );

  const images = group.images || [];
  const imageCount = images.length;
  
  // 根据图片数量决定布局（最后一组强制横排）
  const getGridLayout = () => {
    // 最后一组（第三组）强制横向排列
    if (isLastGroup) {
      return { columns: imageCount, rows: 1 };
    }
    // 其他组的布局逻辑
    if (imageCount <= 3) {
      return { columns: imageCount, rows: 1 };
    } else if (imageCount <= 4) {
      return { columns: 2, rows: 2 };
    } else if (imageCount <= 6) {
      return { columns: 3, rows: 2 };
    } else {
      return { columns: 4, rows: 2 };
    }
  };
  
  const { columns } = getGridLayout();

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        scale,
        x,
        filter: blur,
        pointerEvents: 'none'
      }}
    >
      {/* 组标题 */}
      {group.label && (
        <motion.h3 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: '#fff',
          marginBottom: '32px',
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}>
          {group.label}
        </motion.h3>
      )}
      
      {/* 图片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: isLastGroup ? '24px' : '16px', // 最后一组间距稍大
        maxWidth: isLastGroup ? '90%' : '1200px', // 最后一组横排需要更宽
        width: '90%',
        padding: '0 24px'
      }}>
        {images.map((img, imgIndex) => (
          <motion.div
            key={`img-${index}-${imgIndex}`}
            style={{
              aspectRatio: '1 / 1',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: imgIndex * 0.08, duration: 0.4 }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
              alt={img.label || `Image ${imgIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
              }}
              onError={(e) => {
                console.error('GroupedCarousel image load error:', img.src);
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* 图片计数 */}
      <motion.div style={{
        marginTop: '24px',
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '2px'
      }}>
        {imageCount} ITEMS
      </motion.div>
    </motion.div>
  );
};

export default GroupedCarouselScreen;