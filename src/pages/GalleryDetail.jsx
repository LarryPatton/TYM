import React, { useState } from 'react';
import { useTitle } from '../hooks/useTitle';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GalleryDetail = () => {
  const { slug } = useParams();
  useTitle(`画廊: ${slug}`);

  const [currentImage, setCurrentImage] = useState(0);

  // Mock Data
  const item = {
    title: '霓虹城市',
    year: '2023',
    role: '3D 艺术家',
    category: '3D 艺术',
    description: '使用 Blender 中的程序化生成技术探索赛博朋克美学。目标是创造一种规模感和氛围感。',
    highlights: [
      '被 3D World 杂志收录',
      'ArtStation 本周最佳',
      '用作 Synthwave 专辑封面'
    ],
    links: [
      { label: 'ArtStation', url: '#' },
      { label: 'Instagram', url: '#' },
      { label: '过程视频', url: '#' }
    ],
    images: ['#111', '#222', '#333'] // Mock image colors
  };

  return (
    <div style={{ padding: '40px 0' }}>
      {/* Header / Navigation */}
      <div style={{ marginBottom: '40px' }}>
        <Link to="/work/gallery" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ← 返回画廊
        </Link>
      </div>

      {/* Main Visual Area */}
      <div style={{ marginBottom: '60px' }}>
        <motion.div 
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            background: item.images[currentImage], 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2em',
            marginBottom: '20px',
            position: 'relative'
          }}
        >
          [ 主视觉 {currentImage + 1} ]
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentImage(prev => (prev > 0 ? prev - 1 : item.images.length - 1))}
            style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', color: '#fff', fontSize: '1.5em' }}
          >
            ‹
          </button>
          <button 
            onClick={() => setCurrentImage(prev => (prev < item.images.length - 1 ? prev + 1 : 0))}
            style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', color: '#fff', fontSize: '1.5em' }}
          >
            ›
          </button>
        </motion.div>

        {/* Thumbnails */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {item.images.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentImage(idx)}
              style={{ 
                width: '80px', 
                height: '60px', 
                background: img, 
                borderRadius: '8px', 
                cursor: 'pointer',
                border: currentImage === idx ? '2px solid #000' : '2px solid transparent',
                opacity: currentImage === idx ? 1 : 0.6
              }}
            />
          ))}
        </div>
      </div>

      {/* Info Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px', marginBottom: '100px' }}>
        <div>
          <h1 style={{ fontSize: '3em', fontWeight: '900', marginBottom: '10px' }}>{item.title}</h1>
          <div style={{ fontSize: '1.2em', color: '#666', marginBottom: '30px' }}>{item.year} • {item.category}</div>
          <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444', marginBottom: '40px' }}>
            {item.description}
          </p>
          
          <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '20px' }}>亮点</h3>
          <ul style={{ lineHeight: '1.8', color: '#444', paddingLeft: '20px' }}>
            {item.highlights.map((hl, i) => (
              <li key={i}>{hl}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '16px', height: 'fit-content' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ color: '#999', fontSize: '0.9em', marginBottom: '5px' }}>角色</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{item.role}</div>
          </div>
          
          <div>
            <div style={{ color: '#999', fontSize: '0.9em', marginBottom: '15px' }}>链接</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {item.links.map((link, i) => (
                <a key={i} href={link.url} style={{ color: '#000', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Works */}
      <section style={{ borderTop: '1px solid #eee', paddingTop: '60px' }}>
        <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '30px' }}>更多类似作品</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ aspectRatio: '1/1', background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              [ 相关 {i} ]
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GalleryDetail;