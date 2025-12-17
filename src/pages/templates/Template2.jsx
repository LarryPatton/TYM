import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClipboard } from '../../hooks/useClipboard';
import TableOfContents from '../../components/TableOfContents';

const Template2 = ({ project }) => {
  const { copiedId, copy } = useClipboard();
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // 使用传入的 project 数据，如果未传入则使用默认值
  const templateData = project || {
    name: 'Demo Project',
    description: 'Split Screen Hero + Masonry Layout',
    categories: []
  };

  return (
    <div>
      {/* Hero: 左右分屏 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '80vh', background: '#fff', marginBottom: '80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
          <div style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '20px' }}>Project Detail</div>
          <motion.h1 initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ fontSize: '5em', margin: '0 0 30px 0', color: '#000', lineHeight: 1.1 }}>
            {templateData.name || templateData.title}
          </motion.h1>
          <p style={{ fontSize: '1.2em', color: '#666', lineHeight: 1.6, maxWidth: '500px' }}>
            {templateData.description || templateData.subtitle}
          </p>
        </div>
        <div style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '2em', overflow: 'hidden' }}>
          [ Hero Image ]
        </div>
      </div>

      {/* 侧边悬浮目录 */}
      <TableOfContents categories={templateData.categories} />

      {/* Content: 瀑布流 (Masonry) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 100px 40px' }}>
        {templateData.categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', marginBottom: '40px', borderBottom: '2px solid #000', paddingBottom: '10px', display: 'inline-block' }}>
              {cat.title}
            </h2>
            
            <div style={{ 
              columnCount: 3, 
              columnGap: '20px' 
            }}>
              {cat.items.map((item, index) => (
                <div 
                  key={item.id}
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  style={{ 
                    breakInside: 'avoid', 
                    marginBottom: '20px',
                    cursor: 'pointer',
                    // 随机高度模拟瀑布流效果
                    height: [280, 380, 320, 420, 300, 360][index % 6] + 'px',
                    perspective: '1000px'
                  }}
                >
                  <div style={{
                    position: 'relative', width: '100%', height: '100%',
                    transition: 'transform 0.6s', 
                    transformStyle: 'preserve-3d',
                    transform: hoveredCardId === item.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}>
                    
                    {/* === 正面 (Front) === */}
                    <div style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      background: '#fff', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      display: 'flex', flexDirection: 'column',
                      overflow: 'hidden',
                      border: '1px solid #eee'
                    }}>
                      <div style={{ flex: 1, overflow: 'hidden', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                        [ Image ]
                      </div>
                      <div style={{ padding: '15px', fontWeight: '500' }}>{item.name}</div>
                    </div>

                    {/* === 背面 (Back) === */}
                    <div style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      background: '#111', color: '#fff', borderRadius: '12px',
                      transform: 'rotateY(180deg)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                      padding: '20px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.9em', marginBottom: '20px', opacity: 0.8 }}>"{item.prompt}"</div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
                        style={{ 
                          padding: '8px 20px', borderRadius: '20px', border: '1px solid #fff', 
                          background: copiedId === item.id ? '#fff' : 'transparent', 
                          color: copiedId === item.id ? '#000' : '#fff', 
                          cursor: 'pointer'
                        }}
                      >
                        {copiedId === item.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template2;