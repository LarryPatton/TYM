import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClipboard } from '../hooks/useClipboard'; // 引入 Hook

// 模拟数据 - 增加数量以触发滚动
const demoThemes = [
  {
    title: '建筑 (Architecture)',
    items: [
      { id: 't1', name: '古典建筑', en: 'Classical', prompt: 'Prompt...', img: '' },
      { id: 't2', name: '哥特建筑', en: 'Gothic', prompt: 'Prompt...', img: '' },
      { id: 't3', name: '现代主义', en: 'Modernism', prompt: 'Prompt...', img: '' },
      { id: 't4', name: '赛博都市', en: 'Cyber City', prompt: 'Prompt...', img: '' },
      { id: 't5', name: '包豪斯', en: 'Bauhaus', prompt: 'Prompt...', img: '' },
      { id: 't6', name: '解构主义', en: 'Deconstructivism', prompt: 'Prompt...', img: '' },
      { id: 't7', name: '中式传统', en: 'Chinese', prompt: 'Prompt...', img: '' },
      { id: 't8', name: '未来城市', en: 'Future City', prompt: 'Prompt...', img: '' },
    ]
  },
  {
    title: '传统绘画 (Painting)',
    items: [
      { id: 't9', name: '文艺复兴', en: 'Renaissance', prompt: 'Prompt...', img: '' },
      { id: 't10', name: '印象派', en: 'Impressionism', prompt: 'Prompt...', img: '' },
      { id: 't11', name: '水墨画', en: 'Ink Wash', prompt: 'Prompt...', img: '' },
      { id: 't12', name: '浮世绘', en: 'Ukiyo-e', prompt: 'Prompt...', img: '' },
      { id: 't13', name: '巴洛克', en: 'Baroque', prompt: 'Prompt...', img: '' },
      { id: 't14', name: '超现实', en: 'Surrealism', prompt: 'Prompt...', img: '' },
      { id: 't15', name: '立体主义', en: 'Cubism', prompt: 'Prompt...', img: '' },
    ]
  }
];

