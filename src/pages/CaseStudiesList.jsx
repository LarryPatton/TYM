import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';

const CaseStudiesList = () => {
  useTitle('案例研究');

  const [filter, setFilter] = useState({
    role: '',
    industry: '',
    deliverable: '',
    year: ''
  });

  const [search, setSearch] = useState('');

  // Mock Data
  const cases = [
    {
      id: 'fintech-app',
      title: '金融科技 App 重构',
      role: '产品设计师',
      industry: '金融',
      deliverable: 'App 设计',
      year: '2023',
      duration: '6 个月',
      team: '5 人',
      result: '用户留存率提升 25%',
      tags: ['App', '用户研究', '设计系统'],
      cover: '#e0e0e0'
    },
    {
      id: 'ecommerce-platform',
      title: '全球电商平台',
      role: '主设计师',
      industry: '零售',
      deliverable: '网页设计',
      year: '2022',
      duration: '8 个月',
      team: '10 人',
      result: '转化率提升 15%',
      tags: ['Web', '策略', '品牌'],
      cover: '#d6d6d6'
    },
    {
      id: 'healthcare-dashboard',
      title: '医疗分析仪表盘',
      role: 'UX 设计师',
      industry: '医疗',
      deliverable: '仪表盘',
      year: '2023',
      duration: '4 个月',
      team: '3 人',
      result: '任务时间减少 40%',
      tags: ['B2B', '数据可视化', '原型'],
      cover: '#cccccc'
    }
  ];

  const filteredCases = cases.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filter.role ? item.role === filter.role : true;
    const matchesIndustry = filter.industry ? item.industry === filter.industry : true;
    // Add more filter logic as needed
    return matchesSearch && matchesRole && matchesIndustry;
  });

  return (
    <div style={{ padding: 'var(--space-3xl) 0' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-3xl)' }}>
        <h1 style={{ fontSize: 'var(--text-display)', fontWeight: '900', marginBottom: 'var(--space-xl)', fontFamily: 'var(--font-serif)', lineHeight: 'var(--line-height-tight)' }}>案例研究.</h1>
        
        {/* Search & Filter Bar */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-md)', 
          flexWrap: 'wrap', 
          alignItems: 'center',
          background: 'var(--color-bg-subtle)',
          padding: 'var(--space-lg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <input 
            type="text" 
            placeholder="搜索项目..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: '10px 15px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--color-border)',
              minWidth: '200px',
              flex: 1,
              fontSize: 'var(--text-body)',
              background: 'var(--color-bg)'
            }}
          />
          
          <select style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: 'var(--text-body)' }}>
            <option value="">所有角色</option>
            <option value="产品设计师">产品设计师</option>
            <option value="主设计师">主设计师</option>
          </select>

          <select style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: 'var(--text-body)' }}>
            <option value="">所有行业</option>
            <option value="金融">金融</option>
            <option value="零售">零售</option>
          </select>

          <button 
            onClick={() => { setSearch(''); setFilter({ role: '', industry: '', deliverable: '', year: '' }); }}
            style={{ padding: '10px 20px', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', textDecoration: 'underline', fontSize: 'var(--text-sm)' }}
          >
            清除筛选
          </button>
        </div>
      </div>

      {/* Case List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
        {filteredCases.map(item => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '300px 1fr', 
              gap: 'var(--space-2xl)',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              padding: 'var(--space-xl)'
            }}
          >
            {/* Cover Image */}
            <div style={{ 
              background: 'var(--color-bg-alt)', 
              borderRadius: 'var(--radius-lg)', 
              height: '100%', 
              minHeight: '200px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--color-text-light)'
            }}>
              [ 封面图 ]
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-sm)' }}>
                  <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', margin: 0, fontFamily: 'var(--font-serif)' }}>{item.title}</h2>
                  <span style={{ background: 'var(--color-bg-subtle)', padding: '5px 10px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>{item.year}</span>
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-lg)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
                  <span>{item.role}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                  <span>•</span>
                  <span>{item.team}</span>
                </div>

                <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: '500', marginBottom: 'var(--space-lg)', color: 'var(--color-text-main)' }}>
                  结果: {item.result}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ border: '1px solid var(--color-border)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-xl)' }}>
                <Link to={`/work/case-studies/${item.id}`}>
                  <button style={{ 
                    padding: '10px 24px', 
                    background: 'var(--color-text-main)', 
                    color: 'var(--color-bg)', 
                    border: 'none', 
                    borderRadius: 'var(--radius-full)', 
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: 'var(--text-sm)'
                  }}>
                    查看案例 →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CaseStudiesList;