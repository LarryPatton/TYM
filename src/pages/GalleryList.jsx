import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const GalleryList = () => {
  useTitle('画廊');

  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('最新');

  const categories = ['全部', '平面设计', '插画', '动态设计', '3D 艺术', '实验性'];

  // Mock Data
  const galleryItems = [
    { id: 'g1', title: '霓虹城市', category: '3D 艺术', image: '#111', height: '300px' },
    { id: 'g2', title: '抽象图形', category: '平面设计', image: '#222', height: '400px' },
    { id: 'g3', title: '角色研究', category: '插画', image: '#333', height: '350px' },
    { id: 'g4', title: 'Logo 合集', category: '平面设计', image: '#444', height: '300px' },
    { id: 'g5', title: '动态字体', category: '动态设计', image: '#555', height: '450px' },
    { id: 'g6', title: '海报系列', category: '平面设计', image: '#666', height: '380px' },
    { id: 'g7', title: '超现实景观', category: '3D 艺术', image: '#777', height: '320px' },
    { id: 'g8', title: '每日渲染', category: '实验性', image: '#888', height: '400px' },
  ];

  const filteredItems = activeCategory === '全部' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div style={{ padding: '40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3em', fontWeight: '900', marginBottom: '30px' }}>画廊.</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: activeCategory === cat ? '1px solid #000' : '1px solid #eee',
                  background: activeCategory === cat ? '#000' : '#fff',
                  color: activeCategory === cat ? '#fff' : '#666',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '0.9em',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }}
          >
            <option value="最新">最新</option>
            <option value="热门">热门</option>
          </select>
        </div>
      </div>

      {/* Masonry Grid (Simulated with CSS Grid) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        gridAutoRows: '10px' // Base unit for masonry calculation
      }}>
        {filteredItems.map(item => {
          // Calculate row span based on height (approximate for simulation)
          const rowSpan = Math.ceil(parseInt(item.height) / 10) + 5; 
          
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{ 
                gridRowEnd: `span ${rowSpan}`,
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <Link to={`/work/gallery/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div style={{ 
                  background: item.image, 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.2em',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{item.category}</div>
                  </div>
                  [ 图片 ]
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryList;