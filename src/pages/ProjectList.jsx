import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { useTitle } from '../hooks/useTitle';
import { getAssetPath } from '../utils/path';

const ProjectList = () => {
  useTitle('项目列表');

  const [internalProjects, setInternalProjects] = useState([]);
  const [externalProjects, setExternalProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}projects.csv`);
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            const internal = [];
            const external = [];

            data.forEach((item, index) => {
              // 为 Bento Grid 分配大小
              // 逻辑：每 8 个项目中，第 1 个是 large (2x2)，第 4 和 7 个是 wide (2x1)
              const patternIndex = index % 8;
              let size = 'normal';
              if (patternIndex === 0) size = 'large';
              else if (patternIndex === 3 || patternIndex === 6) size = 'wide';

              const project = {
                ...item,
                size: size
              };

              if (item.type === '内部') {
                internal.push(project);
              } else {
                external.push(project);
              }
            });

            setInternalProjects(internal);
            setExternalProjects(external);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading projects...</div>;
  }

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: '60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px auto' }}>
        <h1 style={{ fontSize: '3.5em', fontWeight: '900', letterSpacing: '-1px', marginBottom: '20px' }}>Selected Works.</h1>
        <p style={{ fontSize: '1.2em', color: '#666', lineHeight: '1.6' }}>
          这里展示了我们最具代表性的内部研发成果与外部商业合作案例。<br/>每一个项目都代表了我们对技术与美学的极致追求。
        </p>
      </div>

      {/* 内部项目 - 震撼布局 (Bento Grid) */}
      <section style={{ marginBottom: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5em', margin: 0 }}>Internal Projects</h2>
          <div style={{ height: '1px', background: '#eee', flex: 1 }}></div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gridAutoRows: '280px', // 基础行高
          gap: '20px' 
        }}>
          {internalProjects.map((project, index) => {
            // 计算跨度样式
            let gridStyle = {};
            if (project.size === 'large') {
              gridStyle = { gridColumn: 'span 2', gridRow: 'span 2' }; // 2x2 大方块
            } else if (project.size === 'wide') {
              gridStyle = { gridColumn: 'span 2', gridRow: 'span 1' }; // 2x1 宽方块
            } else {
              gridStyle = { gridColumn: 'span 1', gridRow: 'span 1' }; // 1x1 普通方块
            }

            return (
              <Link to={`/projects/${project.id}`} key={project.id} style={{ 
                ...gridStyle, 
                display: 'block',
                position: 'relative', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                background: '#f0f0f0',
                cursor: 'pointer',
                textDecoration: 'none',
                group: 'card'
              }}>
                {/* 图片占位 - 铺满 */}
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {project.cover ? (
                    <img 
                      src={getAssetPath(project.cover)}
                      alt={project.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerText = project.name; }}
                    />
                  ) : (
                    <span style={{ color: '#fff', fontSize: '1.5em', fontWeight: 'bold' }}>{project.name}</span>
                  )}
                </div>

                {/* 悬浮文字信息 - 位于底部 */}
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
                  <p style={{ margin: 0, fontSize: '0.8em', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                </div>
              </Link>
            );
          })}

        </div>

        {/* 方案 A: 底部通栏 Banner (内部项目) */}
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

      {/* 外部项目 - 横向展示或紧凑网格 */}
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
          {externalProjects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                aspectRatio: '16/9', 
                background: '#f5f5f5', 
                borderRadius: '8px', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {project.cover ? (
                  <img 
                    src={getAssetPath(project.cover)}
                    alt={project.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerText = '[Image]'; }}
                  />
                ) : (
                  <span style={{ color: '#ccc' }}>[封面]</span>
                )}
              </div>
              <h3 style={{ fontSize: '1em', margin: '0 0 5px 0' }}>{project.name}</h3>
              <div style={{ fontSize: '0.8em', color: '#888' }}>商业合作</div>
            </Link>
          ))}

        </div>

        {/* 方案 A: 底部通栏 Banner (外部项目) */}
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