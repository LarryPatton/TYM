import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';
import { FullPageScroll, FullPageSection, DotNavigation } from '../components/FullPageScroll';

const About = () => {
  useTitle('关于');

  const [expandedJob, setExpandedJob] = useState(null);

  // Section 配置 - 可灵活修改背景色
  const sections = [
    { name: '关于我', bgColor: '#f8f8f8', textColor: '#111', dark: false },
    { name: '专业概况', bgColor: '#ffffff', textColor: '#111', dark: false },
    { name: '旅程', bgColor: '#f5f5f5', textColor: '#111', dark: false },
    { name: '价值观', bgColor: '#111111', textColor: '#fff', dark: true }
  ];

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
      desc: '获得学士学位，主修视觉传达。' 
    },
    { 
      year: '2017', 
      title: '初入职场', 
      subtitle: 'StartUp Alpha', 
      desc: '作为前端开发 & 设计师加入初创团队。' 
    },
    { 
      year: '2019', 
      title: '职业转型', 
      subtitle: 'Creative Studio', 
      desc: '转型为 UI/UX 设计师，深入研究动效设计。' 
    },
    { 
      year: '2021', 
      title: '核心骨干', 
      subtitle: 'Tech Innovators Inc.', 
      desc: '担任高级产品设计师，主导核心产品重构。' 
    },
    { 
      year: 'Now', 
      title: '持续探索', 
      subtitle: '独立开发者 & 设计师', 
      desc: '探索 AI 辅助设计与创意编程的边界。' 
    }
  ];

  return (
    <FullPageScroll>
        
        {/* Section 1: Hero */}
        <FullPageSection bgColor={sections[0].bgColor} textColor={sections[0].textColor}>
          <div style={{ maxWidth: '1000px', width: '100%', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: '1 1 350px', maxWidth: '500px' }}>
              <div style={{ width: '100px', height: '100px', background: '#ddd', borderRadius: '50%', marginBottom: '30px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                头像
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5em, 5vw, 4em)', fontWeight: '400', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                你好，我是 [名字]。
              </h1>
              <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
                一名会写代码的产品设计师。我致力于弥合设计与工程之间的鸿沟，打造既美观又实用的产品。
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button style={{ padding: '12px 28px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '1em', cursor: 'pointer', fontWeight: '500' }}>
                  下载简历
                </button>
                <Link to="/contact">
                  <button style={{ padding: '12px 28px', background: 'transparent', color: '#111', border: '1px solid #ddd', borderRadius: '100px', fontSize: '1em', cursor: 'pointer' }}>
                    联系我
                  </button>
                </Link>
              </div>
            </div>
            <div style={{ flex: '1 1 350px', maxWidth: '450px', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8em', fontWeight: '400', marginBottom: '20px' }}>我的故事</h3>
              <p style={{ lineHeight: '1.8', color: '#444', marginBottom: '16px', fontSize: '1em' }}>
                我的职业生涯始于开发，但我很快意识到我真正的热情在于设计与技术的交汇点。
              </p>
              <p style={{ lineHeight: '1.8', color: '#444', fontSize: '1em' }}>
                在过去的 6 年里，我帮助初创公司和企业推出了成功的数字产品。
              </p>
            </div>
          </div>
        </FullPageSection>

        {/* Section 2: 专业概况 */}
        <FullPageSection bgColor={sections[1].bgColor} textColor={sections[1].textColor}>
          <div style={{ maxWidth: '1100px', width: '100%' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', fontWeight: '400', marginBottom: '50px', textAlign: 'center' }}>专业概况</h2>
            
            {/* 能力模型 */}
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{ fontSize: '0.9em', fontWeight: '600', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', color: '#999' }}>能力模型</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {capabilities.map((cap, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -4 }}
                    style={{ padding: '28px', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '12px' }}
                  >
                    <div style={{ fontSize: '2em', marginBottom: '12px' }}>{cap.icon}</div>
                    <h4 style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '10px' }}>{cap.title}</h4>
                    <p style={{ color: '#666', lineHeight: '1.5', fontSize: '0.95em', marginBottom: '16px' }}>{cap.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {cap.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.75em', padding: '4px 10px', background: '#fff', borderRadius: '20px', color: '#666', border: '1px solid #eee' }}>{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 工作流 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#f9f9f9', padding: '30px', borderRadius: '12px' }}>
              {workflow.map((flow, index) => (
                <React.Fragment key={index}>
                  <div style={{ textAlign: 'center', flex: '1', minWidth: '100px' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2em', color: '#ddd', fontWeight: '900', marginBottom: '6px' }}>{flow.step}</div>
                    <div style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '4px' }}>{flow.title}</div>
                    <div style={{ fontSize: '0.85em', color: '#999' }}>{flow.desc}</div>
                  </div>
                  {index < workflow.length - 1 && (
                    <div style={{ color: '#ddd', fontSize: '1.2em' }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </FullPageSection>

        {/* Section 3: 旅程 */}
        <FullPageSection bgColor={sections[2].bgColor} textColor={sections[2].textColor}>
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', fontWeight: '400', marginBottom: '50px', textAlign: 'center' }}>旅程</h2>
            
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              {/* Vertical Line */}
              <div style={{ position: 'absolute', left: '14px', top: '8px', bottom: '8px', width: '2px', background: '#ddd' }}></div>

              {journey.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ marginBottom: '36px', position: 'relative' }}
                >
                  {/* Dot */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '-22px', 
                    top: '0', 
                    width: '14px', 
                    height: '14px', 
                    borderRadius: '50%', 
                    background: index === journey.length - 1 ? '#111' : '#fff', 
                    border: '3px solid #fff',
                    boxShadow: '0 0 0 2px #ddd',
                    zIndex: 1
                  }}></div>

                  {/* Content */}
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '24px', alignItems: 'baseline' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2em', color: '#bbb', fontWeight: '400', textAlign: 'right' }}>
                      {item.year}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2em', fontWeight: '600', marginBottom: '4px' }}>{item.title}</h3>
                      <div style={{ fontSize: '0.95em', color: '#666', marginBottom: '8px', fontWeight: '500' }}>{item.subtitle}</div>
                      <p style={{ color: '#888', lineHeight: '1.6', fontSize: '0.95em' }}>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FullPageSection>

        {/* Section 4: 价值观 */}
        <FullPageSection bgColor={sections[3].bgColor} textColor={sections[3].textColor}>
          <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5em', fontWeight: '400', marginBottom: '60px', color: '#fff' }}>价值观与理念</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              <div>
                <h3 style={{ fontSize: '1.4em', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>用户为本</h3>
                <p style={{ color: '#888', lineHeight: '1.7', fontSize: '1em' }}>
                  设计不仅仅是像素；它是为真实的人解决真实的问题。同理心是我最重要的工具。
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.4em', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>协作共赢</h3>
                <p style={{ color: '#888', lineHeight: '1.7', fontSize: '1em' }}>
                  伟大的产品由伟大的团队打造。我在设计、工程和产品紧密合作的环境中茁壮成长。
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.4em', fontWeight: '600', marginBottom: '16px', color: '#fff' }}>持续迭代</h3>
                <p style={{ color: '#888', lineHeight: '1.7', fontSize: '1em' }}>
                  完美是一个移动的目标。我相信尽早发布，衡量结果，并根据数据和反馈进行迭代。
                </p>
              </div>
            </div>
          </div>
        </FullPageSection>

        {/* 圆点导航 */}
        <DotNavigation sections={sections} />
        
      </FullPageScroll>
  );
};

export default About;