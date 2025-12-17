import React, { useState, useRef } from 'react';
import { useTitle } from '../hooks/useTitle';

// 模拟复制功能的 Hook
const useClipboard = () => {
  const [copiedId, setCopiedId] = useState(null);
  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  return { copiedId, copy };
};

// 示例数据 - 主题分类
const mockThemesData = {
  '建筑': [
    { id: 'arch_1', name: '现代主义', en: 'Modernism', prompt: 'Modern architecture style with clean lines' },
    { id: 'arch_2', name: '未来城市', en: 'Futuristic City', prompt: 'Futuristic city concept with advanced technology' },
    { id: 'arch_3', name: '解构主义', en: 'Deconstructivism', prompt: 'Deconstructivism architectural style' },
    { id: 'arch_4', name: '极简主义', en: 'Minimalism', prompt: 'Minimalist architecture with simple forms' },
  ],
  '数字艺术': [
    { id: 'digital_1', name: '赛博朋克', en: 'Cyberpunk', prompt: 'Cyberpunk aesthetic with neon lights' },
    { id: 'digital_2', name: '蒸汽波', en: 'Vaporwave', prompt: 'Vaporwave style with retro aesthetics' },
    { id: 'digital_3', name: '像素艺术', en: 'Pixel Art', prompt: 'Pixel art style with 8-bit graphics' },
    { id: 'digital_4', name: '故障艺术', en: 'Glitch Art', prompt: 'Glitch art with digital distortion effects' },
  ],
  '插画': [
    { id: 'illust_1', name: '扁平风格', en: 'Flat Design', prompt: 'Flat illustration style with bold colors' },
    { id: 'illust_2', name: '手绘素描', en: 'Hand Sketch', prompt: 'Hand-drawn sketch style illustration' },
    { id: 'illust_3', name: '矢量插画', en: 'Vector Art', prompt: 'Clean vector illustration style' },
    { id: 'illust_4', name: '水彩风格', en: 'Watercolor', prompt: 'Watercolor painting style illustration' },
  ],
  '摄影': [
    { id: 'photo_1', name: '人像摄影', en: 'Portrait', prompt: 'Professional portrait photography style' },
    { id: 'photo_2', name: '风景摄影', en: 'Landscape', prompt: 'Stunning landscape photography' },
    { id: 'photo_3', name: '街头摄影', en: 'Street', prompt: 'Urban street photography style' },
  ],
};

const ThemeList = () => {
  useTitle('主题库');

  const categories = Object.keys(mockThemesData);
  const [activeTab, setActiveTab] = useState(categories[0]);
  const { copiedId, copy } = useClipboard();
  const [hoveredCardId, setHoveredCardId] = useState(null);
  
  // 网格列数控制状态
  const [gridColumns, setGridColumns] = useState(4);
  const [isControlOpen, setIsControlOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (isControlOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsControlOpen(false);
      }, 1500);
    }
  };

  const handleClick = () => {
    setIsControlOpen(!isControlOpen);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  return (
    <div>
      {/* 头部区域 */}
      <div style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3em', fontWeight: '900', letterSpacing: '-1px', marginBottom: '10px' }}>Theme Library.</h1>
        <p style={{ color: '#666' }}>Explore our curated collection of styles and concepts.</p>
      </div>

      {/* 顶部 Tabs 导航 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '60px',
        padding: '0 20px'
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              padding: '8px 20px',
              border: '1px solid',
              borderColor: activeTab === cat ? '#000' : '#eee',
              background: activeTab === cat ? '#000' : 'transparent',
              color: activeTab === cat ? '#fff' : '#666',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '0.95em',
              fontWeight: activeTab === cat ? '500' : '400',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 内容展示区 */}
      <div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`, 
          gap: '30px',
          transition: 'grid-template-columns 0.3s ease'
        }}>
          {mockThemesData[activeTab]?.map((item, index) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredCardId(item.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              style={{ 
                perspective: '1000px',
                cursor: 'pointer',
                height: '320px'
              }}
            >
              <div style={{
                position: 'relative', width: '100%', height: '100%',
                transition: 'transform 0.6s', 
                transformStyle: 'preserve-3d',
                transform: hoveredCardId === item.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}>
                
                {/* 正面 (Front) */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: '#fff', 
                  display: 'flex', flexDirection: 'column'
                }}>
                  {/* 图片占位 */}
                  <div style={{ 
                    flex: 1,
                    background: index % 2 === 0 ? '#e5e5e5' : '#d5d5d5', 
                    borderRadius: '12px',
                    marginBottom: '15px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#999'
                  }}>
                    [ Preview Image ]
                  </div>
                  {/* 文字 */}
                  <div style={{ textAlign: 'center', height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: '600', fontSize: '1.1em', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85em', color: '#888', fontFamily: 'monospace' }}>{item.en}</div>
                  </div>
                </div>

                {/* 背面 (Back) */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: '#111', color: '#fff', borderRadius: '12px',
                  transform: 'rotateY(180deg)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                  padding: '30px', textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ fontSize: '0.9em', marginBottom: '20px', opacity: 0.8, lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{item.prompt}"
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
                    style={{ 
                      padding: '10px 25px', 
                      borderRadius: '30px', 
                      border: '1px solid rgba(255,255,255,0.3)', 
                      background: copiedId === item.id ? '#fff' : 'transparent', 
                      color: copiedId === item.id ? '#000' : '#fff', 
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copiedId === item.id ? 'Copied!' : 'Copy Prompt'}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 悬浮控制按钮 (左下角) */}
      <div 
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '40px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          padding: isControlOpen ? '10px 20px' : '15px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid #eee'
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isControlOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGridColumns(prev => Math.max(2, prev - 1));
            }}
            style={{
              background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer',
              padding: '0 15px', color: '#333', display: 'flex', alignItems: 'center'
            }}
            title="减少列数"
          >
            −
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>

        {isControlOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGridColumns(prev => Math.min(8, prev + 1));
            }}
            style={{
              background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer',
              padding: '0 15px', color: '#333', display: 'flex', alignItems: 'center'
            }}
            title="增加列数"
          >
            +
          </button>
        )}
      </div>

    </div>
  );
};

export default ThemeList;