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
    <div style={{ padding: '40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3em', fontWeight: '900', marginBottom: '30px' }}>案例研究.</h1>
        
        {/* Search & Filter Bar */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap', 
          alignItems: 'center',
          background: '#f9f9f9',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <input 
            type="text" 
            placeholder="搜索项目..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: '10px 15px', 
              borderRadius: '8px', 
              border: '1px solid #ddd',
              minWidth: '200px',
              flex: 1
            }}
          />
          
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <option value="">所有角色</option>
            <option value="产品设计师">产品设计师</option>
            <option value="主设计师">主设计师</option>
          </select>

          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <option value="">所有行业</option>
            <option value="金融">金融</option>
            <option value="零售">零售</option>
          </select>

          <button 
            onClick={() => { setSearch(''); setFilter({ role: '', industry: '', deliverable: '', year: '' }); }}
            style={{ padding: '10px 20px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
          >
            清除筛选
          </button>
        </div>
      </div>

      {/* Case List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
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
              gap: '40px',
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: '20px',
              overflow: 'hidden',
              padding: '30px'
            }}
          >
            {/* Cover Image */}
            <div style={{ 
              background: item.cover, 
              borderRadius: '12px', 
              height: '100%', 
              minHeight: '200px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#999'
            }}>
              [ 封面图 ]
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <h2 style={{ fontSize: '1.8em', fontWeight: 'bold', margin: 0 }}>{item.title}</h2>
                  <span style={{ background: '#f0f0f0', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8em', color: '#666' }}>{item.year}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '0.95em', marginBottom: '20px' }}>
                  <span>{item.role}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                  <span>•</span>
                  <span>{item.team}</span>
                </div>

                <div style={{ fontSize: '1.1em', fontWeight: '500', marginBottom: '20px', color: '#333' }}>
                  结果: {item.result}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ border: '1px solid #eee', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85em', color: '#888' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <Link to={`/work/case-studies/${item.id}`}>
                  <button style={{ 
                    padding: '10px 24px', 
                    background: '#000', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '30px', 
                    cursor: 'pointer',
                    fontWeight: '500'
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