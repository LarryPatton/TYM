import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

// 模拟页面内容组件
const PageContent = ({ theme }) => {
  const isDark = theme === 'dark';
  const bg = isDark ? '#111' : '#f0f0f0';
  const text = isDark ? '#fff' : '#111';
  const accent = isDark ? '#00ff88' : '#0066ff';
  const cardBg = isDark ? '#222' : '#fff';

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      background: bg, 
      color: text,
      padding: '40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>LIQUID THEME</div>
          <nav style={{ display: 'flex', gap: '30px' }}>
            <Link to="/showcase-demos" style={{ color: text, textDecoration: 'none' }}>Back</Link>
            <span>Work</span>
            <span>About</span>
          </nav>
        </header>

        <main>
          <h1 style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '40px' }}>
            Design is <span style={{ color: accent }}>Intelligence</span><br />
            Made Visible.
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginTop: '80px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ 
                background: cardBg, 
                padding: '30px', 
                borderRadius: '20px',
                boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)'
              }}>
                <div style={{ width: '50px', height: '50px', background: accent, borderRadius: '12px', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Feature {i}</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
                  Seamless transitions create a sense of continuity and polish in your digital product.
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const LiquidThemeDemo = () => {
  const [theme, setTheme] = useState('dark');
  const [nextTheme, setNextTheme] = useState(null); // 正在过渡到的主题
  const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  const toggleTheme = async (e) => {
    if (nextTheme) return; // 防止重复点击

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX; // - rect.left; // 使用全局坐标更准确
    const y = e.clientY; // - rect.top;
    
    setMaskPosition({ x, y });
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setNextTheme(newTheme);

    // 开始扩散动画
    await controls.start({
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(250% at ${x}px ${y}px)`
      ],
      transition: { duration: 0.8, ease: [0.645, 0.045, 0.355, 1.000] } // cubic-bezier
    });

    // 动画结束，更新主状态并重置
    setTheme(newTheme);
    setNextTheme(null);
    controls.set({ clipPath: `circle(0px at 0px 0px)` });
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* 底层：当前主题 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <PageContent theme={theme} />
      </div>

      {/* 顶层：下一主题（通过 clip-path 遮罩显示） */}
      {nextTheme && (
        <motion.div 
          animate={controls}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 2,
            clipPath: `circle(0px at ${maskPosition.x}px ${maskPosition.y}px)`
          }}
        >
          <PageContent theme={nextTheme} />
        </motion.div>
      )}

      {/* 切换按钮 (悬浮在最上层) */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          bottom: '50px',
          right: '50px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: theme === 'dark' ? '#fff' : '#111',
          color: theme === 'dark' ? '#111' : '#fff',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>

    </div>
  );
};

export default LiquidThemeDemo;
