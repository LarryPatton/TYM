import React from 'react';
import { motion } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_MEDIUM } from './Common';

// ============================================
// 屏幕: 原则展示 (PrinciplesScreen)
// 用于展示设计原则、核心要点（如 Phase 01 的三原则）
// ============================================
export const PrinciplesScreen = ({ 
  screenNumber, 
  screenLabel, 
  title, 
  principles = [] // [{ key, title, desc }]
}) => (
  <section style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SECTION_PADDING,
    background: 'var(--color-bg-alt)'
  }}>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{ maxWidth: MAX_WIDTH_MEDIUM, width: '100%' }}
    >
      {/* 屏幕编号 */}
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: 'var(--space-lg)'
      }}>
        {screenNumber} / {screenLabel}
      </div>
      
      {/* 标题 */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-h1)',
        fontWeight: '400',
        marginBottom: 'var(--space-3xl)',
        lineHeight: 'var(--line-height-snug)'
      }}>
        {title}
      </h2>
      
      {/* 原则卡片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(principles.length, 3)}, 1fr)`,
        gap: 'var(--space-2xl)'
      }} className="principles-grid">
        {principles.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }} // 增加延迟，形成阶梯效果
            viewport={{ once: true }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }} // 添加悬停上浮效果
            style={{
              padding: 'var(--space-xl)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {/* 原则图标区域 - 使用不同的图片和样式区分 */}
            <div style={{
                aspectRatio: '16/10',
                marginBottom: 'var(--space-lg)',
                background: index === 0 
                  ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' 
                  : index === 1 
                    ? 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)'
                    : 'linear-gradient(135deg, #dee2e6 0%, #ced4da 100%)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                 <img 
                    src={`${import.meta.env.BASE_URL}images/Phase 01 — Brand Identity 0–1/02/image ${index === 0 ? '1' : '6'}.png`}
                    alt={item.title}
                    style={{ 
                      width: '70%', 
                      height: '70%', 
                      objectFit: 'contain',
                      filter: index === 1 ? 'hue-rotate(30deg)' : index === 2 ? 'hue-rotate(60deg)' : 'none',
                      transform: index === 1 ? 'scale(0.9)' : index === 2 ? 'scale(0.85) rotate(3deg)' : 'scale(1)'
                    }}
                    onError={(e) => e.target.style.display = 'none'} 
                 />
                 {/* 序号标识 */}
                 <div style={{
                   position: 'absolute',
                   top: '16px',
                   right: '16px',
                   fontSize: 'var(--text-xs)',
                   color: 'var(--color-text-light)',
                   fontWeight: '600',
                   letterSpacing: '1px'
                 }}>
                   0{index + 1}
                 </div>
            </div>

            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-h2)',
              marginBottom: 'var(--space-md)',
              fontWeight: '500'
            }}>
              {item.title}
            </div>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-body)',
              lineHeight: 'var(--line-height-relaxed)',
              margin: 0
            }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);
