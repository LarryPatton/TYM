import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClipboard } from '../hooks/useClipboard';
import { getAssetPath } from '../utils/path';

// 模拟数据
const demoItem = {
  id: 'demo-arch',
  name: '古典建筑',
  en: 'Classical Architecture',
  prompt: 'Classical architecture, greek temple, marble columns, intricate details, epic scale, cinematic lighting, 8k resolution...',
  image_path: '/images/themes/architecture/古典建筑_Classical Architecture.png'
};

// --- 通用卡片容器 ---
const FlipCard = ({ title, BackComponent }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div style={{ width: '260px', height: '340px', perspective: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '10px', textAlign: 'center', fontWeight: 'bold', color: '#666' }}>{title}</div>
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', width: '100%', height: '100%',
          transition: 'transform 0.6s', transformStyle: 'preserve-3d',
          transform: hovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer'
        }}
      >
        {/* 正面 (统一) */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #eee'
        }}>
          <div style={{ flex: 1, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={getAssetPath(demoItem.image_path)} alt={demoItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                 onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerText='[Image]'; }} />
          </div>
          <div style={{ padding: '15px', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>{demoItem.name}</div>
            <div style={{ fontSize: '0.8em', color: '#999' }}>{demoItem.en}</div>
          </div>
        </div>

        {/* 背面 (动态传入) */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: '16px', transform: 'rotateY(180deg)',
          overflow: 'hidden'
        }}>
          <BackComponent item={demoItem} />
        </div>
      </div>
    </div>
  );
};

// --- 方案 1: 透视磨砂 (Translucent Glass - 优化版) ---
const Back1 = ({ item }) => {
  const { copiedId, copy } = useClipboard();
  return (
    <div style={{ 
      width: '100%', height: '100%', position: 'relative',
      overflow: 'hidden' 
    }}>
      {/* 底层：模糊的背景图 */}
      <div style={{
        position: 'absolute', inset: '-20px', 
        backgroundImage: `url("${getAssetPath(item.image_path)}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(15px) brightness(0.8)', 
        zIndex: 0
      }}></div>

      {/* 顶层：内容 + 半透明遮罩 */}
      <div style={{ 
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        background: 'rgba(0, 0, 0, 0.2)', // 深色半透明遮罩，增强文字对比度
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '20px', color: '#fff',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)', 
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: '0.9em', marginBottom: '20px', lineHeight: '1.6', fontStyle: 'italic', fontWeight: '500' }}>
          "{item.prompt}"
        </div>
        <button onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
          style={{ 
            padding: '8px 20px', borderRadius: '20px', 
            border: '1px solid rgba(255,255,255,0.8)', 
            background: 'rgba(255,255,255,0.1)', color: '#fff', 
            cursor: 'pointer', backdropFilter: 'blur(5px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          {copiedId === item.id ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// --- 方案 2: 渐变极光 (Aurora Gradient) ---
const Back2 = ({ item }) => {
  const { copiedId, copy } = useClipboard();
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '0.9em', marginBottom: '20px', lineHeight: '1.6', fontWeight: '500' }}>{item.prompt}</div>
      <button onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
        style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: '#fff', color: '#ff9a9e', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        {copiedId === item.id ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

// --- 方案 3: 纹理质感 (Textured Paper) ---
const Back3 = ({ item }) => {
  const { copiedId, copy } = useClipboard();
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      backgroundColor: '#fdfbf7',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', color: '#333'
    }}>
      <div style={{ fontSize: '0.9em', marginBottom: '20px', lineHeight: '1.6', fontFamily: 'serif' }}>"{item.prompt}"</div>
      <button onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
        style={{ padding: '8px 20px', borderRadius: '4px', border: '1px solid #333', background: 'transparent', cursor: 'pointer' }}>
        {copiedId === item.id ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

// --- 方案 4: 极简白 (Minimal White) ---
const Back4 = ({ item }) => {
  const { copiedId, copy } = useClipboard();
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      background: '#fff', border: '1px solid #eee',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', color: '#000'
    }}>
      <div style={{ width: '40px', height: '4px', background: '#000', marginBottom: '20px' }}></div>
      <div style={{ fontSize: '0.9em', marginBottom: '30px', lineHeight: '1.6' }}>{item.prompt}</div>
      <button onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
        style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer' }}>
        {copiedId === item.id ? 'Copied!' : 'Copy Prompt'}
      </button>
    </div>
  );
};

// --- 方案 5: 图片暗化 (Darkened Image) ---
const Back5 = ({ item }) => {
  const { copiedId, copy } = useClipboard();
  return (
    <div style={{ 
      width: '100%', height: '100%', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', color: '#fff'
    }}>
      {/* 背景图 */}
      <img src={getAssetPath(item.image_path)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px)' }} 
           onError={(e) => e.target.style.display='none'} />
      {/* 遮罩 */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}></div>
      
      {/* 内容 */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '0.9em', marginBottom: '20px', lineHeight: '1.6' }}>{item.prompt}</div>
        <button onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
          style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
          {copiedId === item.id ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// --- 方案 6: 科技线条 (Tech Lines) ---
const Back6 = ({ item }) => {
  const { copiedId, copy } = useClipboard();
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      background: '#1a1a1a',
      backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', color: '#0f0', fontFamily: 'monospace'
    }}>
      <div style={{ fontSize: '0.8em', marginBottom: '20px', lineHeight: '1.6', opacity: 0.8 }}>
        &gt; {item.prompt}
      </div>
      <button onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
        style={{ padding: '8px 20px', borderRadius: '4px', border: '1px solid #0f0', background: 'transparent', color: '#0f0', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {copiedId === item.id ? '[ COPIED ]' : '[ COPY ]'}
      </button>
    </div>
  );
};

const CardBackDemo = () => {
  return (
    <div style={{ padding: '40px', background: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '60px' }}>Card Back Variants</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', maxWidth: '1000px', margin: '0 auto' }}>
        <FlipCard title="1. 磨砂玻璃" BackComponent={Back1} />
        <FlipCard title="2. 渐变极光" BackComponent={Back2} />
        <FlipCard title="3. 纹理质感" BackComponent={Back3} />
        <FlipCard title="4. 极简白" BackComponent={Back4} />
        <FlipCard title="5. 图片暗化" BackComponent={Back5} />
        <FlipCard title="6. 科技线条" BackComponent={Back6} />
      </div>
    </div>
  );
};

export default CardBackDemo;