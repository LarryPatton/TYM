import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import { useTitle } from '../hooks/useTitle';

// 模拟复制功能的 Hook
const useClipboard = () => {
  const [copiedId, setCopiedId] = useState(null);
  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  return { copiedId, copy };
};

const ThemeList = () => {
  useTitle('主题库'); // 设置标题

  const [themesData, setThemesData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const { copiedId, copy } = useClipboard();
  const [hoveredCardId, setHoveredCardId] = useState(null);
  
  // 网格列数控制状态
  const [gridColumns, setGridColumns] = useState(5); // 默认 5 列
  const [isControlOpen, setIsControlOpen] = useState(false); // 控制条展开状态
  const closeTimeoutRef = React.useRef(null); // 用于存储定时器 ID
  
  const location = useLocation();

  // 处理鼠标移入：清除定时器，保持展开（如果是点击展开的）
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // 处理鼠标移出：设置 1.5s 后收起
  const handleMouseLeave = () => {
    if (isControlOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsControlOpen(false);
      }, 1500);
    }
  };

  // 处理点击：切换展开/收起
  const handleClick = () => {
    if (isControlOpen) {
      // 如果已经展开，点击则立即收起
      setIsControlOpen(false);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    } else {
      // 如果未展开，点击则展开
      setIsControlOpen(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/themes.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            const groupedData = {};
            
            data.forEach(item => {
              if (!groupedData[item.category]) {
                groupedData[item.category] = [];
              }
              groupedData[item.category].push(item);
            });

            const cats = Object.keys(groupedData);
            setThemesData(groupedData);
            setCategories(cats);
            
            // 优先使用 location.state 中的 category，否则默认第一个
            if (location.state && location.state.category && cats.includes(location.state.category)) {
              setActiveTab(location.state.category);
            } else if (cats.length > 0) {
              setActiveTab(cats[0]);
            }
            
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching themes:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]); // 依赖 location.state，以便跳转时重新触发（虽然通常是重新挂载）

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading themes...</div>;
  }

  return (
    <div>
      {/* 头部区域 */}
      <div style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3em', fontWeight: '900', letterSpacing: '-1px', marginBottom: '10px' }}>Theme Library.</h1>
        <p style={{ color: '#666' }}>Explore our curated collection of styles and concepts.</p>
      </div>

      {/* 顶部 Tabs 导航 - 多行居中布局 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '60px',
        padding: '0 20px'
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              padding: '8px 20px',
              border: '1px solid',
              borderColor: activeTab === cat ? '#000' : '#eee',
              background: activeTab === cat ? '#000' : 'transparent',
              color: activeTab === cat ? '#fff' : '#666',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '0.95em',
              fontWeight: activeTab === cat ? '500' : '400',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 内容展示区 */}
      <div>
        <div style={{ 
          display: 'grid', 
          // 动态设置列数
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`, 
          gap: '30px',
          transition: 'grid-template-columns 0.3s ease' // 添加平滑过渡
        }}>
          {themesData[activeTab]?.map((item) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredCardId(item.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              style={{ 
                perspective: '1000px',
                cursor: 'pointer',
                height: '320px'
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
                  display: 'flex', flexDirection: 'column'
                }}>
                  {/* 图片 */}
                  <div style={{ 
                    flex: 1,
                    background: '#f5f5f5', 
                    borderRadius: '12px',
                    marginBottom: '15px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#ccc',
                    overflow: 'hidden'
                  }}>
                    {item.image_path ? (
                      <img 
                        src={item.image_path} 
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          // 防止死循环：如果已经重试过一次，则不再重试
                          if (e.target.dataset.retried) {
                            e.target.style.display = 'none'; 
                            e.target.parentNode.innerText = '[Image]';
                            return;
                          }
                          
                          // 标记已重试
                          e.target.dataset.retried = "true";
                          
                          // 尝试切换扩展名
                          const currentSrc = e.target.src;
                          if (currentSrc.endsWith('.png')) {
                            e.target.src = currentSrc.replace('.png', '.jpg');
                          } else if (currentSrc.endsWith('.jpg')) {
                            e.target.src = currentSrc.replace('.jpg', '.png');
                          } else {
                            // 如果不是 png/jpg 结尾，直接失败
                            e.target.style.display = 'none'; 
                            e.target.parentNode.innerText = '[Image]';
                          }
                        }}
                      />
                    ) : (
                      '[Image]'
                    )}
                  </div>
                  {/* 文字 */}
                  <div style={{ textAlign: 'center', height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: '600', fontSize: '1.1em', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85em', color: '#888', fontFamily: 'monospace' }}>{item.en}</div>
                  </div>
                </div>

                {/* === 背面 (Back) === */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: '#111', color: '#fff', borderRadius: '12px',
                  transform: 'rotateY(180deg)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                  padding: '30px', textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
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
      </div>

      {/* 悬浮控制按钮 (左下角) */}
      <div 
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '40px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          padding: isControlOpen ? '10px 20px' : '15px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid #eee'
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 减号按钮 */}
        {isControlOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGridColumns(prev => Math.max(2, prev - 1));
            }}
            style={{
              background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer',
              padding: '0 15px', color: '#333', display: 'flex', alignItems: 'center'
            }}
            title="减少列数 (变大)"
          >
            −
          </button>
        )}

        {/* 网格图标 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>

        {/* 加号按钮 */}
        {isControlOpen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGridColumns(prev => Math.min(8, prev + 1));
            }}
            style={{
              background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer',
              padding: '0 15px', color: '#333', display: 'flex', alignItems: 'center'
            }}
            title="增加列数 (变小)"
          >
            +
          </button>
        )}
      </div>

    </div>
  );
};

export default ThemeList;