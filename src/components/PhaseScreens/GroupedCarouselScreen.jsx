import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ========== 渲染调试工具 ==========
const useRenderCount = (componentName, props = {}) => {
  const renderCount = useRef(0);
  const prevPropsRef = useRef(props);
  
  renderCount.current += 1;
  
  // 检测哪些 props 发生了变化
  const changedProps = [];
  Object.keys(props).forEach(key => {
    if (prevPropsRef.current[key] !== props[key]) {
      changedProps.push(key);
    }
  });
  prevPropsRef.current = props;
  
  console.log(
    `%c[RENDER] ${componentName} #${renderCount.current}`,
    'color: #ff6b6b; font-weight: bold;',
    changedProps.length > 0 ? `| Changed props: ${changedProps.join(', ')}` : ''
  );
  
  return renderCount.current;
};

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
 * 移动端优化：
 * - 改为垂直堆叠展示所有分组
 * - 禁用横向切换动画
 * - 简化为普通滚动
 * 
 * @param {Array} groups - 分组数组 [{label, images: [{src, label}]}]
 * @param {string} bgColor - 背景颜色
 * @param {boolean} showGroupLabel - 是否显示分组标题（默认 true）
 * @param {boolean} showItemCount - 是否显示图片计数（默认 true）
 */
export const GroupedCarouselScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  groups = [],
  bgColor = '#000',
  rowGap = '24px',           // 自定义行间距，默认 24px
  showGroupLabel = true,     // 是否显示分组标题
  showItemCount = true,      // 是否显示图片计数
  showScreenLabel = false,   // 是否显示顶部屏幕标识（默认隐藏，由胶囊导航显示）
  aspectRatio = '1 / 1'      // 图片容器宽高比，默认正方形
}) => {
  // ========== 渲染调试 ==========
  const renderCount = useRenderCount('GroupedCarouselScreen', {
    screenNumber,
    screenLabel,
    title,
    groupsLength: groups.length,
    bgColor,
    rowGap,
    showGroupLabel,
    showItemCount,
    aspectRatio
  });
  
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
  
  // 滚动进度监听
  // 调整 offset：容器顶部接近视口顶部时就开始（提前触发第一组动画）
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end end"]
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

  // 移动端：简化为垂直堆叠布局
  if (isMobile) {
    return (
      <section
        ref={containerRef}
        style={{
          background: bgColor,
          padding: '60px 20px 80px',
          color: '#fff'
        }}
      >
        {/* 屏幕标识 */}
        {screenNumber && (
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            {screenNumber && screenLabel ? `${screenNumber} / ${screenLabel}` : (screenNumber || screenLabel)}
          </div>
        )}

        {/* 分组垂直展示 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {groups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              viewport={{ once: true, margin: "-10%" }}
            >
              {/* 组标题 */}
              {group.label && (
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: '#fff',
                  marginBottom: '20px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  {group.label}
                </h3>
              )}
              
              {/* 图片网格 - 移动端 2 列 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {(group.images || []).map((img, imgIndex) => (
                  <div
                    key={`img-${groupIndex}-${imgIndex}`}
                    style={{
                      aspectRatio: '1 / 1',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                      alt={img.label || `Image ${imgIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-image, 12px)'
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // 桌面端：保持原有的滚动驱动横向切换效果
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
        
        {/* 屏幕标识 - 由 showScreenLabel 控制（默认隐藏，改用胶囊导航显示） */}
        {showScreenLabel && screenNumber && (
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

        {/* 分组指示器 - 始终显示（包括标签文字） */}
        <GroupIndicator 
          groups={groups} 
          scrollYProgress={scrollYProgress} 
          totalGroups={totalGroups}
          getGroupRange={getGroupRange}
          showLabel={true}
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
              isLastGroup={index === totalGroups - 1}
              rowGap={rowGap}
              showGroupLabel={showGroupLabel}
              showItemCount={showItemCount}
              aspectRatio={aspectRatio}
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
const GroupIndicator = ({ groups, scrollYProgress, totalGroups, getGroupRange, showLabel = true }) => {
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
            showLabel={showLabel}
          />
        );
      })}
    </div>
  );
};