// --- 方案 1: 横向滚动卡片 (Horizontal Scroll) - 增强版 ---
const Variant1 = () => {
  const { copiedId, copy } = useClipboard();
  
  return (
    <div style={{ padding: '20px 0' }}>
      {demoThemes.map((theme, idx) => (
        <div key={idx} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.2em', margin: 0 }}>{theme.title}</h3>
            <span style={{ fontSize: '0.8em', color: '#999' }}>Scroll for more &rarr;</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            overflowX: 'auto', 
            padding: '0 20px 20px 20px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none', // Firefox 隐藏滚动条
            msOverflowStyle: 'none', // IE/Edge 隐藏滚动条
            '::-webkit-scrollbar': { display: 'none' } // Chrome 隐藏滚动条 (需要通过 CSS 类实现，这里仅作示意)
          }}>
            {theme.items.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  flex: '0 0 220px', // 固定宽度，确保触发滚动
                  border: '1px solid #eee', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  scrollSnapAlign: 'start',
                  background: '#fff'
                }}
                onClick={() => copy(item.prompt, item.id)}
              >
                <div style={{ height: '160px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                  [Image]
                  {copiedId === item.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Copied!
                    </div>
                  )}
                </div>
                <div style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8em', color: '#888' }}>{item.en}</div>
                </div>
              </div>
            ))}
            
            {/* 占位符，确保最后一个元素右侧有间距 */}
            <div style={{ flex: '0 0 5px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 方案 2: 网格画廊 (Grid Gallery) <variant2>
const Variant2 = () => (
  <div style={{ padding: '20px' }}>
    {demoThemes.map((theme, idx) => (
      <div key={idx} style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5em', margin: 0 }}>{theme.title}</h3>
          <div style={{ height: '1px', background: '#eee', flex: 1, marginLeft: '20px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {theme.items.map((item, i) => (
            <div key={i} style={{ cursor: 'pointer' }}>
              <div style={{ aspectRatio: '1/1', background: '#f0f0f0', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>[Image]</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600' }}>{item.name}</div>
                <div style={{ fontSize: '0.8em', color: '#999' }}>{item.en}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// --- 方案 3: 迷你 Tabs (Mini Tabs) <variant3>
const Variant3 = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '16px' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #eee' }}>
        {demoThemes.map((theme, idx) => (
          <button 
            key={idx} 
            onClick={() => setActiveTab(idx)}
            style={{ 
              padding: '10px 0', background: 'none', border: 'none', 
              borderBottom: activeTab === idx ? '2px solid #000' : '2px solid transparent',
              fontWeight: activeTab === idx ? 'bold' : 'normal', cursor: 'pointer'
            }}
          >
            {theme.title.split(' ')[0]}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        {demoThemes[activeTab].items.map((item, i) => (
          <div key={i} style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
            <div style={{ height: '100px', background: '#eee', marginBottom: '10px', borderRadius: '4px' }}></div>
            <div style={{ fontSize: '0.9em', fontWeight: 'bold' }}>{item.name}</div>
            <div style={{ fontSize: '0.7em', color: '#888' }}>{item.en}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 方案 4: 列表 + 悬停预览 (List + Hover Preview) <variant4>
const Variant4 = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '20px' }}>
      <div>
        {demoThemes.map((theme, idx) => (
          <div key={idx} style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#999', marginBottom: '10px', textTransform: 'uppercase', fontSize: '0.8em' }}>{theme.title}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {theme.items.map((item, i) => (
                <span 
                  key={i}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ 
                    padding: '8px 16px', border: '1px solid #ddd', borderRadius: '20px', 
                    cursor: 'pointer', fontSize: '0.9em', transition: 'all 0.2s',
                    background: hoveredItem === item ? '#000' : '#fff',
                    color: hoveredItem === item ? '#fff' : '#000'
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#f5f5f5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        {hoveredItem ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>[Image]</div>
            <div style={{ fontWeight: 'bold' }}>{hoveredItem.name}</div>
            <div style={{ color: '#666' }}>{hoveredItem.en}</div>
          </div>
        ) : (
          <span style={{ color: '#ccc' }}>Hover over a tag to preview</span>
        )}
      </div>
    </div>
  );
};

// --- 方案 5: 3D 翻转卡片 (3D Flip) - 完整交互版 <variant5>
const Variant5 = () => {
  const { copiedId, copy } = useClipboard();
  const [hoveredCardId, setHoveredCardId] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      {demoThemes.map((theme, idx) => (
        <div key={idx} style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px' }}>{theme.title}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {theme.items.map((item) => (
              <div 
                key={item.id} 
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                style={{ perspective: '1000px', height: '240px', cursor: 'pointer' }}
              >
                <div style={{ 
                  position: 'relative', width: '100%', height: '100%', 
                  transition: 'transform 0.6s', transformStyle: 'preserve-3d',
                  transform: hoveredCardId === item.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                  {/* 正面 */}
                  <div style={{ 
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    background: '#fff', border: '1px solid #eee', borderRadius: '12px',
                    display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ flex: 1, background: '#f5f5f5', margin: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>[Img]</div>
                    <div style={{ textAlign: 'center', paddingBottom: '15px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7em', color: '#999' }}>{item.en}</div>
                    </div>
                  </div>

                  {/* 背面 */}
                  <div style={{ 
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    background: '#111', color: '#fff', borderRadius: '12px',
                    transform: 'rotateY(180deg)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.8em', marginBottom: '15px', opacity: 0.8 }}>"{item.prompt}"</div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); copy(item.prompt, item.id); }}
                      style={{ 
                        padding: '8px 16px', borderRadius: '20px', border: '1px solid #fff', 
                        background: copiedId === item.id ? '#fff' : 'transparent', 
                        color: copiedId === item.id ? '#000' : '#fff',
                        cursor: 'pointer', fontSize: '0.8em'
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
  );
};

// --- 方案 6: 极简图文列表 (Minimal List with Thumb) <variant6>
const Variant6 = () => (
  <div style={{ padding: '20px' }}>
    {demoThemes.map((theme, idx) => (
      <div key={idx} style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>{theme.title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {theme.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              <div style={{ width: '60px', height: '60px', background: '#f0f0f0', borderRadius: '6px', flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>{item.en}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ThemePreviewDemo = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '60px' }}>Theme Preview Variants</h1>

      <section style={{ marginBottom: '80px' }}>
        <div style={{ background: '#000', color: '#fff', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>方案 1: 横向滚动卡片</div>
        <Variant1 />
      </section>

      <section style={{ marginBottom: '80px' }}>
        <div style={{ background: '#000', color: '#fff', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>方案 2: 网格画廊 (Grid Gallery)</div>
        <Variant2 />
      </section>

      <section style={{ marginBottom: '80px' }}>
        <div style={{ background: '#000', color: '#fff', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>方案 3: 迷你 Tabs (Mini Tabs)</div>
        <Variant3 />
      </section>

      <section style={{ marginBottom: '80px' }}>
        <div style={{ background: '#000', color: '#fff', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>方案 4: 列表 + 悬停预览</div>
        <Variant4 />
      </section>

      <section style={{ marginBottom: '80px' }}>
        <div style={{ background: '#000', color: '#fff', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>方案 5: 3D 翻转卡片 (复用风格)</div>
        <Variant5 />
      </section>

      <section style={{ marginBottom: '80px' }}>
        <div style={{ background: '#000', color: '#fff', padding: '5px 10px', display: 'inline-block', marginBottom: '10px' }}>方案 6: 极简图文列表</div>
        <Variant6 />
      </section>
    </div>
  );
};

export default ThemePreviewDemo;