import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

// 模拟数据：个人经历或项目历程
const timelineData = [
  {
    year: '2020',
    title: 'Junior Designer',
    company: 'Creative Studio A',
    desc: 'Started my journey in digital design, focusing on UI/UX fundamentals.',
    color: '#ff5f6d',
    tags: ['Figma', 'Sketch', 'Prototyping']
  },
  {
    year: '2021',
    title: 'Frontend Developer',
    company: 'Tech Corp B',
    desc: 'Transitioned into development, bridging the gap between design and code.',
    color: '#ffc371',
    tags: ['React', 'CSS', 'JavaScript']
  },
  {
    year: '2022',
    title: 'Senior Product Designer',
    company: 'Innovation Lab C',
    desc: 'Led design systems and product strategy for enterprise applications.',
    color: '#11998e',
    tags: ['Design Systems', 'Strategy', 'Leadership']
  },
  {
    year: '2023',
    title: 'Creative Technologist',
    company: 'Future Agency D',
    desc: 'Exploring the intersection of code, art, and interactive experiences.',
    color: '#38ef7d',
    tags: ['WebGL', 'Three.js', 'Creative Coding']
  },
  {
    year: '2024',
    title: 'Freelance Director',
    company: 'Self-Employed',
    desc: 'Helping brands tell their stories through immersive web experiences.',
    color: '#667eea',
    tags: ['Direction', 'Branding', 'Storytelling']
  }
];

const TimelineItem = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        gap: '40px',
        padding: '40px 0',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* 左侧年份 */}
      <div style={{ 
        width: '100px', 
        textAlign: 'right', 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        color: isHovered ? item.color : '#444',
        transition: 'color 0.3s ease'
      }}>
        {item.year}
      </div>

      {/* 中间轴线节点 */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div 
          animate={{ 
            scale: isHovered ? 1.5 : 1,
            backgroundColor: isHovered ? item.color : '#333',
            borderColor: isHovered ? item.color : '#333'
          }}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid #333',
            background: '#0a0a0a',
            zIndex: 2
          }}
        />
        {/* 连接线 */}
        {index !== timelineData.length - 1 && (
          <div style={{ 
            width: '2px', 
            flex: 1, 
            background: '#222', 
            margin: '10px 0',
            minHeight: '100px'
          }} />
        )}
      </div>

      {/* 右侧内容 */}
      <div style={{ flex: 1, paddingBottom: '40px' }}>
        <motion.h3 
          animate={{ x: isHovered ? 10 : 0 }}
          style={{ 
            fontSize: '2rem', 
            margin: '0 0 10px 0', 
            color: '#fff' 
          }}
        >
          {item.title}
        </motion.h3>
        <div style={{ fontSize: '1.1rem', color: '#888', marginBottom: '15px' }}>
          @ {item.company}
        </div>
        <p style={{ 
          fontSize: '1rem', 
          color: '#666', 
          lineHeight: 1.6, 
          maxWidth: '500px',
          marginBottom: '20px'
        }}>
          {item.desc}
        </p>
        
        {/* 标签 */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {item.tags.map((tag, i) => (
            <span 
              key={i}
              style={{
                fontSize: '0.8rem',
                padding: '4px 12px',
                borderRadius: '20px',
                background: '#1a1a1a',
                color: '#888',
                border: '1px solid #333'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 展开的详情区域 (模拟) */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isHovered ? 'auto' : 0, 
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? 20 : 0
          }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ 
            padding: '20px', 
            background: '#111', 
            borderRadius: '8px', 
            borderLeft: `4px solid ${item.color}` 
          }}>
            <div style={{ color: '#fff', marginBottom: '10px' }}>Key Achievements:</div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#888', fontSize: '0.9rem' }}>
              <li>Successfully delivered 10+ major projects.</li>
              <li>Improved team efficiency by 20%.</li>
              <li>Awarded "Employee of the Year".</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TimelineDemo = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', position: 'relative' }}>
      {/* 顶部进度条 */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: '#fff',
          transformOrigin: '0%',
          scaleX,
          zIndex: 100
        }}
      />

      {/* 导航 */}
      <div style={{ padding: '40px', position: 'fixed', top: 0, left: 0, zIndex: 90 }}>
        <Link to="/showcase-demos" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
          ← Back to Demos
        </Link>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '150px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '100px', textAlign: 'center' }}
        >
          <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>My Journey</h1>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>
            A timeline of professional growth and creative exploration.
          </p>
        </motion.div>

        <div>
          {timelineData.map((item, index) => (
            <TimelineItem key={index} item={item} index={index} />
          ))}
        </div>

        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
          To be continued...
        </div>
      </div>
    </div>
  );
};

export default TimelineDemo;
