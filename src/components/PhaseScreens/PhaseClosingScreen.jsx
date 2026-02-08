import React, { useState, useEffect } from 'react';

// ============================================
// 屏幕: Phase 封底 (PhaseClosingScreen)
// 布局: 全屏背景图 + 中心文案 + 底部导航按钮
// 用途: 作为每个 Phase 的最后一屏，提供阶段总结和导航
// 支持: sticky 模式 - 整屏固定，滚动一定距离后释放
// 
// 移动端优化:
// - 禁用 sticky 效果
// - 调整按钮布局为垂直堆叠
// - 调整文字大小和间距
// ============================================
export const PhaseClosingScreen = ({ 
  bgImage,                              // 背景图片路径
  nextPhase,                            // 下一阶段信息 { id, titleZh }
  backLabel = '返回目录',                // 返回按钮文字
  nextLabel = '下一阶段',                // 下一步按钮文字
  onNavigate,                           // 导航回调函数
  sticky = false,                       // 是否启用 sticky 效果
  stickyHeight = 150                    // sticky 模式下的滚动高度（单位 vh）
}) => {
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

  // 移动端：禁用 sticky 效果，使用简单布局
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

  // 桌面端 Sticky 模式
  if (sticky) {
    return (
      <div style={{
        height: `${stickyHeight}vh`,
        position: 'relative',
        background: '#000'
      }}>
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
        </section>
      </div>
    );
  }

  // 非 sticky 模式（原有逻辑）
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
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* 中心内容区域 - 标题 (位于 Logo 上方) */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transform: 'translateY(-50%)'
        }}
      >
        <p style={{
          fontSize: 'var(--text-h3)',
          fontWeight: '300',
          color: '#fff',
          maxWidth: '600px',
          lineHeight: '1.6',
          letterSpacing: '1px',
          margin: 0
        }}>
          视觉系统已建立，为后续产品与传播提供坚实基础。
        </p>
      </div>

      {/* 导航按钮 (位于 Logo 下方) */}
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          gap: 'var(--space-xl)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={() => onNavigate?.('/work/the-case')}
          style={{
            padding: '14px 36px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 'var(--radius-full)',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.25)';
            e.target.style.borderColor = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.15)';
            e.target.style.borderColor = 'rgba(255,255,255,0.4)';
          }}
        >
          {backLabel}
        </button>

        {nextPhase && (
          <button
            onClick={() => onNavigate?.(`/work/the-case/${nextPhase.id}`)}
            style={{
              padding: '14px 36px',
              background: '#fff',
              border: '1px solid #fff',
              borderRadius: 'var(--radius-full)',
              color: '#0a0a0a',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span>{nextLabel}: {nextPhase.titleZh}</span>
            <span>→</span>
          </button>
        )}
      </div>
    </section>
  );
};