/**
 * 单个指示器点
 */
const IndicatorDot = ({ index, label, scrollYProgress, range, center, showLabel = true }) => {
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
      {/* 标签文字 - 受 showLabel 控制 */}
      {showLabel && label && (
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
const GroupScene = ({ group, index, scrollYProgress, totalGroups, getGroupRange, isLastGroup, rowGap = '24px', showGroupLabel = true, showItemCount = true, aspectRatio = '1 / 1' }) => {
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
  
  // 支持自定义布局配置（优先级高于自动布局）
  const customLayout = group.layout; // 期待格式：{ rows: [{count: 5, scale: 1}, {count: 3, scale: 1.3}] }
  
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
      {/* 组标题 - 可通过 showGroupLabel 控制 */}
      {showGroupLabel && group.label && (
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
      
      {/* 图片网格 - 支持自定义分行布局 */}
      {customLayout ? (
        // 自定义布局：按行渲染，每行有不同的数量和尺寸
        // 多行时缩小尺寸，避免遮挡指示器和标题
        (() => {
          const rowCount = customLayout.rows.length;
          // 支持自定义多行缩放比例，默认 0.7
          const multiRowScale = rowCount > 1 ? (customLayout.multiRowScale || 0.7) : 1;
          // 支持自定义行间距，默认多行 12px
          const customRowGap = customLayout.rowGap || (rowCount > 1 ? '8px' : rowGap);
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: customRowGap,
              width: '90%',
              padding: '0 24px',
              maxHeight: rowCount > 1 ? '65vh' : 'auto' // 多行时限制最大高度
            }}>
              {customLayout.rows.map((rowConfig, rowIndex) => {
                const rowImages = images.slice(
                  customLayout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0),
                  customLayout.rows.slice(0, rowIndex + 1).reduce((sum, r) => sum + r.count, 0)
                );
                // 多行时缩小图片尺寸
                const adjustedScale = rowConfig.scale * multiRowScale;
                return (
                  <div
                    key={`row-${rowIndex}`}
                    style={{
                      display: 'flex',
                      gap: rowCount > 1 ? '12px' : '16px',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {rowImages.map((img, imgIndex) => {
                      const globalIndex = customLayout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0) + imgIndex;
                      return (
                        <motion.div
                          key={`img-${index}-${globalIndex}`}
                          style={{
                            width: `${adjustedScale * 120}px`,
                            height: `${adjustedScale * 120}px`,
                            overflow: 'hidden',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-image, 12px)'
                          }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: globalIndex * 0.08, duration: 0.4 }}
                        >
                          <img
                            src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                            alt={img.label || `Image ${globalIndex + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block',
                              borderRadius: 'var(--radius-image, 12px)',
                              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))'
                            }}
                            onError={(e) => {
                              console.error('GroupedCarousel image load error:', img.src);
                              e.target.style.display = 'none';
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })()
      ) : (
        // 默认网格布局
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isLastGroup ? '24px' : '16px',
          maxWidth: isLastGroup ? '90%' : '1200px',
          width: '90%',
          padding: '0 24px'
        }}>
          {images.map((img, imgIndex) => {
            const hasVariantSuffix = img.src.includes('-1');
            const imageScale = hasVariantSuffix ? 1 : 1.2;
            
            return (
              <motion.div
                key={`img-${index}-${imgIndex}`}
                style={{
                  aspectRatio: aspectRatio, // 使用传入的宽高比
                  overflow: 'hidden',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-image, 12px)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: imgIndex * 0.08, duration: 0.4 }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                  alt={img.label || `Image ${imgIndex + 1}`}
                  style={{
                    width: `${imageScale * 100}%`,
                    height: `${imageScale * 100}%`,
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 'var(--radius-image, 12px)',
                    filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))'
                  }}
                  onError={(e) => {
                    console.error('GroupedCarousel image load error:', img.src);
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* 图片计数 - 可通过 showItemCount 控制 */}
      {showItemCount && (
        <motion.div style={{
          marginTop: '24px',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '2px'
        }}>
          {imageCount} ITEMS
        </motion.div>
      )}
    </motion.div>
  );
};

export default GroupedCarouselScreen;