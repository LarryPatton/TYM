import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClipboard } from '../../hooks/useClipboard';

const Template3 = ({ project }) => {
  const { copiedId, copy } = useClipboard();
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const templateData = project || {
    name: 'Magazine Project',
    description: 'Collage Hero + Bento Grid Layout',
    categories: []
  };

  return (
    <div>
      {/* Hero: 杂志拼贴 */}
      <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', height: '70vh', background: '#fff', overflow: 'hidden', marginBottom: '80px' }}>
        <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: '5em', margin: '0 0 20px 0', lineHeight: 1 }}>
            {templateData.name || templateData.title}
          </motion.h1>
          <p style={{ color: '#666', fontSize: '1.2em' }}>
            {templateData.description || templateData.subtitle}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', padding: '20px' }}>
          <div style={{ background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>[ Image 1 ]</div>
          <div style={{ background: '#e5e5e5', borderRadius: '12px', gridRow: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>[ Image 2 ]</div>
          <div style={{ background: '#ddd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>[ Image 3 ]</div>
        </div>
      </div>

      {/* Content: Bento Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 100px 40px' }}>
        {templateData.categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '3em', margin: 0, letterSpacing: '-1px' }}>{cat.title}</h2>
              <div style={{ width: '60px', height: '4px', background: '#000', margin: '20px auto' }}></div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gridAutoRows: '280px',
              gap: '20px' 
            }}>
              {cat.items.map((item, index) => {
                let gridStyle = {};
                // 简单的 Bento 逻辑
                if (index === 0) gridStyle = { gridColumn: 'span 2', gridRow: 'span 2' };
                else if (index === 3) gridStyle = { gridColumn: 'span 2', gridRow: 'span 1' };
                else gridStyle = { gridColumn: 'span 1', gridRow: 'span 1' };

                return (
                  <div 
                    key={item.id}
                    onMouseEnter={() => setHoveredCardId(item.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    style={{ 
                      ...gridStyle, 
                      cursor: 'pointer',
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
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: index % 2 === 0 ? '#e5e5e5' : '#d5d5d5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'
                      }}>
                        [ Image ]
                        <div style={{ 
                          position: 'absolute', bottom: '20px', left: '20px',
                          background: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '20px',
                          fontSize: '0.9em', color: '#000'
                        }}>
                          <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                        </div>
                      </div>

                      {/* === 背面 (Back) === */}
                      <div style={{
                        position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                        background: '#111', color: '#fff', borderRadius: '16px',
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
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template3;