import React, { useState } from 'react';

// 模拟复制功能的 Hook
const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
};

// --- 方案组件定义 ---

// 方案 1: 悬停浮层 (中心按钮)
const Variant1 = () => {
  const { copied, copy } = useClipboard();
  const [hover, setHover] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1/1', background: '#f0f0f0', cursor: 'pointer' }}
    >
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>[Image]</div>
      {/* 遮罩层 */}
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        opacity: hover ? 1 : 0, transition: 'opacity 0.3s',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <button 
          onClick={() => copy('Prompt Content 1')}
          style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', background: '#fff', fontWeight: '600', cursor: 'pointer' }}
        >
          {copied ? 'Copied!' : 'Copy Info'}
        </button>
      </div>
    </div>
  );
};

// 方案 2: 悬停底部滑出
const Variant2 = () => {
  const { copied, copy } = useClipboard();
  const [hover, setHover] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1/1', background: '#f0f0f0', cursor: 'pointer' }}
    >
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>[Image]</div>
      {/* 底部滑出层 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', padding: '15px',
        transform: hover ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s ease-out',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.8em', fontWeight: 'bold' }}>Prompt Info...</span>
        <button 
          onClick={() => copy('Prompt Content 2')}
          style={{ padding: '5px 12px', borderRadius: '4px', border: '1px solid #ddd', background: copied ? '#000' : '#fff', color: copied ? '#fff' : '#000', cursor: 'pointer', fontSize: '0.8em' }}
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// 方案 3: 角落常驻图标
const Variant3 = () => {
  const { copied, copy } = useClipboard();
  return (
    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1/1', background: '#f0f0f0' }}>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>[Image]</div>
      <button 
        onClick={() => copy('Prompt Content 3')}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '36px', height: '36px', borderRadius: '50%', border: 'none',
          background: copied ? '#4CAF50' : '#fff', color: copied ? '#fff' : '#000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {copied ? '✓' : '❐'}
      </button>
    </div>
  );
};

// 方案 4: 角落悬停显示图标 (极简)
const Variant4 = () => {
  const { copied, copy } = useClipboard();
  const [hover, setHover] = useState(false);
  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1/1', background: '#f0f0f0' }}
    >
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>[Image]</div>
      <button 
        onClick={() => copy('Prompt Content 4')}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '36px', height: '36px', borderRadius: '8px', border: 'none',
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          opacity: hover || copied ? 1 : 0, transition: 'opacity 0.2s',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {copied ? '✓' : '❐'}
      </button>
    </div>
  );
};

// 方案 5: 点击整卡复制 (Toast反馈)
const Variant5 = () => {
  const { copied, copy } = useClipboard();
  const [hover, setHover] = useState(false);
  return (
    <div 
      onClick={() => copy('Prompt Content 5')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1/1', 
        background: '#f0f0f0', cursor: 'pointer',
        border: hover ? '2px solid #000' : '2px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>[Image]</div>
      {/* 提示文案 */}
      <div style={{
        position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center',
        opacity: hover ? 1 : 0, transition: 'opacity 0.2s',
        pointerEvents: 'none'
      }}>
        <span style={{ background: '#000', color: '#fff', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8em' }}>
          {copied ? 'Copied!' : 'Click to Copy'}
        </span>
      </div>
    </div>
  );
};

// 方案 6: 翻转卡片 (Flip Card)
const Variant6 = () => {
  const { copied, copy } = useClipboard();
  const [flipped, setFlipped] = useState(false);
  return (
    <div 
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{ perspective: '1000px', aspectRatio: '1/1', cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transition: 'transform 0.6s', transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        {/* 正面 */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#f0f0f0', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc'
        }}>
          [Image]
        </div>
        {/* 背面 */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#333', color: '#fff', borderRadius: '12px',
          transform: 'rotateY(180deg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.9em', marginBottom: '15px', opacity: 0.8 }}>"Detailed prompt text goes here..."</p>
          <button 
            onClick={(e) => { e.stopPropagation(); copy('Prompt Content 6'); }}
            style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer' }}
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

const InteractionDemo = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>Interaction Lab</h1>
        <p style={{ color: '#666' }}>请体验以下 6 种交互方案，并选择最适合的一种。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
        
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '1em' }}>1. 悬停浮层 (中心按钮)</h3>
          <Variant1 />
          <p style={{ fontSize: '0.8em', color: '#888', marginTop: '10px' }}>经典方案，遮挡较多，但操作明确。</p>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '1em' }}>2. 悬停底部滑出</h3>
          <Variant2 />
          <p style={{ fontSize: '0.8em', color: '#888', marginTop: '10px' }}>保留图片主体，信息从底部出现。</p>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '1em' }}>3. 角落常驻图标</h3>
          <Variant3 />
          <p style={{ fontSize: '0.8em', color: '#888', marginTop: '10px' }}>效率最高，无需悬停即可点击。</p>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '1em' }}>4. 角落悬停图标</h3>
          <Variant4 />
          <p style={{ fontSize: '0.8em', color: '#888', marginTop: '10px' }}>视觉最干净，悬停时才显示工具。</p>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '1em' }}>5. 点击整卡复制</h3>
          <Variant5 />
          <p style={{ fontSize: '0.8em', color: '#888', marginTop: '10px' }}>操作区域最大，适合纯素材站。</p>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '1em' }}>6. 3D 翻转卡片</h3>
          <Variant6 />
          <p style={{ fontSize: '0.8em', color: '#888', marginTop: '10px' }}>趣味性强，可展示更多文字详情。</p>
        </div>

      </div>
    </div>
  );
};

export default InteractionDemo;
