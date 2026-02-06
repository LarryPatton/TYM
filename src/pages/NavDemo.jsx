import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * 移动端导航栏方案演示页面
 * 展示多种方案供选择
 */
const NavDemo = () => {
  const { t } = useTranslation();
  const [activeScheme, setActiveScheme] = useState('A1');
  const currentPage = '作品';

  const schemes = [
    { id: 'A1', name: '方案A1: 页面名 + 下拉箭头', desc: '点击可打开侧边栏，类似 App 切换' },
    { id: 'A2', name: '方案A2: 只显示页面名', desc: '保留汉堡菜单作为唯一入口' },
    { id: 'A3', name: '方案A3: 双入口', desc: '页面名和汉堡按钮都能打开侧边栏' },
    { id: 'A4', name: '方案A4: 移除汉堡按钮', desc: '只用页面名+箭头作为入口' },
  ];

  // 汉堡按钮组件
  const HamburgerButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <div style={{ width: '24px', height: '18px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: '#333', borderRadius: '1px' }} />
        <span style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: '#333', borderRadius: '1px', transform: 'translateY(-50%)' }} />
        <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: '#333', borderRadius: '1px' }} />
      </div>
    </button>
  );

  // 下拉箭头图标
  const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  // 方案 A1: 页面名 + 下拉箭头
  const SchemeA1 = () => (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 16px',
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontWeight: '900', fontSize: '1.2em', letterSpacing: '-1px' }}>PORTFOLIO.</div>
      
      {/* 中间: 页面名 + 下拉箭头 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 12px',
          background: '#f5f5f5',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '500',
        }}
        onClick={() => alert('打开侧边栏')}
      >
        {currentPage}
        <ChevronDown />
      </motion.button>
      
      {/* 汉堡按钮 - 隐藏或淡化 */}
      <div style={{ width: '44px', opacity: 0.3 }}>
        <HamburgerButton />
      </div>
    </nav>
  );

  // 方案 A2: 只显示页面名
  const SchemeA2 = () => (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 16px',
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontWeight: '900', fontSize: '1.2em', letterSpacing: '-1px' }}>PORTFOLIO.</div>
      
      {/* 中间: 只显示页面名 */}
      <span style={{
        fontSize: '0.95rem',
        fontWeight: '500',
        color: '#333',
      }}>
        {currentPage}
      </span>
      
      <HamburgerButton onClick={() => alert('打开侧边栏')} />
    </nav>
  );

  // 方案 A3: 双入口
  const SchemeA3 = () => (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 16px',
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontWeight: '900', fontSize: '1.2em', letterSpacing: '-1px' }}>PORTFOLIO.</div>
      
      {/* 中间: 页面名可点击 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 12px',
          background: 'transparent',
          border: '1px solid #e0e0e0',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '500',
        }}
        onClick={() => alert('打开侧边栏')}
      >
        {currentPage}
        <ChevronDown />
      </motion.button>
      
      {/* 汉堡按钮 - 也能打开 */}
      <HamburgerButton onClick={() => alert('打开侧边栏')} />
    </nav>
  );

  // 方案 A4: 移除汉堡按钮
  const SchemeA4 = () => (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 16px',
      height: '60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontWeight: '900', fontSize: '1.2em', letterSpacing: '-1px' }}>PORTFOLIO.</div>
      
      {/* 右侧: 页面名 + 下拉箭头 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '24px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '600',
        }}
        onClick={() => alert('打开侧边栏')}
      >
        {currentPage}
        <ChevronDown />
      </motion.button>
    </nav>
  );

  const renderScheme = () => {
    switch (activeScheme) {
      case 'A1': return <SchemeA1 />;
      case 'A2': return <SchemeA2 />;
      case 'A3': return <SchemeA3 />;
      case 'A4': return <SchemeA4 />;
      default: return <SchemeA1 />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f8f8', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        marginBottom: '8px',
        color: '#333',
      }}>
        移动端导航栏方案演示
      </h1>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '0.9rem' }}>
        选择下方的方案查看不同效果
      </p>

      {/* 方案选择器 */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '8px', 
        marginBottom: '24px',
      }}>
        {schemes.map(scheme => (
          <button
            key={scheme.id}
            onClick={() => setActiveScheme(scheme.id)}
            style={{
              padding: '8px 16px',
              background: activeScheme === scheme.id ? '#000' : '#fff',
              color: activeScheme === scheme.id ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            {scheme.id}
          </button>
        ))}
      </div>

      {/* 当前方案描述 */}
      <div style={{
        background: '#e8f4fd',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '24px',
        fontSize: '0.9rem',
      }}>
        <strong>{schemes.find(s => s.id === activeScheme)?.name}</strong>
        <div style={{ color: '#666', marginTop: '4px' }}>
          {schemes.find(s => s.id === activeScheme)?.desc}
        </div>
      </div>

      {/* 导航栏预览 */}
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
      }}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: '#999', 
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          预览效果
        </div>
        {renderScheme()}
      </div>

      {/* 模拟页面内容 */}
      <div style={{
        maxWidth: '400px',
        margin: '24px auto 0',
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <div style={{ 
          width: '60%', 
          height: '20px', 
          background: '#eee', 
          borderRadius: '4px',
          marginBottom: '12px',
        }} />
        <div style={{ 
          width: '100%', 
          height: '12px', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          marginBottom: '8px',
        }} />
        <div style={{ 
          width: '80%', 
          height: '12px', 
          background: '#f5f5f5', 
          borderRadius: '4px',
          marginBottom: '8px',
        }} />
        <div style={{ 
          width: '90%', 
          height: '12px', 
          background: '#f5f5f5', 
          borderRadius: '4px',
        }} />
      </div>

      {/* 方案对比说明 */}
      <div style={{
        maxWidth: '400px',
        margin: '32px auto 0',
        fontSize: '0.85rem',
        color: '#666',
      }}>
        <h3 style={{ fontSize: '1rem', color: '#333', marginBottom: '12px' }}>方案对比：</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>A1</strong>: 胶囊按钮最醒目，汉堡淡化，推荐 ⭐</li>
          <li><strong>A2</strong>: 最简洁，但用户可能不知道点哪里切换</li>
          <li><strong>A3</strong>: 双入口，容错性高，但稍显冗余</li>
          <li><strong>A4</strong>: 最极简，但失去了经典汉堡菜单的识别性</li>
        </ul>
      </div>
    </div>
  );
};

export default NavDemo;
