import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useClipboard } from '../../hooks/useClipboard';
import { useTitle } from '../../hooks/useTitle';
import TableOfContents from '../../components/TableOfContents';

const Template4 = ({ project }) => {
  const { id } = useParams();
  useTitle(`项目详情 ${id}`);

  const { copiedId, copy } = useClipboard();
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // 使用传入的 project 数据，如果未传入则使用默认值（防止报错）
  const templateData = project || {
    title: `Project Title ${id}`,
    subtitle: 'Project Subtitle / Brief Description Placeholder',
    description: 'Detailed project description goes here. This is a generic template layout.',
    categories: []
  };

  // 滚动到指定区域
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section (从 Template1 移植的全屏沉浸式) */}
      <div style={{ position: 'relative', height: '90vh', background: '#111', color: '#fff', overflow: 'hidden', marginBottom: '80px' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, background: 'linear-gradient(45deg, #222, #444)' }}>
           {templateData.cover && <img src={templateData.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div style={{ position: 'absolute', bottom: '100px', left: '60px', maxWidth: '900px' }}>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ fontSize: '6em', margin: 0, lineHeight: 1, letterSpacing: '-2px' }}>
            {templateData.name || templateData.title}
          </motion.h1>
          <p style={{ fontSize: '1.5em', opacity: 0.8, marginTop: '20px', marginBottom: '40px' }}>
            {templateData.description || templateData.subtitle}
          </p>
          
          {/* 锚点导航 */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {templateData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                style={{
                  padding: '10px 25px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(5px)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 分类内容区域 (通用版) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {templateData.categories.map((cat) => (
          <section key={cat.id} id={cat.id} style={{ marginBottom: '120px' }}>
            {/* 分类标题 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: '40px', borderLeft: '4px solid #000', paddingLeft: '20px' }}
            >
              <h2 style={{ fontSize: '2.5em', fontWeight: '800', margin: 0 }}>{cat.title}</h2>
            </motion.div>

            {/* 卡片网格 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
              gap: '30px' 
            }}>
              {cat.items.map((item) => (
                <div 
                  key={item.id}
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  style={{ 
                    perspective: '1000px',
                    cursor: 'pointer',
                    height: '340px'
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
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      display: 'flex', flexDirection: 'column',
                      overflow: 'hidden'
                    }}>
                      {/* 图片占位符 */}
                      <div style={{ 
                        flex: 1,
                        background: '#f0f0f0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#ccc',
                        fontSize: '1.2em',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <div style={{ width: '40px', height: '40px', background: '#ddd', borderRadius: '50%' }}></div>
                        [Image Placeholder]
                      </div>
                      {/* 文字 */}
                      <div style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontWeight: '700', fontSize: '1.1em' }}>{item.name}</div>
                      </div>
                    </div>

                    {/* === 背面 (Back) === */}
                    <div style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      background: '#000', color: '#fff', borderRadius: '16px',
                      transform: 'rotateY(180deg)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                      padding: '30px', textAlign: 'center',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
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
          </section>
        ))}
      </div>
    </div>
  );
};

export default Template4;