import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  MAX_WIDTH_WIDE, 
  sectionVariants, 
  itemVariants, 
  ImagePlaceholder 
} from './Common';

// ============================================
// 屏幕: 对比展示 (ComparisonScreen) - 带 Sticky 停顿
// 左右对比布局，用于展示 A/B 对比或 Before/After
// 优化版：内容精确填满一屏，无溢出
// ============================================
export const ComparisonScreen = ({ 
  id,
  phaseId,
  screenNumber, 
  screenLabel, 
  title, 
  content, 
  note,
  leftHint,
  rightHint,
  leftLabel,
  rightLabel,
  images = [],
  bgAlt = false,
  // 新增：图片垂直位置偏移量（负值向上，正值向下）
  imageOffsetY = -30, // 默认向上偏移 30px
  // 产品差异点配置
  differences = [
    { 
      label: '屏幕尺寸', 
      left: '1.47" TFT 彩屏',
      right: '1.85" AMOLED 触控屏'
    },
    { 
      label: '交互方式', 
      left: '物理按键操控',
      right: '全触控 + 侧键辅助'
    },
    { 
      label: '材质工艺', 
      left: '金属拉丝 + 碳纤维纹理',
      right: '高光渐变 + 透明背壳'
    }
  ],
  showDifferences = true
}) => {
  const containerRef = useRef(null);

  // 真实图片对比渲染 - 紧凑版
  const renderImagesComparison = () => (
    <>
      {images.map((image, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          style={{ 
            position: 'relative',
            height: '100%',
            overflow: 'visible',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
            alt={image.label}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {/* 产品标签 */}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 14px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            {image.label}
          </div>
        </motion.div>
      ))}
    </>
  );

  // 默认对比渲染 (使用占位图)
  const renderDefaultComparison = () => (
    <>
      <motion.div variants={itemVariants} style={{ height: '100%' }}>
        <ImagePlaceholder hint={leftHint} aspectRatio="100%" style={{ height: '100%' }} />
      </motion.div>
      <motion.div variants={itemVariants} style={{ height: '100%' }}>
        <ImagePlaceholder hint={rightHint} aspectRatio="100%" style={{ height: '100%' }} />
      </motion.div>
    </>
  );

  const renderComparisonContent = () => {
    if (images && images.length >= 2) return renderImagesComparison();
    return renderDefaultComparison();
  };

  // 渲染差异点区域 - 紧凑版
  const renderDifferencesSection = () => {
    if (!showDifferences || !differences || differences.length === 0) return null;

    return (
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '0'
        }}>
          {differences.map((diff, index) => (
            <React.Fragment key={index}>
              {/* 左侧产品特性 */}
              <div style={{
                padding: '10px 16px',
                textAlign: 'right',
                borderBottom: index < differences.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <span style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  {diff.left}
                </span>
              </div>

              {/* 中间标签 */}
              <div style={{
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                borderBottom: index < differences.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <span style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  whiteSpace: 'nowrap'
                }}>
                  {diff.label}
                </span>
              </div>

              {/* 右侧产品特性 */}
              <div style={{
                padding: '10px 16px',
                textAlign: 'left',
                borderBottom: index < differences.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <span style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  {diff.right}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 使用 useScroll 监听本 section 的滚动进度，实现淡入效果
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"] // 从进入视口底部到顶部对齐
  });
  
  // 淡入效果：延迟淡入，与第一屏淡出时序重叠
  // 在 20%-60% 进度时完成淡入，确保与上一屏平滑衔接
  const sectionOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  return (
    <div 
      ref={containerRef}
      style={{
        height: '150vh',
        position: 'relative',
        background: '#000' // 统一纯黑背景
      }}
    >
      {/* Sticky 容器 - 精确填满视口，带淡入效果 */}
      <motion.div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start', // 改为顶部对齐，让内容整体上移
        justifyContent: 'center',
        padding: '32px 48px 24px', // 减少底部 padding
        color: '#fff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        opacity: sectionOpacity // 淡入效果
      }}>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ 
            maxWidth: MAX_WIDTH_WIDE, 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* 头部文本 - 紧凑 */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            flexShrink: 0
          }}>
            <motion.div variants={itemVariants}>
              <div style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '12px'
              }}>
                {screenNumber} / {screenLabel}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                fontWeight: '400',
                marginBottom: '10px',
                lineHeight: 1.2,
                color: '#fff'
              }}>
                {title}
              </h2>
              {content && (
                <p style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  maxWidth: '580px',
                  margin: '0 auto'
                }}>
                  {content}
                </p>
              )}
            </motion.div>
          </div>

          {/* 对比区域 - 限制最大高度，支持 Y 轴偏移 */}
          <div style={{
            flex: '1 1 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            alignItems: 'center',
            minHeight: 0,
            maxHeight: 'calc(100% - 180px)', // 为底部差异点预留空间
            transform: `translateY(${imageOffsetY}px)` // 应用 Y 轴偏移
          }}>
            {renderComparisonContent()}
          </div>

          {/* 差异点区域 - 固定在底部 */}
          <div style={{ flexShrink: 0, marginTop: '16px' }}>
            {renderDifferencesSection()}
          </div>

          {/* 底部备注 */}
          {note && (
            <div style={{
              marginTop: '12px',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              fontStyle: 'italic',
              flexShrink: 0
            }}>
              {note}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
