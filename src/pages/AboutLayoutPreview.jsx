import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import AnimatedSignature from '../components/AnimatedSignature';

/**
 * About 页面布局预览 - 供用户选择第一屏布局方案
 * 访问路径: /about-layouts
 */
const AboutLayoutPreview = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedLayout, setSelectedLayout] = useState(null);

  const colors = {
    bg: isDark ? '#0a0a0a' : '#fafafa',
    bgAlt: isDark ? '#111' : '#f5f5f5',
    text: isDark ? '#fff' : '#111',
    textMuted: isDark ? '#888' : '#666',
    textLight: isDark ? '#555' : '#999',
    border: isDark ? '#333' : '#ddd',
    accent: isDark ? '#fff' : '#111',
    cardBg: isDark ? '#1a1a1a' : '#fff',
  };

  // 模拟数据
  const greeting = t('about.greeting') || "Hello, I'm Lumi";
  const intro1 = t('about.introLine1') || "A designer who believes in the power of simplicity.";
  const intro2 = t('about.introLine2') || "Creating meaningful experiences through design.";

  // 布局容器样式
  const layoutContainerStyle = {
    background: colors.cardBg,
    border: `2px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '40px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const selectedStyle = {
    borderColor: colors.accent,
    boxShadow: isDark ? '0 0 30px rgba(255,255,255,0.1)' : '0 0 30px rgba(0,0,0,0.1)',
  };

  const labelStyle = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    padding: '6px 14px',
    background: colors.accent,
    color: isDark ? '#000' : '#fff',
    borderRadius: '100px',
    fontSize: '0.75rem',
    fontWeight: '600',
    zIndex: 10,
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.bg, 
      padding: '120px clamp(20px, 5vw, 80px) 80px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: '400', 
            color: colors.text,
            marginBottom: '16px'
          }}>
            About 第一屏布局方案
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>
            请选择您喜欢的布局方案，选中后告诉我方案编号
          </p>
        </div>

        {/* ========== 方案 A: 三栏并列 ========== */}
        <motion.div 
          style={{ 
            ...layoutContainerStyle, 
            ...(selectedLayout === 'A' ? selectedStyle : {})
          }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedLayout('A')}
        >
          <div style={labelStyle}>方案 A - 三栏并列</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 200px 1.2fr', 
            gap: '40px', 
            alignItems: 'center',
            minHeight: '320px',
            paddingTop: '30px',
          }}>
            {/* 左：签名 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AnimatedSignature isDark={isDark} width={280} height={174} duration={2} strokeWidth={1.2} />
            </div>
            {/* 中：头像 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                width: '100%', 
                maxWidth: '180px', 
                aspectRatio: '3/4', 
                borderRadius: '12px', 
                background: colors.bgAlt, 
                border: `1px solid ${colors.border}`,
                overflow: 'hidden'
              }}>
                <img src="/images/about/portrait.jpg" alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </div>
            {/* 右：文字 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '400', color: colors.text, marginBottom: '16px' }}>{greeting}</h2>
              <p style={{ color: colors.textMuted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '8px' }}>{intro1}</p>
              <p style={{ color: colors.textMuted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>{intro2}</p>
              <button style={{ padding: '10px 24px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '100px', fontSize: '0.9rem', cursor: 'pointer' }}>Download Resume</button>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: colors.textLight, fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ 最紧凑 | ✓ 三元素平衡 | ✓ 适合宽屏
          </p>
        </motion.div>

        {/* ========== 方案 B: 签名叠加头像 ========== */}
        <motion.div 
          style={{ 
            ...layoutContainerStyle, 
            ...(selectedLayout === 'B' ? selectedStyle : {})
          }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedLayout('B')}
        >
          <div style={labelStyle}>方案 B - 签名叠加头像</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '280px 1fr', 
            gap: '50px', 
            alignItems: 'center',
            minHeight: '320px',
            paddingTop: '30px',
          }}>
            {/* 左：头像 + 签名叠加 */}
            <div style={{ position: 'relative' }}>
              {/* 签名悬浮在头像上方 */}
              <div style={{ 
                position: 'absolute', 
                top: '-40px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                zIndex: 2,
              }}>
                <AnimatedSignature isDark={isDark} width={220} height={137} duration={2} strokeWidth={1} />
              </div>
              <div style={{ 
                width: '100%', 
                aspectRatio: '3/4', 
                borderRadius: '16px', 
                background: colors.bgAlt, 
                border: `1px solid ${colors.border}`,
                overflow: 'hidden',
                marginTop: '60px',
              }}>
                <img src="/images/about/portrait.jpg" alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </div>
            {/* 右：文字 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '400', color: colors.text, marginBottom: '20px' }}>{greeting}</h2>
              <p style={{ color: colors.textMuted, fontSize: '1rem', lineHeight: 1.8, marginBottom: '10px' }}>{intro1}</p>
              <p style={{ color: colors.textMuted, fontSize: '1rem', lineHeight: 1.8, marginBottom: '28px' }}>{intro2}</p>
              <button style={{ padding: '12px 28px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '100px', fontSize: '0.95rem', cursor: 'pointer' }}>Download Resume</button>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: colors.textLight, fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ 签名作为装饰元素 | ✓ 视觉层次丰富 | ✓ 适合方形/竖屏
          </p>
        </motion.div>

        {/* ========== 方案 C: 左侧组合 | 右侧文字 ========== */}
        <motion.div 
          style={{ 
            ...layoutContainerStyle, 
            ...(selectedLayout === 'C' ? selectedStyle : {})
          }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedLayout('C')}
        >
          <div style={labelStyle}>方案 C - 左侧组合 | 右侧文字</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '320px 1fr', 
            gap: '60px', 
            alignItems: 'center',
            minHeight: '320px',
            paddingTop: '30px',
          }}>
            {/* 左：签名 + 头像 纵向排列 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <AnimatedSignature isDark={isDark} width={240} height={149} duration={2} strokeWidth={1} />
              <div style={{ 
                width: '70%', 
                aspectRatio: '3/4', 
                borderRadius: '12px', 
                background: colors.bgAlt, 
                border: `1px solid ${colors.border}`,
                overflow: 'hidden'
              }}>
                <img src="/images/about/portrait.jpg" alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </div>
            {/* 右：文字 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '400', color: colors.text, marginBottom: '20px' }}>{greeting}</h2>
              <p style={{ color: colors.textMuted, fontSize: '1rem', lineHeight: 1.8, marginBottom: '10px' }}>{intro1}</p>
              <p style={{ color: colors.textMuted, fontSize: '1rem', lineHeight: 1.8, marginBottom: '28px' }}>{intro2}</p>
              <button style={{ padding: '12px 28px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '100px', fontSize: '0.95rem', cursor: 'pointer' }}>Download Resume</button>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: colors.textLight, fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ 传统两栏布局 | ✓ 左侧个人标识完整 | ✓ 结构清晰
          </p>
        </motion.div>

        {/* ========== 方案 D: 纯水平 - 头像左 | 签名+文字右 ========== */}
        <motion.div 
          style={{ 
            ...layoutContainerStyle, 
            ...(selectedLayout === 'D' ? selectedStyle : {})
          }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedLayout('D')}
        >
          <div style={labelStyle}>方案 D - 头像左 | 签名+文字右</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '220px 1fr', 
            gap: '50px', 
            alignItems: 'center',
            minHeight: '320px',
            paddingTop: '30px',
          }}>
            {/* 左：头像 */}
            <div style={{ 
              width: '100%', 
              aspectRatio: '3/4', 
              borderRadius: '16px', 
              background: colors.bgAlt, 
              border: `1px solid ${colors.border}`,
              overflow: 'hidden'
            }}>
              <img src="/images/about/portrait.jpg" alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            {/* 右：签名 + 文字 */}
            <div>
              <AnimatedSignature isDark={isDark} width={300} height={186} duration={2} strokeWidth={1.2} />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '400', color: colors.text, marginBottom: '16px', marginTop: '10px' }}>{greeting}</h2>
              <p style={{ color: colors.textMuted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '8px' }}>{intro1}</p>
              <p style={{ color: colors.textMuted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>{intro2}</p>
              <button style={{ padding: '10px 24px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '100px', fontSize: '0.9rem', cursor: 'pointer' }}>Download Resume</button>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: colors.textLight, fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ 头像突出 | ✓ 签名与文字结合 | ✓ 阅读流畅
          </p>
        </motion.div>

        {/* ========== 方案 E: 优化当前布局 ========== */}
        <motion.div 
          style={{ 
            ...layoutContainerStyle, 
            ...(selectedLayout === 'E' ? selectedStyle : {})
          }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedLayout('E')}
        >
          <div style={labelStyle}>方案 E - 优化当前布局（签名居中+两栏）</div>
          <div style={{ paddingTop: '30px', minHeight: '320px' }}>
            {/* 顶部：签名居中（缩小） */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <AnimatedSignature isDark={isDark} width={320} height={199} duration={2} strokeWidth={1.2} />
            </div>
            {/* 下方：头像 + 文字 */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '40px', alignItems: 'center' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '3/4', 
                borderRadius: '12px', 
                background: colors.bgAlt, 
                border: `1px solid ${colors.border}`,
                overflow: 'hidden'
              }}>
                <img src="/images/about/portrait.jpg" alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '400', color: colors.text, marginBottom: '14px' }}>{greeting}</h2>
                <p style={{ color: colors.textMuted, fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '6px' }}>{intro1}</p>
                <p style={{ color: colors.textMuted, fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '18px' }}>{intro2}</p>
                <button style={{ padding: '10px 22px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '100px', fontSize: '0.85rem', cursor: 'pointer' }}>Download Resume</button>
              </div>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: colors.textLight, fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ 保持原有结构 | ✓ 缩小尺寸 | ✓ 间距压缩
          </p>
        </motion.div>

        {/* ========== 方案 F: 极简两栏 - 无头像 ========== */}
        <motion.div 
          style={{ 
            ...layoutContainerStyle, 
            ...(selectedLayout === 'F' ? selectedStyle : {})
          }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedLayout('F')}
        >
          <div style={labelStyle}>方案 F - 极简两栏（无头像）</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '60px', 
            alignItems: 'center',
            minHeight: '280px',
            paddingTop: '30px',
          }}>
            {/* 左：签名 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AnimatedSignature isDark={isDark} width={360} height={224} duration={2} strokeWidth={1.3} />
            </div>
            {/* 右：文字 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: '400', color: colors.text, marginBottom: '24px' }}>{greeting}</h2>
              <p style={{ color: colors.textMuted, fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '12px' }}>{intro1}</p>
              <p style={{ color: colors.textMuted, fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '32px' }}>{intro2}</p>
              <button style={{ padding: '14px 32px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '100px', fontSize: '1rem', cursor: 'pointer' }}>Download Resume</button>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: colors.textLight, fontSize: '0.85rem', textAlign: 'center' }}>
            ✓ 最简洁 | ✓ 签名作为视觉主角 | ✓ 无头像干扰
          </p>
        </motion.div>

        {/* 选中提示 */}
        {selectedLayout && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              position: 'fixed', 
              bottom: '30px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              padding: '16px 32px',
              background: colors.accent,
              color: isDark ? '#000' : '#fff',
              borderRadius: '100px',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: isDark ? '0 10px 40px rgba(255,255,255,0.2)' : '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            已选择方案 {selectedLayout}，请告诉我您的选择
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AboutLayoutPreview;
