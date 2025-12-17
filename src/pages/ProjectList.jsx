import React from 'react';
import { useTitle } from '../hooks/useTitle';

// 示例数据 - 内部项目
const mockInternalProjects = [
  { id: 'int_1', name: 'Project Alpha', description: '一款创新的AI驱动产品', size: 'large' },
  { id: 'int_2', name: 'Project Beta', description: '下一代用户体验设计', size: 'normal' },
  { id: 'int_3', name: 'Project Gamma', description: '高性能数据可视化平台', size: 'normal' },
  { id: 'int_4', name: 'Project Delta', description: '跨平台开发框架', size: 'wide' },
  { id: 'int_5', name: 'Project Epsilon', description: '智能推荐引擎', size: 'normal' },
  { id: 'int_6', name: 'Project Zeta', description: '实时协作工具', size: 'normal' },
];

// 示例数据 - 外部项目
const mockExternalProjects = [
  { id: 'ext_1', name: 'Client Project A', description: '电商平台重构' },
  { id: 'ext_2', name: 'Client Project B', description: '品牌官网设计' },
  { id: 'ext_3', name: 'Client Project C', description: '移动端App开发' },
  { id: 'ext_4', name: 'Client Project D', description: '数据大屏可视化' },
];

const ProjectList = () => {
  useTitle('项目列表');

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: '60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px auto' }}>
        <h1 style={{ fontSize: '3.5em', fontWeight: '900', letterSpacing: '-1px', marginBottom: '20px' }}>Selected Works.</h1>
        <p style={{ fontSize: '1.2em', color: '#666', lineHeight: '1.6' }}>
          这里展示了我们最具代表性的内部研发成果与外部商业合作案例。<br/>每一个项目都代表了我们对技术与美学的极致追求。
        </p>
      </div>

      {/* 内部项目 - Bento Grid */}
      <section style={{ marginBottom: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5em', margin: 0 }}>Internal Projects</h2>
          <div style={{ height: '1px', background: '#eee', flex: 1 }}></div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gridAutoRows: '280px',
          gap: '20px' 
        }}>
          {mockInternalProjects.map((project, index) => {
            let gridStyle = {};
            if (project.size === 'large') {
              gridStyle = { gridColumn: 'span 2', gridRow: 'span 2' };
            } else if (project.size === 'wide') {
              gridStyle = { gridColumn: 'span 2', gridRow: 'span 1' };
            } else {
              gridStyle = { gridColumn: 'span 1', gridRow: 'span 1' };
            }

            return (
              <div key={project.id} style={{ 
                ...gridStyle, 
                display: 'block',
                position: 'relative', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                background: '#f0f0f0',
                cursor: 'pointer'
              }}>
                {/* 图片占位 */}
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: index % 2 === 0 ? '#333' : '#444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '1.2em'
                }}>
                  [ {project.name} ]
                </div>

                {/* 悬浮文字信息 */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  padding: '20px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  color: '#fff'
                }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: project.size === 'large' ? '1.5em' : '1.1em' }}>{project.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.8em', opacity: 0.8 }}>
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部通栏 Banner */}
        <div style={{ 
          marginTop: '40px', 
          padding: '30px', 
          background: '#fafafa', 
          borderRadius: '12px', 
          textAlign: 'center',
          color: '#999',
          fontSize: '0.9em',
          letterSpacing: '1px',
          border: '1px solid #eee'
        }}>
          — MORE INTERNAL PROJECTS COMING SOON —
        </div>
      </section>

      {/* 外部项目 - 响应式网格 */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5em', margin: 0 }}>External Collaborations</h2>
          <div style={{ height: '1px', background: '#eee', flex: 1 }}></div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {mockExternalProjects.map((project, index) => (
            <div key={project.id} style={{ cursor: 'pointer' }}>
              <div style={{ 
                aspectRatio: '16/9', 
                background: index % 2 === 0 ? '#e5e5e5' : '#d5d5d5', 
                borderRadius: '8px', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}>
                [ {project.name} ]
              </div>
              <h3 style={{ fontSize: '1em', margin: '0 0 5px 0' }}>{project.name}</h3>
              <div style={{ fontSize: '0.8em', color: '#888' }}>商业合作</div>
            </div>
          ))}
        </div>

        {/* 底部通栏 Banner */}
        <div style={{ 
          marginTop: '40px', 
          padding: '30px', 
          background: '#fafafa', 
          borderRadius: '12px', 
          textAlign: 'center',
          color: '#999',
          fontSize: '0.9em',
          letterSpacing: '1px',
          border: '1px solid #eee'
        }}>
          — MORE COLLABORATIONS COMING SOON —
        </div>
      </section>
    </div>
  );
};

export default ProjectList;