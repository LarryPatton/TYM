import React from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const Work = () => {
  useTitle('作品');

  return (
    <div className="noise-bg" style={{ 
      height: 'calc(100vh - 80px)', 
      padding: '24px 40px 32px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* 紧凑的标题区域 */}
      <div style={{ textAlign: 'center', marginBottom: '24px', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3em', fontWeight: '400', marginBottom: '8px', letterSpacing: '-0.03em' }}>作品.</h1>
        <p style={{ fontSize: '1.1em', color: '#666', lineHeight: '1.5' }}>
          精选项目与实验性创作
        </p>
      </div>

      {/* Main Layout: 2 Columns - 自适应剩余高度 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '24px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        alignItems: 'stretch',
        flex: 1,
        width: '100%',
        minHeight: 0
      }}>
        
        {/* Left Column: Featured Case Study (Dominant) */}
        <Link to="/work/the-case" style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
          <motion.div 
            whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            style={{ 
              background: '#fff', 
              padding: '40px', 
              borderRadius: '16px', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid #eee',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box',
              flex: 1
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '250px', height: '250px', background: 'radial-gradient(circle at top right, #f5f5f5 0%, transparent 70%)', opacity: 0.5 }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.8em', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Featured Case Study</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', fontWeight: '400', marginBottom: '20px', lineHeight: '1.1' }}>精选案例研究</h2>
              <p style={{ fontSize: '1.1em', color: '#666', lineHeight: '1.7', maxWidth: '380px' }}>
                一个涵盖品牌策略、UI 设计、CMF、包装和营销的完整 0-1 旅程。
                <br/><br/>
                <strong style={{ color: '#111' }}>Project GENESIS</strong>
              </p>
            </div>
            <div style={{ marginTop: '24px', fontWeight: '500', fontSize: '1.1em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              查看案例研究 <span style={{ fontSize: '1.2em' }}>→</span>
            </div>
          </motion.div>
        </Link>

        {/* Right Column: Gallery Modules */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px',
          minHeight: 0
        }}>
          
          <div style={{ fontSize: '0.8em', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', flexShrink: 0 }}>
            Art Gallery
          </div>

          {/* Form Module Card */}
          <Link to="/gallery/form" style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex' }}>
            <motion.div 
              whileHover={{ y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
              style={{ 
                background: '#fff', 
                padding: '24px', 
                borderRadius: '16px', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #eee',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                flex: 1
              }}
            >
              <div>
                <div style={{ fontSize: '0.75em', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Module A</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6em', fontWeight: '400', marginBottom: '8px', lineHeight: '1.1' }}>造型 Form</h2>
                <p style={{ fontSize: '0.95em', color: '#666', fontStyle: 'italic' }}>"纸笔摩擦中的灵光乍现"</p>
              </div>
              <div style={{ marginTop: '16px', fontWeight: '500', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
                进入造型 <span style={{ fontSize: '1.1em' }}>→</span>
              </div>
            </motion.div>
          </Link>

          {/* Photo Module Card */}
          <Link to="/gallery/photo" style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex' }}>
            <motion.div 
              whileHover={{ y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
              style={{ 
                background: '#fff', 
                padding: '24px', 
                borderRadius: '16px', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #eee',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                flex: 1
              }}
            >
              <div>
                <div style={{ fontSize: '0.75em', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Module B</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6em', fontWeight: '400', marginBottom: '8px', lineHeight: '1.1' }}>摄影 Photo</h2>
                <p style={{ fontSize: '0.95em', color: '#666', fontStyle: 'italic' }}>"定格记忆的时光标本"</p>
              </div>
              <div style={{ marginTop: '16px', fontWeight: '500', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
                进入摄影 <span style={{ fontSize: '1.1em' }}>→</span>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Work;