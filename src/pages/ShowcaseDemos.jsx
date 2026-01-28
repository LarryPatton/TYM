import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 布局方案数据
const schemes = [
  { id: 1, name: 'Classic Split', nameCn: '左右分屏', desc: '经典的左文右图分屏布局，适合讲故事型的案例展示' },
  { id: 2, name: 'Overlapping Layers', nameCn: '交错层叠', desc: '图文交错层叠，视差滚动效果增添层次感' },
  { id: 3, name: 'Magazine Style', nameCn: '杂志排版', desc: '大胆的杂志风格排版，文字与图片的戏剧性对比' },
  { id: 4, name: 'Immersive Fullscreen', nameCn: '全屏沉浸', desc: '全屏背景切换，营造沉浸式浏览体验' },
  { id: 5, name: 'Asymmetric Grid', nameCn: '非对称网格', desc: '打破常规的非对称网格布局，现代感十足' },
  { id: 6, name: 'Minimalist Card', nameCn: '极简卡片', desc: '干净的卡片设计，聚焦内容本身' },
  { id: 7, name: 'Diagonal / Z-Pattern', nameCn: '对角线', desc: 'Z字形视觉流动，引导用户阅读路径' },
  { id: 8, name: 'Typography Driven', nameCn: '文字主导', desc: '以大字体为主导的设计，强调文字的表现力' },
  { id: 9, name: 'Sidebar / Sticky', nameCn: '侧边导航', desc: '固定侧边栏导航，便于快速定位内容' },
  { id: 10, name: 'Gallery Slider', nameCn: '画廊幻灯片', desc: '横向滚动的画廊式布局，适合作品集展示' },
];

// 其他演示链接
const otherDemos = [
  { path: '/scrollytelling-demo', name: 'Scrollytelling Techniques', desc: '滚动讲故事技术演示（29种基础效果）' },
  { path: '/scrollytelling-advanced', name: 'Scrollytelling Advanced', desc: '进阶滚动叙事技术（26种新效果）' },
  { path: '/scrollytelling-expert', name: 'Scrollytelling Expert', desc: '专家级滚动叙事技术（7种前沿效果）' },
];

// 交互演示
const interactionDemos = [
  { path: '/demo/mouse-cursor', name: 'Mouse & Cursor', desc: '鼠标与光标交互效果' },
  { path: '/demo/scroll-navigation', name: 'Scroll & Navigation', desc: '滚动与导航效果' },
  { path: '/demo/content-transition', name: 'Content & Transitions', desc: '内容过渡动画' },
  { path: '/demo/visual-effects', name: 'Visual Effects', desc: '视觉特效演示' },
  { path: '/demo/immersive-gallery', name: 'Immersive 3D Gallery', desc: '沉浸式 3D 画廊 (New Direction 1)' },
  { path: '/demo/timeline', name: 'Micro-interaction Timeline', desc: '微交互时间轴 (New Direction 2)' },
  { path: '/demo/data-storytelling', name: 'Data Storytelling', desc: '数据可视化叙事 (New Direction 3)' },
  { path: '/demo/liquid-theme', name: 'Liquid Theme Transition', desc: '流体主题切换 (New Direction 4)' },
  { path: '/demo/interactive-background', name: 'Interactive Magnetic Field', desc: '交互式磁场背景 (New Direction 5)' },
  { path: '/showcase-demos/color-reveal', name: 'Color Reveal (Particle)', desc: '粒子汇聚色彩揭示 (Plan C)' },
];

