import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const CaseIndex = () => {
  useTitle('案例研究');

  const [hoveredChapter, setHoveredChapter] = useState(null);

  const chapters = [
    { id: '01-background', number: '01', title: '背景与环境', desc: '项目概览、挑战与战略方向。', output: '战略方案', time: '5 分钟' },
    { id: '02-ui-guidelines', number: '02', title: 'UI 视觉规范', desc: '建立视觉语言与组件库。', output: '设计系统', time: '8 分钟' },
    { id: '03-cmf', number: '03', title: '产品 CMF', desc: '定义硬件的色彩、材质与工艺。', output: 'CMF 规格书', time: '6 分钟' },
    { id: '04-packaging', number: '04', title: '包装设计', desc: '开箱体验与结构包装设计。', output: '刀模图, 样机', time: '5 分钟' },
    { id: '05-poster-kv', number: '05', title: '海报 & 主视觉', desc: '数字与平面媒体的关键视觉。', output: '高清资源', time: '4 分钟' },
    { id: '06-marketing-plan', number: '06', title: '营销计划', desc: '上市策略与活动规划。', output: '活动路线图', time: '7 分钟' },
    { id: '07-offline-materials', number: '07', title: '线下物料', desc: '展位设计与印刷品。', output: '印刷文件', time: '5 分钟' },
    { id: '08-results-review', number: '08', title: '结果与复盘', desc: '数据分析、用户反馈与项目回顾。', output: '绩效报告', time: '4 分钟' },
  ];

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      
      {/* 1. Case Hero */}
      <section style={{ marginBottom: '120px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto 120px auto' }}>
        <div style={{ fontSize: '0.8em', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '30px' }}>Featured Case Study</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '5em', fontWeight: '400', lineHeight: '1.1', marginBottom: '40px', letterSpacing: '-0.03em' }}>
          Project GENESIS
        </h1>
        <p style={{ fontSize: '1.4em', color: '#666', maxWidth: '700px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>
          从品牌战略到实体产品发布的完整 0-1 旅程。
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '60px', flexWrap: 'wrap', fontSize: '0.9em', color: '#333' }}>
          <div>
            <div style={{ color: '#999', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8em' }}>角色</div>
            <div style={{ fontWeight: '600' }}>主设计师</div>
          </div>
          <div>
            <div style={{ color: '#999', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8em' }}>周期</div>
            <div style={{ fontWeight: '600' }}>12 个月</div>
          </div>
          <div>
            <div style={{ color: '#999', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8em' }}>团队</div>
            <div style={{ fontWeight: '600' }}>8 人</div>
          </div>
          <div>
            <div style={{ color: '#999', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8em' }}>范围</div>
            <div style={{ fontWeight: '600' }}>全栈设计</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link to="/work/the-case/01-background">
            <button style={{ padding: '16px 40px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '1.1em', cursor: 'pointer', fontWeight: '500', transition: 'transform 0.2s' }}>
              开始阅读 (第 01 章)
            </button>
          </Link>
        </div>
      </section>

      {/* 2. Chapter Grid (Bento Style) */}
      <section id="chapter-list" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3em', margin: 0 }}>目录</h2>
          <div style={{ color: '#999' }}>8 个章节 • 预计阅读 45 分钟</div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {chapters.map((chapter, index) => (
            <Link 
              key={chapter.id} 
              to={`/work/the-case/${chapter.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                style={{ 
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-10px', 
                  fontSize: '5em', 
                  fontWeight: '900', 
                  color: '#f0f0f0', 
                  opacity: 0.5,
                  zIndex: 0,
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1,
                  pointerEvents: 'none'
                }}>
                  {chapter.number}
                </div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '0.8em', color: '#999', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Chapter {chapter.number}</div>
                  <h3 style={{ fontSize: '1.4em', fontWeight: '600', marginBottom: '12px', lineHeight: '1.3' }}>{chapter.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9em', lineHeight: '1.6', margin: 0 }}>{chapter.desc}</p>
                </div>

                <div style={{ position: 'relative', zIndex: 1, marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85em', color: '#999' }}>
                  <span>{chapter.time}</span>
                  <span style={{ color: '#111', fontWeight: '500' }}>阅读 →</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Quick Access */}
      <section style={{ marginTop: '160px', borderTop: '1px solid #eee', paddingTop: '80px', textAlign: 'center' }}>
        <p style={{ color: '#999', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9em' }}>快速访问</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link to="/work/the-case/08-results-review">
            <button style={{ padding: '12px 30px', background: '#fff', border: '1px solid #eee', borderRadius: '100px', cursor: 'pointer', fontWeight: '500', color: '#666', transition: 'all 0.2s' }} className="hover:border-black hover:text-black">
              直接查看结果与复盘
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default CaseIndex;