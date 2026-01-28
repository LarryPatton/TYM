import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TableOfContents = ({ categories }) => {
  const [activeId, setActiveId] = useState('');

  // 监听滚动，高亮当前 Section
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 200; // 偏移量，确保标题进入视口上方时触发

      let current = '';
      sections.forEach(section => {
        if (section && section.offsetTop <= scrollPosition) {
          current = section.id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      right: '40px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'none', // 默认隐藏，大屏显示
      '@media (min-width: 1200px)': { display: 'block' } // 注意：React 内联样式不支持媒体查询，这里仅作示意，实际需配合 CSS 或逻辑判断
    }} className="toc-container">
      {/* 使用简单的逻辑判断屏幕宽度，或者直接在 Layout 中控制显示 */}
      <div style={{ 
        background: 'var(--color-surface)', 
        backdropFilter: 'blur(10px)',
        padding: '20px', 
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        maxWidth: '200px'
      }}>
        <div style={{ fontSize: '0.8em', fontWeight: 'bold', color: 'var(--color-text-light)', marginBottom: '10px', textTransform: 'uppercase' }}>
          Contents
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {categories.map((cat) => (
            <li key={cat.id} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => scrollTo(cat.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  color: activeId === cat.id ? 'var(--color-text-main)' : 'var(--color-text-light)',
                  fontWeight: activeId === cat.id ? '600' : '400',
                  padding: '4px 0',
                  transition: 'all var(--transition-fast)',
                  borderLeft: activeId === cat.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                  paddingLeft: '10px',
                  width: '100%'
                }}
              >
                {cat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableOfContents;
