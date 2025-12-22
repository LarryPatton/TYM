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
    <div style={{ padding: 'var(--space-3xl) 0' }}>
      {/* Hero Section */}
      <section style={{ padding: 'var(--space-4xl) 0 var(--space-section) 0', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-3xl)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 var(--space-lg)' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'var(--text-display)', fontWeight: '900', lineHeight: 'var(--line-height-tight)', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}
          >
            {project.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'var(--text-h3)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2xl)', maxWidth: '800px', lineHeight: 'var(--line-height-base)' }}
          >
            {project.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: 'var(--space-2xl)', marginBottom: 'var(--space-3xl)', flexWrap: 'wrap', fontSize: 'var(--text-body)', color: 'var(--color-text-main)' }}
          >
            <div>
              <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>角色</div>
              <div style={{ fontWeight: '600' }}>{project.role}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>周期</div>
              <div style={{ fontWeight: '600' }}>{project.duration}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>团队</div>
              <div style={{ fontWeight: '600' }}>{project.team}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>类型</div>
              <div style={{ fontWeight: '600' }}>{project.type}</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)' }}>工具</div>
              <div style={{ fontWeight: '600' }}>{project.tools}</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3xl)', border: '1px solid var(--color-border)' }}
          >
            <div style={{ fontWeight: '600', marginBottom: 'var(--space-md)', fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-serif)' }}>关键结果</div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)' }}>
              {project.results.map((res, i) => (
                <li key={i} style={{ marginBottom: 'var(--space-xs)' }}>{res}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: 'var(--space-md)' }}
          >
            <button 
              onClick={() => scrollToSection('deliverables')}
              style={{ padding: '12px 30px', background: 'var(--color-text-main)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-body)', cursor: 'pointer', fontWeight: '600' }}
            >
              查看产出
            </button>
            <Link to="/contact">
              <button style={{ padding: '12px 30px', background: 'transparent', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-body)', cursor: 'pointer', fontWeight: '500' }}>
                联系我
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--space-3xl)', position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-lg)' }}>
        
        {/* Sticky TOC */}
        <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-light)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '1px' }}>目录</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map(section => (
              <li key={section.id} style={{ marginBottom: 'var(--space-sm)' }}>
                <button 
                  onClick={() => scrollToSection(section.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    textAlign: 'left',
                    fontSize: 'var(--text-sm)',
                    color: activeSection === section.id ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                    fontWeight: activeSection === section.id ? '600' : '400',
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
          <section id="overview" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>概览</h2>
            <div style={{ background: 'var(--color-bg-alt)', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)', marginBottom: 'var(--space-lg)' }}>
              [ 主视觉 / 英雄图 ]
            </div>
            <p style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-muted)' }}>
              该项目旨在重新设计核心银行体验，使其对年轻人群更具吸引力和直观性。
              我们专注于简化复杂的财务数据，并引入游戏化元素以鼓励储蓄。
            </p>
          </section>

          {/* 2. Context */}
          <section id="context" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>背景</h2>
            <p style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
              金融科技市场充斥着复杂的工具，常常让用户感到不知所措。
              我们的竞品分析显示，市场上缺乏一款讲“人话”的“友好”金融 App。
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 'var(--text-body)', fontWeight: '600', marginBottom: 'var(--space-sm)' }}>用户痛点</h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  <li>令人困惑的术语</li>
                  <li>隐藏费用</li>
                  <li>杂乱的界面</li>
                </ul>
              </div>
              <div style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 'var(--text-body)', fontWeight: '600', marginBottom: 'var(--space-sm)' }}>市场机会</h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  <li>Z 世代金融素养</li>
                  <li>可视化支出追踪</li>
                  <li>社交功能</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Insights */}
          <section id="insights" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>洞察</h2>
            <p style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-muted)' }}>
              通过用户访谈，我们发现用户不想在手机上看到“电子表格”。
              他们想知道“我今天能花多少钱？”，而不是“我的确切余额是多少？”。
            </p>
          </section>

          {/* 4. Goals */}
          <section id="goals" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>目标</h2>
            <ul style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
              <li style={{ marginBottom: 'var(--space-sm)' }}>简化仪表盘，只显示必要信息。</li>
              <li style={{ marginBottom: 'var(--space-sm)' }}>创建一个感觉亲切且安全的设计系统。</li>
              <li style={{ marginBottom: 'var(--space-sm)' }}>将转账所需时间减少 50%。</li>
            </ul>
          </section>

          {/* 5. Strategy */}
          <section id="strategy" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>策略</h2>
            <p style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-muted)' }}>
              我们采用了“移动优先”的策略，重点关注手势操作。
              我们决定将次要操作隐藏在抽屉中，以保持主界面整洁。
            </p>
          </section>

          {/* 6. Process */}
          <section id="process" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>流程</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
              {['调研', '定义', '构思', '原型', '测试'].map((step, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--color-text-main)', color: 'var(--color-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{i + 1}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{step}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-muted)' }}>
              我们为每个阶段进行了为期 2 周的冲刺。构思阶段涉及绘制 50 多个不同的仪表盘布局草图，然后缩小到 3 个概念。
            </p>
          </section>

          {/* 7. Deliverables (Accordion) */}
          <section id="deliverables" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>产出</h2>
            
            {['UI 视觉系统', '组件库', '高保真原型', '营销资产'].map((item, i) => (
              <details key={i} style={{ marginBottom: 'var(--space-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <summary style={{ padding: 'var(--space-md)', cursor: 'pointer', fontWeight: '600', background: 'var(--color-bg-subtle)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-body)' }}>
                  {item}
                  <span>+</span>
                </summary>
                <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg)' }}>
                  <div style={{ background: 'var(--color-bg-alt)', width: '100%', height: '200px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
                    [ {item} 预览内容 ]
                  </div>
                  <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    {item} 的详细文档和资产。
                  </p>
                </div>
              </details>
            ))}
          </section>

          {/* 8. Results */}
          <section id="results" style={{ marginBottom: 'var(--space-section)' }}>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: '600', marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-serif)' }}>结果与反思</h2>
            <p style={{ fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
              重构取得了巨大成功。发布后的分析显示，日活跃用户显著增加。
              然而，我们了解到一些老年用户发现新的手势导航很困难，这导致了后续更新中添加了可选的按钮控制。
            </p>
            <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)' }}>
              <strong>关键收获:</strong> 创新不应以牺牲可访问性为代价。始终为新的交互模式提供备选方案。
            </div>
          </section>

        </div>
      </div>

      {/* Next Project */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3xl)', marginTop: 'var(--space-3xl)', maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-3xl) var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: '600', margin: 0, fontFamily: 'var(--font-serif)' }}>下一个项目</h3>
          <Link to="/work/case-studies" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>查看所有项目 →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
          <div style={{ height: '300px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)', fontSize: 'var(--text-h3)' }}>
            [ 下一个案例 ]
          </div>
          <div style={{ height: '300px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)', fontSize: 'var(--text-h3)' }}>
            [ 相关案例 ]
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetail;