import React from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const GalleryHome = () => {
  useTitle('艺术画廊');

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '100px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4em', fontWeight: '400', marginBottom: '20px' }}>艺术画廊</h1>
        <p style={{ fontSize: '1.2em', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          以视觉作品为主的个人创作集合，探索造型与光影的无限可能。
        </p>
      </section>

      {/* Module Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Form Module */}
        <Link to="/gallery/form" style={{ textDecoration: 'none', color: 'inherit' }}>
          <motion.div 
            whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              overflow: 'hidden',
              border: '1px solid #eee',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '40px', flex: 1 }}>
              <div style={{ fontSize: '0.9em', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Module A</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', marginBottom: '10px' }}>造型 Form</h2>
              <p style={{ fontSize: '1.1em', color: '#666', fontStyle: 'italic', marginBottom: '30px' }}>“纸笔摩擦中的灵光乍现”</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
                {['新国画人', '综合材料', '插画故事', '风格化板绘'].map(tag => (
                  <span key={tag} style={{ padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', fontSize: '0.85em', color: '#666' }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ aspectRatio: '1/1', background: '#eee', borderRadius: '8px' }}></div>
                ))}
              </div>
            </div>
            <div style={{ padding: '20px 40px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: '500' }}>进入造型</span>
              <span>→</span>
            </div>
          </motion.div>
        </Link>

        {/* Photo Module */}
        <Link to="/gallery/photo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <motion.div 
            whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              overflow: 'hidden',
              border: '1px solid #eee',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '40px', flex: 1 }}>
              <div style={{ fontSize: '0.9em', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Module B</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', marginBottom: '10px' }}>摄影 Photo</h2>
              <p style={{ fontSize: '1.1em', color: '#666', fontStyle: 'italic', marginBottom: '30px' }}>“定格记忆的时光标本”</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
                {['产品摄影', '风景摄影'].map(tag => (
                  <span key={tag} style={{ padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', fontSize: '0.85em', color: '#666' }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ aspectRatio: '1/1', background: '#eee', borderRadius: '8px' }}></div>
                ))}
              </div>
            </div>
            <div style={{ padding: '20px 40px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <span style={{ fontWeight: '500' }}>进入摄影</span>
              <span>→</span>
            </div>
          </motion.div>
        </Link>

      </div>
    </div>
  );
};

export default GalleryHome;