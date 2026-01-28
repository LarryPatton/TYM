import React from 'react';
import { Link } from 'react-router-dom';

const templates = [
  { id: 'home', name: 'Home', description: '首页布局 - Bento Grid 精选项目 + 热门主题悬停预览', path: '/template/home' },
  { id: 'list', name: 'Project List', description: '项目列表 - 内部项目 Bento Grid + 外部项目响应式卡片', path: '/template/list' },
  { id: 'themes', name: 'Theme List', description: '主题列表 - 分类筛选 + 主题卡片网格', path: '/template/themes' },
  { id: 'split', name: 'Template: Split', description: '分屏式详情页 - 左右分屏 Hero + 瀑布流卡片', path: '/template/split' },
  { id: 'magazine', name: 'Template: Magazine', description: '杂志风详情页 - 杂志排版风格', path: '/template/magazine' },
  { id: 'immersive', name: 'Template: Immersive', description: '沉浸式详情页 - 全屏沉浸式体验', path: '/template/immersive' },
];

const TemplateSelector = () => {
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: '4em', fontWeight: '900', letterSpacing: '-2px', marginBottom: '20px' }}>
          Template Gallery
        </h1>
        <p style={{ fontSize: '1.3em', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          选择一个模板开始预览。这些模板可用于构建您自己的项目展示网站。
        </p>
      </div>

      {/* Template Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {templates.map((template) => (
          <Link
            key={template.id}
            to={template.path}
            style={{
              display: 'block',
              padding: '40px',
              background: '#fafafa',
              borderRadius: '16px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.3s ease',
              border: '1px solid #eee'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Placeholder */}
            <div style={{
              height: '180px',
              background: '#e0e0e0',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '0.9em'
            }}>
              [ Preview ]
            </div>
            
            <h3 style={{ fontSize: '1.4em', margin: '0 0 10px 0', fontWeight: '600' }}>
              {template.name}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.95em', lineHeight: 1.5 }}>
              {template.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
