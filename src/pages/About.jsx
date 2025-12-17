import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const About = () => {
  useTitle('关于');

  const [expandedJob, setExpandedJob] = useState(null);

  const toggleJob = (index) => {
    setExpandedJob(expandedJob === index ? null : index);
  };

  const capabilities = [
    {
      title: '产品策略',
      icon: '🎯',
      desc: '从模糊的需求中提炼核心价值，定义产品方向与成功指标。',
      tags: ['用户研究', '竞品分析', '数据洞察', '产品规划']
    },
    {
      title: '体验设计',
      icon: '✨',
      desc: '构建直观、愉悦且可扩展的交互界面，确保用户体验的一致性。',
      tags: ['UI/UX 设计', '设计系统', '交互原型', '可用性测试']
    },
    {
      title: '创意技术',
      icon: '⚡',
      desc: '弥合设计与开发的鸿沟，通过代码实现高保真的创意落地。',
      tags: ['前端开发', '创意编程', '动效实现', '技术可行性']
    }
  ];

  const workflow = [
    { step: '01', title: '发现', desc: '调研与定义' },
    { step: '02', title: '构思', desc: '策略与发散' },
    { step: '03', title: '构建', desc: '设计与原型' },
    { step: '04', title: '交付', desc: '开发与验证' },
  ];

  const tools = {
    '设计': ['Figma', 'Adobe CC', 'Blender', 'Cinema 4D'],
    '原型': ['Protopie', 'Principle', 'After Effects'],
    '开发': ['React', 'TypeScript', 'Tailwind CSS', 'Three.js'],
    '协作': ['Notion', 'Linear', 'Slack', 'Git']
  };

  const journey = [
    { 
      year: '2013', 
      title: '本科毕业', 
      subtitle: '设计艺术学院', 
      desc: '获得学士学位，主修视觉传达。在校期间专注于品牌设计与排版研究。' 
    },
    { 
      year: '2017', 
      title: '初入职场', 
      subtitle: 'StartUp Alpha', 
      desc: '作为前端开发 & 设计师加入初创团队。使用 React 从零构建 MVP，并设计了最初的品牌识别系统。' 
    },
    { 
      year: '2019', 
      title: '职业转型', 
      subtitle: 'Creative Studio', 
      desc: '转型为 UI/UX 设计师，为财富 500 强客户设计营销网站。深入研究动效设计与交互体验。' 
    },
    { 
      year: '2021', 
      title: '核心骨干', 
      subtitle: 'Tech Innovators Inc.', 
      desc: '担任高级产品设计师，主导核心银行 App 的重构。建立了用于 5 个产品的新设计系统，推动团队设计规范化。' 
    },
    { 
      year: 'Now', 
      title: '持续探索', 
      subtitle: '独立开发者 & 设计师', 
      desc: '探索 AI 辅助设计与创意编程的边界。致力于创造更具人文关怀的数字产品。' 
    }
  ];

  return (
    <div className="noise-bg" style={{ minHeight: '100vh', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* 1. Hero Section */}
        <section style={{ display: 'flex', alignItems: 'center', gap: '80px', marginBottom: '160px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ width: '120px', height: '120px', background: '#eee', borderRadius: '50%', marginBottom: '40px', overflow: 'hidden' }}>
              {/* Placeholder for Avatar */}
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>头像</div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4em', fontWeight: '400', lineHeight: '1.1', marginBottom: '30px', letterSpacing: '-0.02em' }}>
              你好，我是 [名字]。
            </h1>
            <p style={{ fontSize: '1.4em', color: '#666', marginBottom: '40px', lineHeight: '1.6', maxWidth: '40ch' }}>
              一名会写代码的产品设计师。我致力于弥合设计与工程之间的鸿沟，打造既美观又实用的产品。
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button style={{ padding: '14px 30px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '1em', cursor: 'pointer', fontWeight: '500' }}>
                下载简历
              </button>
              <Link to="/contact">
                <button style={{ padding: '14px 30px', background: 'transparent', color: '#111', border: '1px solid #ddd', borderRadius: '100px', fontSize: '1em', cursor: 'pointer' }}>
                  联系我
                </button>
              </Link>
            </div>
          </div>
          <div style={{ flex: '1 1 400px', background: '#fff', padding: '60px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2em', fontWeight: '400', marginBottom: '30px' }}>我的故事</h3>
            <p style={{ lineHeight: '1.8', color: '#444', marginBottom: '20px', fontSize: '1.1em' }}>
              我的职业生涯始于开发，但我很快意识到我真正的热情在于设计与技术的交汇点。
              我相信，当设计与工程完美融合时，才能诞生最好的产品。
            </p>
            <p style={{ lineHeight: '1.8', color: '#444', fontSize: '1.1em' }}>
              在过去的 6 年里，我帮助初创公司和企业推出了成功的数字产品，始终在考虑技术可行性的同时为用户代言。
            </p>
          </div>
        </section>

        {/* 2. Professional Profile (New Section) */}
        <section style={{ marginBottom: '160px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3em', fontWeight: '400', marginBottom: '80px', textAlign: 'center' }}>专业概况</h2>
          
          {/* 2.1 Capability Model */}
          <div style={{ marginBottom: '100px' }}>
            <h3 style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>01. 能力模型</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {capabilities.map((cap, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  style={{ padding: '40px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ fontSize: '2.5em', marginBottom: '20px' }}>{cap.icon}</div>
                  <h4 style={{ fontSize: '1.5em', fontWeight: '600', marginBottom: '15px' }}>{cap.title}</h4>
                  <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>{cap.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {cap.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.85em', padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px', color: '#666' }}>{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2.2 Workflow */}
          <div style={{ marginBottom: '100px' }}>
            <h3 style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>02. 设计工作流</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #eee' }}>
              {workflow.map((flow, index) => (
                <React.Fragment key={index}>
                  <div style={{ textAlign: 'center', flex: 1, minWidth: '120px' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', color: '#eee', fontWeight: '900', marginBottom: '10px' }}>{flow.step}</div>
                    <div style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '5px' }}>{flow.title}</div>
                    <div style={{ fontSize: '0.9em', color: '#999' }}>{flow.desc}</div>
                  </div>
                  {index < workflow.length - 1 && (
                    <div style={{ height: '1px', flex: 1, background: '#eee', minWidth: '20px', display: 'none' }} className="md:block"></div> // Hidden on mobile, visible on desktop if using Tailwind classes, but here using inline styles so just a placeholder
                  )}
                  {/* Simple arrow for visual flow */}
                  {index < workflow.length - 1 && (
                    <div style={{ color: '#eee', fontSize: '1.5em' }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 2.3 Tools */}
          <div>
            <h3 style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>03. 工具箱</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
              {Object.entries(tools).map(([category, items]) => (
                <div key={category}>
                  <h4 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{category}</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map(tool => (
                      <li key={tool} style={{ marginBottom: '10px', color: '#666', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '6px', height: '6px', background: '#ddd', borderRadius: '50%' }}></span>
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* 3. Experience Timeline (Redesigned) */}
        <section style={{ marginBottom: '160px', maxWidth: '800px', margin: '0 auto 160px auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3em', fontWeight: '400', marginBottom: '80px', textAlign: 'center' }}>旅程</h2>
          
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            {/* Vertical Line */}
            <div style={{ 
              position: 'absolute', 
              left: '19px', 
              top: '10px', 
              bottom: '10px', 
              width: '2px', 
              background: '#eee' 
            }}></div>

            {journey.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ marginBottom: '60px', position: 'relative' }}
              >
                {/* Dot */}
                <div style={{ 
                  position: 'absolute', 
                  left: '-29px', 
                  top: '0', 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: index === journey.length - 1 ? '#111' : '#fff', 
                  border: '4px solid #fff',
                  boxShadow: '0 0 0 2px #eee',
                  zIndex: 1
                }}></div>

                {/* Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '40px', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5em', color: '#ccc', fontWeight: '400', textAlign: 'right' }}>
                    {item.year}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4em', fontWeight: '600', marginBottom: '5px' }}>{item.title}</h3>
                    <div style={{ fontSize: '1.1em', color: '#666', marginBottom: '15px', fontWeight: '500' }}>{item.subtitle}</div>
                    <p style={{ color: '#666', lineHeight: '1.8' }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Values */}
        <section style={{ background: '#111', color: '#fff', padding: '100px', borderRadius: '16px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3em', fontWeight: '400', marginBottom: '80px' }}>价值观与理念</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '60px' }}>
            <div>
              <h3 style={{ fontSize: '1.5em', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>用户为本</h3>
              <p style={{ color: '#999', lineHeight: '1.8', fontSize: '1.1em' }}>
                设计不仅仅是像素；它是为真实的人解决真实的问题。同理心是我最重要的工具。
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5em', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>协作共赢</h3>
              <p style={{ color: '#999', lineHeight: '1.8', fontSize: '1.1em' }}>
                伟大的产品由伟大的团队打造。我在设计、工程和产品紧密合作的环境中茁壮成长。
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5em', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>持续迭代</h3>
              <p style={{ color: '#999', lineHeight: '1.8', fontSize: '1.1em' }}>
                完美是一个移动的目标。我相信尽早发布，衡量结果，并根据数据和反馈进行迭代。
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;