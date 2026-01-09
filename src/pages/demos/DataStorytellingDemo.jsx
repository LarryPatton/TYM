import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// 模拟实时数据
const generateData = () => Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));

const DataStorytellingDemo = () => {
  const [data, setData] = useState(generateData());
  const [activeRegion, setActiveRegion] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [...prev.slice(1), Math.floor(Math.random() * 100)]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#050505', 
      color: '#00ff9d', 
      fontFamily: '"Courier New", monospace',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 背景网格 */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'linear-gradient(rgba(0, 255, 157, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 157, 0.1) 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        opacity: 0.2,
        pointerEvents: 'none'
      }} />

      {/* 顶部导航 */}
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,157,0.3)' }}>
        <Link to="/showcase-demos" style={{ color: '#00ff9d', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>← BACK</span>
        </Link>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>SYSTEM STATUS: ONLINE</div>
        <div>{new Date().toLocaleTimeString()}</div>
      </div>

      {/* 主内容区 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', padding: '40px', height: 'calc(100vh - 100px)' }}>
        
        {/* 左侧：动态地图与连线 */}
        <div style={{ border: '1px solid rgba(0,255,157,0.3)', padding: '20px', position: 'relative', background: 'rgba(0,20,10,0.5)' }}>
          <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid rgba(0,255,157,0.3)', paddingBottom: '10px' }}>GLOBAL TRAFFIC MAP</h3>
          
          {/* 模拟地图点 */}
          <div style={{ position: 'relative', width: '100%', height: '80%' }}>
            {[
              { id: 'NA', x: '20%', y: '30%', name: 'North America' },
              { id: 'EU', x: '50%', y: '25%', name: 'Europe' },
              { id: 'AS', x: '75%', y: '40%', name: 'Asia' },
              { id: 'SA', x: '30%', y: '70%', name: 'South America' },
              { id: 'AF', x: '55%', y: '60%', name: 'Africa' },
              { id: 'OC', x: '85%', y: '80%', name: 'Oceania' },
            ].map((region) => (
              <motion.div
                key={region.id}
                style={{ 
                  position: 'absolute', 
                  left: region.x, 
                  top: region.y,
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setActiveRegion(region.id)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <motion.div 
                  animate={{ 
                    scale: activeRegion === region.id ? 1.5 : 1,
                    boxShadow: activeRegion === region.id ? '0 0 20px #00ff9d' : '0 0 0px #00ff9d'
                  }}
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    background: '#00ff9d', 
                    borderRadius: '50%' 
                  }} 
                />
                {/* 脉冲波 */}
                <motion.div
                  animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '12px', height: '12px',
                    border: '1px solid #00ff9d',
                    borderRadius: '50%'
                  }}
                />
                {/* 连线动画 (仅当激活时显示) */}
                <AnimatePresence>
                  {activeRegion === region.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.8)', padding: '10px', border: '1px solid #00ff9d', width: '150px', zIndex: 10 }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{region.name}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Traffic: {Math.floor(Math.random() * 1000)} TB/s</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Nodes: {Math.floor(Math.random() * 50)}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            
            {/* 装饰性连线 SVG */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <motion.path
                d="M 200 200 Q 400 100 600 300"
                fill="none"
                stroke="rgba(0, 255, 157, 0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
               <motion.path
                d="M 600 300 Q 500 500 300 400"
                fill="none"
                stroke="rgba(0, 255, 157, 0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
                animate={{ strokeDashoffset: [0, 20] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>
        </div>

        {/* 右侧：实时数据流 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 实时波形图 */}
          <div style={{ border: '1px solid rgba(0,255,157,0.3)', padding: '20px', flex: 1, background: 'rgba(0,20,10,0.5)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>NETWORK LOAD</h3>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
              {data.map((val, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${val}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ 
                    flex: 1, 
                    background: `rgba(0, 255, 157, ${val / 100})`,
                    minHeight: '2px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* 环形图表 */}
          <div style={{ border: '1px solid rgba(0,255,157,0.3)', padding: '20px', flex: 1, background: 'rgba(0,20,10,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <h3 style={{ position: 'absolute', top: '20px', left: '20px', margin: 0, fontSize: '1rem' }}>CPU USAGE</h3>
             <svg width="150" height="150" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="40" stroke="rgba(0,255,157,0.2)" strokeWidth="10" fill="none" />
               <motion.circle 
                 cx="50" cy="50" r="40" 
                 stroke="#00ff9d" 
                 strokeWidth="10" 
                 fill="none" 
                 strokeDasharray="251.2"
                 animate={{ strokeDashoffset: 251.2 - (251.2 * data[data.length - 1] / 100) }}
                 transform="rotate(-90 50 50)"
               />
               <text x="50" y="55" textAnchor="middle" fill="#00ff9d" fontSize="20" fontWeight="bold">
                 {data[data.length - 1]}%
               </text>
             </svg>
          </div>

          {/* 滚动日志 */}
          <div style={{ border: '1px solid rgba(0,255,157,0.3)', padding: '10px', height: '150px', overflow: 'hidden', background: '#000', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            <div style={{ color: '#666', marginBottom: '5px' }}>// SYSTEM LOGS</div>
            {data.slice(-5).reverse().map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: '2px' }}
              >
                <span style={{ color: '#00ff9d' }}>[INFO]</span> Process {1000 + i} completed with status code {val}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DataStorytellingDemo;
