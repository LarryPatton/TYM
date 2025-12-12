import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchIndex } from '../hooks/useSearchIndex';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ projects: [], themes: [] });
  const { index, loading } = useSearchIndex();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // 搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], themes: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();

    const matchedProjects = index.projects.filter(p => 
      p.name?.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // 限制显示数量

    const matchedThemes = index.themes.filter(t => 
      t.name?.toLowerCase().includes(lowerQuery) || 
      t.en?.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);

    setResults({ projects: matchedProjects, themes: matchedThemes });
    setIsOpen(true);
  }, [query, index]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (path, state = {}) => {
    navigate(path, { state });
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input 
        type="text" 
        placeholder="Search..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setIsOpen(true)}
        style={{ 
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid #eee', 
          background: '#f5f5f5',
          outline: 'none',
          fontSize: '0.9em',
          width: isOpen ? '300px' : '200px', // 展开时变宽
          transition: 'width 0.3s'
        }} 
      />

      <AnimatePresence>
        {isOpen && (results.projects.length > 0 || results.themes.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '350px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #eee',
              padding: '15px',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {/* 项目结果 */}
            {results.projects.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '0.8em', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Projects</div>
                {results.projects.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                    style={{ padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '30px', height: '30px', background: '#eee', borderRadius: '4px', flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: '0.9em', fontWeight: '500' }}>{p.name}</div>
                      <div style={{ fontSize: '0.7em', color: '#999' }}>{p.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 主题结果 */}
            {results.themes.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8em', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Themes</div>
                {results.themes.map(t => (
                  <div 
                    key={t.id}
                    // 跳转到主题页并定位到对应分类
                    onClick={() => handleSelect('/themes', { category: t.category })}
                    style={{ padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '30px', height: '30px', background: '#eee', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8em' }}>#</div>
                    <div>
                      <div style={{ fontSize: '0.9em', fontWeight: '500' }}>{t.name}</div>
                      <div style={{ fontSize: '0.7em', color: '#999' }}>{t.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
