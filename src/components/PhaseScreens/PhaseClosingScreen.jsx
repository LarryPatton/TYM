import React from 'react';
import { motion } from 'framer-motion';

// ============================================
// 屏幕: Phase 封底 (PhaseClosingScreen)
// 布局: 全屏背景图 + 中心文案 + 底部导航按钮
// 用途: 作为每个 Phase 的最后一屏，提供阶段总结和导航
// ============================================
export const PhaseClosingScreen = ({ 
  bgImage,                              // 背景图片路径
  nextPhase,                            // 下一阶段信息 { id, titleZh }
  backLabel = '返回目录',                // 返回按钮文字
  nextLabel = '下一阶段',                // 下一步按钮文字
  onNavigate                            // 导航回调函数
}) => {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: '#000' // 统一纯黑背景
    }}>
      {/* 背景图片 */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
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
            console.error('Image load error:', bgImage);
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
      </motion.div>

      {/* 中心内容区域 - 标题 (位于 Logo 上方) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          position: 'absolute',
          top: '35%', // 位于屏幕上方 35% 处
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
      </motion.div>

      {/* 导航按钮 (位于 Logo 下方) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '25%', // 位于屏幕下方 25% 处
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
      </motion.div>
    </section>
  );
};