const ShowcaseDemos = () => {
  const [hoveredScheme, setHoveredScheme] = useState(null);
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(true);
  const [isInteractionExpanded, setIsInteractionExpanded] = useState(true);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#fff',
      padding: '80px 60px'
    }}>
      {/* 页面标题 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '60px' }}
      >
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          margin: '0 0 20px 0',
          letterSpacing: '-1px'
        }}>
          Showcase Demos
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666',
          maxWidth: '600px',
          lineHeight: 1.6
        }}>
          探索不同的布局方案和交互效果，为您的项目找到最佳的展示方式。
        </p>
      </motion.div>

      {/* Layout Schemes 区块 */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ marginBottom: '60px' }}
      >
        {/* 可折叠标题 */}
        <div 
          onClick={() => setIsLayoutExpanded(!isLayoutExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            paddingBottom: '20px',
            borderBottom: '1px solid #222',
            marginBottom: '30px',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              margin: 0,
              color: '#fff'
            }}>
              Layout Schemes
            </h2>
            <span style={{ 
              fontSize: '0.9rem', 
              color: '#666',
              background: '#1a1a1a',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              {schemes.length} 种布局
            </span>
          </div>
          <span style={{ 
            fontSize: '0.8rem',
            color: '#666',
            transform: isLayoutExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>▼</span>
        </div>

        {/* 布局方案网格 */}
        <div style={{ 
          maxHeight: isLayoutExpanded ? '2000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {schemes.map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/showcase-demos/${scheme.id}`}
                  onMouseEnter={() => setHoveredScheme(scheme.id)}
                  onMouseLeave={() => setHoveredScheme(null)}
                  style={{
                    display: 'block',
                    padding: '30px',
                    background: hoveredScheme === scheme.id ? '#1a1a1a' : '#111',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: '#fff',
                    border: '1px solid #222',
                    transition: 'all 0.3s ease',
                    transform: hoveredScheme === scheme.id ? 'translateY(-4px)' : 'translateY(0)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '15px'
                  }}>
                    <span style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      color: '#444',
                      fontFamily: 'monospace'
                    }}>
                      {String(scheme.id).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        margin: 0,
                        color: hoveredScheme === scheme.id ? '#fff' : '#ccc'
                      }}>
                        {scheme.name}
                      </h3>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#666'
                      }}>
                        {scheme.nameCn}
                      </span>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#666',
                    margin: 0,
                    lineHeight: 1.5
                  }}>
                    {scheme.desc}
                  </p>
                  <div style={{
                    marginTop: '15px',
                    fontSize: '0.85rem',
                    color: hoveredScheme === scheme.id ? '#888' : '#444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    查看演示 →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 其他演示链接 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ marginBottom: '60px' }}
      >
        <h2 style={{ 
          fontSize: '1.5rem', 
          margin: '0 0 20px 0',
          color: '#fff',
          paddingBottom: '20px',
          borderBottom: '1px solid #222'
        }}>
          Other Techniques
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {otherDemos.map((demo, index) => (
            <Link
              key={index}
              to={demo.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 25px',
                background: '#111',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#fff',
                border: '1px solid #222',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1a1a1a';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>→ {demo.name}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{demo.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Interaction Demos 区块 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* 可折叠标题 */}
        <div 
          onClick={() => setIsInteractionExpanded(!isInteractionExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            paddingBottom: '20px',
            borderBottom: '1px solid #222',
            marginBottom: '20px',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              margin: 0,
              color: '#fff'
            }}>
              Interaction Demos
            </h2>
            <span style={{ 
              fontSize: '0.9rem', 
              color: '#666',
              background: '#1a1a1a',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              {interactionDemos.length} 个演示
            </span>
          </div>
          <span style={{ 
            fontSize: '0.8rem',
            color: '#666',
            transform: isInteractionExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>▼</span>
        </div>

        {/* 交互演示列表 */}
        <div style={{ 
          maxHeight: isInteractionExpanded ? '500px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease-in-out'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {interactionDemos.map((demo, index) => (
              <Link
                key={index}
                to={demo.path}
                style={{
                  display: 'block',
                  padding: '20px',
                  background: '#111',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: '#fff',
                  border: '1px solid #222',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1a1a1a';
                  e.currentTarget.style.borderColor = '#333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#111';
                  e.currentTarget.style.borderColor = '#222';
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>• {demo.name}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>{demo.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ 
          marginTop: '80px',
          paddingTop: '40px',
          borderTop: '1px solid #222',
          textAlign: 'center',
          color: '#444'
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          选择一个布局方案开始探索 →
        </p>
      </motion.footer>
    </div>
  );
};

export default ShowcaseDemos;
