import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MAX_WIDTH_WIDE } from './Common';

/**
 * ============================================
 * 屏幕: 组件展示网格 (ComponentShowcaseScreen) - 三轮滚动叙事版
 * ============================================
 * 素材分配逻辑（最终版）：
 * - subImages[0-1]: Kit 系列（Motor Device + Single Box）
 * - mainImages + subImages[2]: Motor POD（产品颜色变体 + POD 设备）
 * - subImages[3]: POD Single Box
 * - subImages[4]: POD Outer Box
 * 
 * 展示顺序：
 * 1. 第一轮：核心理念文案（无小标题）
 * 2. 第二轮：Touch Motor × Kit（2张图 + 标签）
 * 3. 第三轮：Motor POD（分组展示 + 各组标签）
 * ============================================
 */
export const ComponentShowcaseScreen = ({
  screenNumber,
  screenLabel,
  title,
  content,
  emphasis,
  mainImages = [], // POD 产品颜色变体
  subImages = [],  // [0-1]: Kit 系列, [2]: POD设备, [3]: Single Box, [4]: Outer Box
  bgAlt = false,
  // 三轮文案配置
  rounds = [
    {
      subtitle: null,
      lines: [
        '一致性并非限制，而是品牌识别的基础。',
        '在 Touch Motor 中，',
        '核心视觉元素被完整保留，',
        '以确保品牌在不同产品中依然清晰可辨。'
      ]
    },
    { subtitle: 'Touch Motor × Kit', lines: null },
    { subtitle: 'Motor POD', lines: null }
  ]
}) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ========== 素材分配（简化版）==========
  const kitImages = subImages.slice(0, 2);
  
  // Motor POD = subImages[3] (紫色POD设备) - 删除颜色变体
  const motorPod = subImages[3];
  // POD Single Box = subImages[2] (紫色小包装盒)
  const podSingleBox = subImages[2];
  // POD Outer Box = subImages[4] (紫色大包装盒)
  const podOuterBox = subImages[4];

  // --- 动画配置 ---
  const round1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.25, 0.33], [0, 1, 1, 0]);
  const round1Y = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.33], [60, 0, 0, -60]);

  const round2Opacity = useTransform(scrollYProgress, [0.33, 0.42, 0.58, 0.66], [0, 1, 1, 0]);
  const round2Y = useTransform(scrollYProgress, [0.33, 0.42, 0.58, 0.66], [60, 0, 0, -60]);

  const round3Opacity = useTransform(scrollYProgress, [0.66, 0.75, 0.92, 1], [0, 1, 1, 0]);
  const round3Y = useTransform(scrollYProgress, [0.66, 0.75, 0.92, 1], [60, 0, 0, 0]);

  // 渲染文案轮次（第一轮）
  const renderTextRound = () => {
    const round = rounds[0];
    return (
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: round1Opacity,
          y: round1Y,
          padding: '0 var(--space-2xl)',
          textAlign: 'center'
        }}
      >
        <div style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '24px'
        }}>
          {screenNumber} / {screenLabel}
        </div>

        <div style={{ maxWidth: '700px' }}>
          {round.lines?.map((line, index) => (
            <p
              key={index}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: '300',
                lineHeight: 1.6,
                color: index === 0 ? '#fff' : 'rgba(255,255,255,0.85)',
                margin: 0,
                marginBottom: index < round.lines.length - 1 ? '4px' : 0
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染 Kit 轮次 - 优化布局
  const renderKitRound = () => {
    const round = rounds[1];
    
    return (
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: round2Opacity,
          y: round2Y,
          padding: '40px 60px'
        }}
      >
        {/* 标题区 */}
        <div style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '6px'
          }}>
            Product Line 01
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: '400',
            color: '#fff',
            letterSpacing: '0.5px',
            margin: 0
          }}>
            {round.subtitle}
          </h3>
        </div>

        {/* Kit 图片区 - 更大更充实 */}
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '48px',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          {kitImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                height: '100%',
                maxHeight: '55vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
              }}
            >
              <img 
                src={`${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`}
                alt={image.label}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(100% - 40px)',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              {/* 标签 */}
              <div style={{
                marginTop: '16px',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                {index === 0 ? 'Motor Device' : 'Single Box'}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染 POD 轮次 - 分组展示
  const renderPodRound = () => {
    const round = rounds[2];
    
    return (
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: round3Opacity,
          y: round3Y,
          padding: '40px 48px'
        }}
      >
        {/* 标题区 */}
        <div style={{
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '6px'
          }}>
            Product Line 02
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: '400',
            color: '#fff',
            letterSpacing: '0.5px',
            margin: 0
          }}>
            {round.subtitle}
          </h3>
        </div>

        {/* POD 分组展示区 - 图片填满高度，列宽按素材比例自适应，整体居中 */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center', // 水平居中
          alignItems: 'flex-end', // 底部标签对齐
          gap: '10px',
          height: '50vh'
        }}>
          {/* 组1: Motor POD */}
          {motorPod && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%'
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0
              }}>
                <img 
                  src={`${import.meta.env.BASE_URL}${motorPod.src.replace(/^\//, '')}`}
                  alt="Motor POD"
                  style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1px',
                flexShrink: 0
              }}>
                Motor POD
              </div>
            </div>
          )}

          {/* 组2: POD Single Box */}
          {podSingleBox && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%'
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0
              }}>
                <img 
                  src={`${import.meta.env.BASE_URL}${podSingleBox.src.replace(/^\//, '')}`}
                  alt="POD Single Box"
                  style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1px',
                flexShrink: 0
              }}>
                POD Single Box
              </div>
            </div>
          )}

          {/* 组3: POD Outer Box */}
          {podOuterBox && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%'
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0
              }}>
                <img 
                  src={`${import.meta.env.BASE_URL}${podOuterBox.src.replace(/^\//, '')}`}
                  alt="POD Outer Box"
                  style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1px',
                flexShrink: 0
              }}>
                POD Outer Box
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      ref={containerRef}
      style={{
        height: '400vh',
        position: 'relative',
        background: '#000' // 统一纯黑背景
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        color: '#fff'
      }}>
        {renderTextRound()}
        {renderKitRound()}
        {renderPodRound()}
      </div>
    </div>
  );
};

export default ComponentShowcaseScreen;