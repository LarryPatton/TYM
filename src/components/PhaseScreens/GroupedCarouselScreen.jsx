import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLenisScrollProgress } from '../../hooks/useLenisScroll';

// ========== 工具函数：线性插值（替代 framer-motion useTransform） ==========
function interpolate(value, inputRange, outputRange) {
  if (inputRange.length !== outputRange.length || inputRange.length < 2) {
    return outputRange[0];
  }
  // clamp to range
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];
  // find segment
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const t = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      const out0 = outputRange[i];
      const out1 = outputRange[i + 1];
      // 支持数字和带单位的字符串（如 '80%', 'blur(8px)'）
      if (typeof out0 === 'number' && typeof out1 === 'number') {
        return out0 + (out1 - out0) * t;
      }
      // 字符串：提取数字部分做插值
      const num0 = parseFloat(out0);
      const num1 = parseFloat(out1);
      if (!isNaN(num0) && !isNaN(num1)) {
        const interpolatedNum = num0 + (num1 - num0) * t;
        // 保留单位/格式（如 '80%' → '%', 'blur(8px)' → 'blur(Xpx)'）
        if (typeof out0 === 'string' && out0.includes('blur(')) {
          return `blur(${interpolatedNum.toFixed(1)}px)`;
        }
        if (typeof out0 === 'string' && out0.includes('%')) {
          return `${interpolatedNum.toFixed(2)}%`;
        }
        return interpolatedNum;
      }
      // fallback: 直接返回最近的值
      return t < 0.5 ? out0 : out1;
    }
  }
  return outputRange[outputRange.length - 1];
}

/**
 * GroupedCarouselScreen - 滚动驱动分组轮播展示（Lenis 驱动版）
 * 
 * 特点：
 * 1. 三组素材依次切换聚焦
 * 2. Lenis 平滑滚动驱动场景切换（左右横向）
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
  rowGap = '24px',
  showGroupLabel = true,
  showItemCount = true,
  showScreenLabel = false,
  aspectRatio = '1 / 1'
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
  
  // Lenis 驱动的滚动进度（0~1 数值）
  const { progress } = useLenisScrollProgress(containerRef, ["start start", "end end"]);

  const totalGroups = groups.length;
  if (totalGroups === 0) return null;

  // 计算每个组的滚动区间（包含进入、停顿、离开三个阶段）
  const getGroupRange = (index) => {
    const segmentSize = 1 / totalGroups;
    const start = index * segmentSize;
    const end = (index + 1) * segmentSize;
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {groups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              viewport={{ once: true, margin: "-10%" }}
            >
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

  // 桌面端：Lenis 驱动的滚动切换
  return (
    <div 
      ref={containerRef}
      style={{
        height: `${totalGroups * 200}vh`,
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
        
        {showScreenLabel && screenNumber && (
          <div style={{
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
          </div>
        )}

        {/* 分组指示器 */}
        <GroupIndicator 
          groups={groups} 
          progress={progress} 
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
              progress={progress}
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
 * 分组指示器（Lenis 驱动）
 */
const GroupIndicator = ({ groups, progress, totalGroups, getGroupRange, showLabel = true }) => {
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
        
        return (
          <IndicatorDot
            key={`indicator-${index}`}
            index={index}
            label={group.label}
            progress={progress}
            range={range}
            showLabel={showLabel}
          />
        );
      })}
    </div>
  );
};

/**
 * 单个指示器点（Lenis 驱动）
 */
const IndicatorDot = ({ index, label, progress, range, showLabel = true }) => {
  const opacity = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.3, 1, 1, 0.3]
  );
  
  const scale = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.8, 1.2, 1.2, 0.8]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity,
        transform: `scale(${scale})`,
        transition: 'opacity 0.05s, transform 0.05s',
        willChange: 'opacity, transform'
      }}
    >
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#fff'
      }} />
      {showLabel && label && (
        <span style={{
          fontSize: '0.7rem',
          color: '#fff',
          whiteSpace: 'nowrap'
        }}>
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * 单组场景（Lenis 驱动版 - 横向切换 + 停顿）
 */
const GroupScene = ({ group, index, progress, totalGroups, getGroupRange, isLastGroup, rowGap = '24px', showGroupLabel = true, showItemCount = true, aspectRatio = '1 / 1' }) => {
  const range = getGroupRange(index);
  
  // 基于 Lenis progress 计算各属性值
  const opacity = interpolate(
    progress,
    [range.start - 0.05, range.start, range.enterEnd, range.holdEnd, range.end, range.end + 0.05],
    [0, 0.3, 1, 1, 0.3, 0]
  );
  
  const scale = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [0.9, 1, 1, 0.9]
  );
  
  const xPercent = interpolate(
    progress,
    [range.start - 0.05, range.start, range.enterEnd, range.holdEnd, range.end, range.end + 0.05],
    [80, 30, 0, 0, -30, -80]
  );

  const blurPx = interpolate(
    progress,
    [range.start, range.enterEnd, range.holdEnd, range.end],
    [8, 0, 0, 8]
  );

  const images = group.images || [];
  const imageCount = images.length;
  
  const customLayout = group.layout;
  
  const getGridLayout = () => {
    if (isLastGroup) {
      return { columns: imageCount, rows: 1 };
    }
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
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `translateX(${xPercent}%) scale(${scale})`,
        filter: `blur(${blurPx.toFixed(1)}px)`,
        pointerEvents: 'none',
        willChange: 'opacity, transform, filter'
      }}
    >
      {/* 组标题 */}
      {showGroupLabel && group.label && (
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 300,
          color: '#fff',
          marginBottom: '32px',
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}>
          {group.label}
        </h3>
      )}
      
      {/* 图片网格 */}
      {customLayout ? (
        (() => {
          const rowCount = customLayout.rows.length;
          const multiRowScale = rowCount > 1 ? (customLayout.multiRowScale || 0.7) : 1;
          const customRowGap = customLayout.rowGap || (rowCount > 1 ? '8px' : rowGap);
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: customRowGap,
              width: '90%',
              padding: '0 24px',
              maxHeight: rowCount > 1 ? '65vh' : 'auto'
            }}>
              {customLayout.rows.map((rowConfig, rowIndex) => {
                const rowImages = images.slice(
                  customLayout.rows.slice(0, rowIndex).reduce((sum, r) => sum + r.count, 0),
                  customLayout.rows.slice(0, rowIndex + 1).reduce((sum, r) => sum + r.count, 0)
                );
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
                        <div
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
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })()
      ) : (
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
              <div
                key={`img-${index}-${imgIndex}`}
                style={{
                  aspectRatio: aspectRatio,
                  overflow: 'hidden',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-image, 12px)'
                }}
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
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {/* 图片计数 */}
      {showItemCount && (
        <div style={{
          marginTop: '24px',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '2px'
        }}>
          {imageCount} ITEMS
        </div>
      )}
    </div>
  );
};

export default GroupedCarouselScreen;