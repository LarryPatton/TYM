import React, { useState, useEffect } from 'react';
import { useTitle } from '../hooks/useTitle';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  useTitle(`案例研究: ${slug}`);

  const [activeSection, setActiveSection] = useState('overview');

  // Mock Data
  const project = {
    title: '金融科技 App 重构',
    subtitle: '为下一代重塑移动银行体验。',
    role: '产品设计师',
    duration: '6 个月',
    team: '5 人',
    type: 'App 设计',
    tools: 'Figma, Principle',
    results: [
      '用户留存率提升 25%',
      '客服工单减少 15%',
      'App Store 评分 4.8/5'
    ]
  };

  const sections = [
    { id: 'overview', title: '概览' },
    { id: 'context', title: '背景' },
    { id: 'insights', title: '洞察' },
    { id: 'goals', title: '目标' },
    { id: 'strategy', title: '策略' },
    { id: 'process', title: '流程' },
    { id: 'deliverables', title: '产出' },
    { id: 'results', title: '结果' },
  ];

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '80px 0 100px 0', borderBottom: '1px solid #eee', marginBottom: '60px' }}>
        <div style={{ maxWidth: '1000px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '4em', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px' }}
          >
            {project.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '1.5em', color: '#666', marginBottom: '40px', maxWidth: '800px' }}
          >
            {project.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '40px', marginBottom: '50px', flexWrap: 'wrap', fontSize: '0.95em', color: '#333' }}
          >
            <div>
              <div style={{ color: '#999', marginBottom: '5px' }}>角色</div>
              <div style={{ fontWeight: 'bold' }}>{project.role}</div>
            </div>
            <div>
              <div style={{ color: '#999', marginBottom: '5px' }}>周期</div>
              <div style={{ fontWeight: 'bold' }}>{project.duration}</div>
            </div>
            <div>
              <div style={{ color: '#999', marginBottom: '5px' }}>团队</div>
              <div style={{ fontWeight: 'bold' }}>{project.team}</div>
            </div>
            <div>
              <div style={{ color: '#999', marginBottom: '5px' }}>类型</div>
              <div style={{ fontWeight: 'bold' }}>{project.type}</div>
            </div>
            <div>
              <div style={{ color: '#999', marginBottom: '5px' }}>工具</div>
              <div style={{ fontWeight: 'bold' }}>{project.tools}</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: '#f9f9f9', padding: '30px', borderRadius: '16px', marginBottom: '50px' }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.1em' }}>关键结果</div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#444' }}>
              {project.results.map((res, i) => (
                <li key={i} style={{ marginBottom: '10px' }}>{res}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: '20px' }}
          >
            <button 
              onClick={() => scrollToSection('deliverables')}
              style={{ padding: '15px 30px', background: '#000', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1em', cursor: 'pointer', fontWeight: 'bold' }}
            >
              查看产出
            </button>
            <Link to="/contact">
              <button style={{ padding: '15px 30px', background: 'transparent', color: '#000', border: '1px solid #000', borderRadius: '30px', fontSize: '1em', cursor: 'pointer' }}>
                联系我
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '60px', position: 'relative' }}>
        
        {/* Sticky TOC */}
        <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <div style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#999', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>目录</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map(section => (
              <li key={section.id} style={{ marginBottom: '15px' }}>
                <button 
                  onClick={() => scrollToSection(section.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    textAlign: 'left',
                    fontSize: '1em',
                    color: activeSection === section.id ? '#000' : '#999',
                    fontWeight: activeSection === section.id ? 'bold' : 'normal',
                    padding: 0,
                    transition: 'color 0.2s'
                  }}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Sections */}
        <div style={{ maxWidth: '800px' }}>
          
          {/* 1. Overview */}
          <section id="overview" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>概览</h2>
            <div style={{ background: '#eee', width: '100%', height: '400px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', marginBottom: '30px' }}>
              [ 主视觉 / 英雄图 ]
            </div>
            <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444' }}>
              该项目旨在重新设计核心银行体验，使其对年轻人群更具吸引力和直观性。
              我们专注于简化复杂的财务数据，并引入游戏化元素以鼓励储蓄。
            </p>
          </section>

          {/* 2. Context */}
          <section id="context" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>背景</h2>
            <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>
              金融科技市场充斥着复杂的工具，常常让用户感到不知所措。
              我们的竞品分析显示，市场上缺乏一款讲“人话”的“友好”金融 App。
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '10px' }}>用户痛点</h3>
                <ul style={{ paddingLeft: '20px', color: '#666' }}>
                  <li>令人困惑的术语</li>
                  <li>隐藏费用</li>
                  <li>杂乱的界面</li>
                </ul>
              </div>
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '10px' }}>市场机会</h3>
                <ul style={{ paddingLeft: '20px', color: '#666' }}>
                  <li>Z 世代金融素养</li>
                  <li>可视化支出追踪</li>
                  <li>社交功能</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Insights */}
          <section id="insights" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>洞察</h2>
            <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444' }}>
              通过用户访谈，我们发现用户不想在手机上看到“电子表格”。
              他们想知道“我今天能花多少钱？”，而不是“我的确切余额是多少？”。
            </p>
          </section>

          {/* 4. Goals */}
          <section id="goals" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>目标</h2>
            <ul style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>简化仪表盘，只显示必要信息。</li>
              <li style={{ marginBottom: '10px' }}>创建一个感觉亲切且安全的设计系统。</li>
              <li style={{ marginBottom: '10px' }}>将转账所需时间减少 50%。</li>
            </ul>
          </section>

          {/* 5. Strategy */}
          <section id="strategy" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>策略</h2>
            <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444' }}>
              我们采用了“移动优先”的策略，重点关注手势操作。
              我们决定将次要操作隐藏在抽屉中，以保持主界面整洁。
            </p>
          </section>

          {/* 6. Process */}
          <section id="process" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>流程</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
              {['调研', '定义', '构思', '原型', '测试'].map((step, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: '40px', height: '40px', background: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontWeight: 'bold' }}>{i + 1}</div>
                  <div style={{ fontSize: '0.9em', fontWeight: '500' }}>{step}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444' }}>
              我们为每个阶段进行了为期 2 周的冲刺。构思阶段涉及绘制 50 多个不同的仪表盘布局草图，然后缩小到 3 个概念。
            </p>
          </section>

          {/* 7. Deliverables (Accordion) */}
          <section id="deliverables" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>产出</h2>
            
            {['UI 视觉系统', '组件库', '高保真原型', '营销资产'].map((item, i) => (
              <details key={i} style={{ marginBottom: '15px', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                <summary style={{ padding: '20px', cursor: 'pointer', fontWeight: 'bold', background: '#f9f9f9', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item}
                  <span>+</span>
                </summary>
                <div style={{ padding: '30px', background: '#fff' }}>
                  <div style={{ background: '#eee', width: '100%', height: '200px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    [ {item} 预览内容 ]
                  </div>
                  <p style={{ marginTop: '20px', color: '#666' }}>
                    {item} 的详细文档和资产。
                  </p>
                </div>
              </details>
            ))}
          </section>

          {/* 8. Results */}
          <section id="results" style={{ marginBottom: '100px' }}>
            <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '30px' }}>结果与反思</h2>
            <p style={{ fontSize: '1.1em', lineHeight: '1.8', color: '#444', marginBottom: '30px' }}>
              重构取得了巨大成功。发布后的分析显示，日活跃用户显著增加。
              然而，我们了解到一些老年用户发现新的手势导航很困难，这导致了后续更新中添加了可选的按钮控制。
            </p>
            <div style={{ padding: '30px', background: '#e8f5e9', borderRadius: '16px', color: '#2e7d32' }}>
              <strong>关键收获:</strong> 创新不应以牺牲可访问性为代价。始终为新的交互模式提供备选方案。
            </div>
          </section>

        </div>
      </div>

      {/* Next Project */}
      <section style={{ borderTop: '1px solid #eee', paddingTop: '80px', marginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: 0 }}>下一个项目</h3>
          <Link to="/work/case-studies" style={{ color: '#666' }}>查看所有项目 →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ height: '300px', background: '#f5f5f5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.2em' }}>
            [ 下一个案例 ]
          </div>
          <div style={{ height: '300px', background: '#f5f5f5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.2em' }}>
            [ 相关案例 ]
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetail;