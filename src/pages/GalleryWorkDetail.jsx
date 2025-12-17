import React from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link, useParams } from 'react-router-dom';

const GalleryWorkDetail = () => {
  const { module, submodule, slug } = useParams();
  const isForm = module === 'form';
  
  useTitle(`作品详情 - ${slug}`);

  const submoduleTitle = {
    'new-china-painter': '新国画人',
    'mixed-media': '综合材料',
    'illustration-story': '插画故事',
    'stylized-board': '风格化板绘',
    'product': '产品摄影',
    'landscape': '风景摄影'
  }[submodule] || submodule;

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      
      {/* Breadcrumb & Nav */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9em', color: '#999' }}>
          <Link to="/gallery" style={{ textDecoration: 'none', color: '#999' }}>画廊</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <Link to={`/gallery/${module}`} style={{ textDecoration: 'none', color: '#999' }}>{isForm ? '造型' : '摄影'}</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <Link to={`/gallery/${module}/${submodule}`} style={{ textDecoration: 'none', color: '#999' }}>{submoduleTitle}</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <span style={{ color: '#111', fontWeight: '500' }}>作品 {slug}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '8px 15px', border: '1px solid #eee', background: 'transparent', borderRadius: '8px', cursor: 'pointer' }}>← 上一件</button>
          <button style={{ padding: '8px 15px', border: '1px solid #eee', background: 'transparent', borderRadius: '8px', cursor: 'pointer' }}>下一件 →</button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '60px', marginBottom: '120px' }}>
        
        {/* Left: Visuals */}
        <div>
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#f0f0f0', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
            [ 主视觉大图 ]
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eee' }}>
                [ 细节 {i} ]
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', fontWeight: '400', marginBottom: '20px', lineHeight: '1.1' }}>作品标题 {slug}</h1>
          
          <div style={{ marginBottom: '30px', fontSize: '0.95em', color: '#666', lineHeight: '1.8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>年份</span>
              <span style={{ color: '#111' }}>2023</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>媒介</span>
              <span style={{ color: '#111' }}>{isForm ? '数字绘画' : '数码摄影'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>尺寸</span>
              <span style={{ color: '#111' }}>Variable</span>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <p style={{ color: '#444', lineHeight: '1.6' }}>
              这里是关于作品的简短描述。阐述创作动机、使用的技术或背后的故事。保持在 3-5 行以内。
            </p>
          </div>

          {/* Capability Tags (New Component) */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '0.8em', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              能力标签
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['#造型探索', '#构图实验', '#色彩语言', '#KV潜力', '#品牌延展'].map(tag => (
                <span key={tag} style={{ 
                  fontSize: '0.85em', 
                  color: '#111', 
                  background: '#fff', 
                  border: '1px solid #eee', 
                  padding: '4px 10px', 
                  borderRadius: '4px' 
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['#标签1', '#标签2', '#标签3'].map(tag => (
              <span key={tag} style={{ fontSize: '0.85em', color: '#999' }}>{tag}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Related Works */}
      <section style={{ borderTop: '1px solid #eee', paddingTop: '60px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2em', fontWeight: '400', marginBottom: '40px' }}>同系列作品</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              [ 相关 {i} ]
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default GalleryWorkDetail;