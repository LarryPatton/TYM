import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================
// 屏幕: Phase 封底 (PhaseClosingScreen)
// 布局: 全屏背景图 + 中心文案 + 底部导航按钮
// 用途: 作为每个 Phase 的最后一屏，提供阶段总结和导航
// 支持: sticky 模式 - 整屏固定，滚动一定距离后释放
// 新增: 百叶窗入场过渡效果
// 
// 移动端优化:
// - 禁用 sticky 效果
// - 禁用百叶窗效果
// - 调整按钮布局为垂直堆叠
// - 调整文字大小和间距
// ============================================

// 百叶窗配置
const BLINDS_CONFIG = {
  count: 15,           // 条带数量
  fromColor: '#000',   // 条带颜色（黑色，与上一屏背景融合）
  animStart: 0.1,        // 动画开始进度
  animEnd: 0.88         // 动画结束进度（在滚动 40% 时完成过渡）
};

export const PhaseClosingScreen = ({ 
  bgImage,                              // 背景图片路径
  nextPhase,                            // 下一阶段信息 { id, titleZh }
  backLabel = '返回目录',                // 返回按钮文字
  nextLabel = '下一阶段',                // 下一步按钮文字
  onNavigate,                           // 导航回调函数
  sticky = false,                       // 是否启用 sticky 效果
  stickyHeight = 50,                   // sticky 模式下的滚动高度（单位 vh）
  enableBlinds = true,                  // 是否启用百叶窗过渡效果
  blindsHeight = 100                    // 百叶窗过渡区高度（单位 vh），0 表示无额外高度
}) => {
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  
  // 滚动进度追踪（用于百叶窗动画）
  // 根据是否有过渡区高度，使用不同的 offset
  const hasBlindsTransition = enableBlinds && blindsHeight > 0 && !isMobile;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // 有过渡区时：动画在过渡区内完成
    // 无过渡区时：动画在进入视口时完成
    offset: hasBlindsTransition 
      ? ["start end", "start start"]  // 从底部进入到顶部到达视口顶部
      : ["start 150%", "start 50%"]   // 原有逻辑
  });
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 生成百叶窗条带
  const blinds = Array.from({ length: BLINDS_CONFIG.count }, (_, i) => i);

  // 内容渲染函数（支持移动端适配）
  const renderContent = () => (
    <>
      {/* 背景图片 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}${bgImage.replace(/^\//, '')}`}
          alt="Phase Closing"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          onError={(e) => {
              e.target.style.display = 'none';
          }}
        />
        {/* 底部渐变遮罩，让文字和按钮更清晰 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isMobile 
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* 中心内容区域 - 标题 */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '30%' : '35%',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transform: 'translateY(-50%)',
          padding: isMobile ? '0 24px' : '0'
        }}
      >
        <p style={{
          fontSize: isMobile ? '1.1rem' : 'var(--text-h3)',
          fontWeight: '300',
          color: '#fff',
          maxWidth: isMobile ? '100%' : '600px',
          lineHeight: '1.6',
          letterSpacing: isMobile ? '0.5px' : '1px',
          margin: 0
        }}>
          视觉系统已建立，为后续产品与传播提供坚实基础。
        </p>
      </div>

      {/* 导航按钮 */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? '20%' : '25%',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : 'var(--space-xl)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '0 24px' : '0'
        }}
      >
        <button
          onClick={() => onNavigate?.('/work/the-case')}
          style={{
            padding: isMobile ? '12px 28px' : '14px 36px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 'var(--radius-full)',
            color: '#fff',
            fontSize: isMobile ? '0.85rem' : 'var(--text-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '280px' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.background = 'rgba(255,255,255,0.25)';
              e.target.style.borderColor = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.background = 'rgba(255,255,255,0.15)';
              e.target.style.borderColor = 'rgba(255,255,255,0.4)';
            }
          }}
        >
          {backLabel}
        </button>

        {nextPhase && (
          <button
            onClick={() => onNavigate?.(`/work/the-case/${nextPhase.id}`)}
            style={{
              padding: isMobile ? '12px 28px' : '14px 36px',
              background: '#fff',
              border: '1px solid #fff',
              borderRadius: 'var(--radius-full)',
              color: '#0a0a0a',
              fontSize: isMobile ? '0.85rem' : 'var(--text-sm)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '280px' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <span>{isMobile ? nextPhase.titleZh : `${nextLabel}: ${nextPhase.titleZh}`}</span>
            <span>→</span>
          </button>
        )}
      </div>
    </>
  );

  // 百叶窗遮罩层渲染
  const renderBlindsOverlay = () => {
    if (isMobile || !enableBlinds) return null;
    
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {blinds.map((index) => (
          <BlindSlat
            key={index}
            index={index}
            totalBlinds={BLINDS_CONFIG.count}
            scrollYProgress={scrollYProgress}
            color={BLINDS_CONFIG.fromColor}
          />
        ))}
      </div>
    );
  };

  // 移动端：禁用 sticky 效果和百叶窗，使用简单布局
  if (isMobile) {
    return (
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#000'
      }}>
        {renderContent()}
      </section>
    );
  }

  // 桌面端 Sticky 模式（带百叶窗过渡）
  if (sticky) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${stickyHeight}vh`,
          position: 'relative',
          background: '#000'
        }}
      >
        <section style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#000'
        }}>
          {renderContent()}
          {renderBlindsOverlay()}
        </section>
      </div>
    );
  }

  // 非 sticky 模式
  // 如果有百叶窗高度，使用带过渡区的布局（hasBlindsTransition 已在上面定义）
  if (hasBlindsTransition) {
    return (
      <div 
        ref={containerRef}
        style={{
          height: `${100 + blindsHeight}vh`, // 尾页高度 + 过渡区高度
          position: 'relative',
          background: '#000'
        }}
      >
        {/* 百叶窗过渡区（纯黑背景 + 百叶窗动画） */}
        <div style={{
          height: `${blindsHeight}vh`,
          position: 'relative',
          background: '#000'
        }}>
          {/* 百叶窗遮罩 - 覆盖整个过渡区 */}
          <div style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            background: '#000'
          }}>
            {renderBlindsOverlay()}
          </div>
        </div>
        
        {/* 实际尾页内容（sticky 固定） */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#000'
        }}>
          {renderContent()}
        </div>
      </div>
    );
  }
  
  // 无过渡区的简单布局
  return (
    <section 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#000'
      }}
    >
      {renderContent()}
      {enableBlinds && renderBlindsOverlay()}
    </section>
  );
};

/**
 * 单个百叶窗条带
 * 初始完全展开，随滚动收缩（从底部向上收缩，揭示内容）
 */
const BlindSlat = ({ 
  index, 
  totalBlinds, 
  scrollYProgress, 
  color 
}) => {
  // 条带高度百分比
  const slatHeight = 100 / totalBlinds;
  
  // 计算条带位置 - 从顶部开始排布
  const topPosition = index * slatHeight;
  
  // 动画时机
  const { animStart, animEnd } = BLINDS_CONFIG;
  const totalAnimRange = animEnd - animStart;
  
  // 错落感：从下到上依次收缩（底部条带先动）
  // 反转索引，让底部的先收缩
  const reverseIndex = totalBlinds - 1 - index;
  const slatAnimDuration = totalAnimRange / totalBlinds * 1.8; // 1.8倍重叠，更流畅
  const slatAnimGap = totalAnimRange / totalBlinds;
  
  const startProgress = animStart + (reverseIndex * slatAnimGap);
  const endProgress = Math.min(startProgress + slatAnimDuration, 1);
  
  // 条带的 scaleY 动画 - 从 1 收缩到 0
  const scaleY = useTransform(
    scrollYProgress,
    [startProgress, endProgress],
    [1, 0]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${topPosition}%`,
        height: `${slatHeight + 0.5}%`, // +0.5% 防止缝隙
        background: color,
        transformOrigin: 'bottom center', // 向下收缩（从底部揭开）
        scaleY,
      }}
    />
  );
};