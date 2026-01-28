import React, { useState } from 'react';
import Template2 from './templates/Template2'; // Split
import Template3 from './templates/Template3'; // Magazine
import Template4 from './templates/Template4'; // Immersive

// 示例项目数据
const mockProjectData = {
  id: 'demo_project',
  name: 'Demo Project',
  description: '这是一个演示项目，展示了模板的各种功能和布局。',
  type: '内部',
  template_type: 'immersive', // 默认模板类型
  categories: [
    {
      id: 'cat-1',
      title: '概念设计',
      items: [
        { id: 'item-1-1', name: '方案一', prompt: 'Concept design option A with modern aesthetics' },
        { id: 'item-1-2', name: '方案二', prompt: 'Concept design option B with minimalist style' },
        { id: 'item-1-3', name: '方案三', prompt: 'Concept design option C with futuristic elements' },
      ]
    },
    {
      id: 'cat-2',
      title: '视觉效果',
      items: [
        { id: 'item-2-1', name: '日景渲染', prompt: 'Daytime rendering with natural lighting' },
        { id: 'item-2-2', name: '夜景渲染', prompt: 'Night rendering with ambient lighting' },
        { id: 'item-2-3', name: '鸟瞰视角', prompt: 'Aerial view rendering' },
      ]
    },
    {
      id: 'cat-3',
      title: '细节展示',
      items: [
        { id: 'item-3-1', name: '材质细节', prompt: 'Material detail closeup' },
        { id: 'item-3-2', name: '结构细节', prompt: 'Structural detail view' },
      ]
    },
  ]
};

const ProjectDetailDispatcher = () => {
  const [currentTemplate, setCurrentTemplate] = useState('immersive');

  // 创建带有当前模板类型的项目数据
  const projectData = {
    ...mockProjectData,
    template_type: currentTemplate
  };

  return (
    <div>
      {/* 模板切换控制器 */}
      <div style={{
        position: 'fixed',
        top: '100px',
        right: '30px',
        zIndex: 1000,
        background: '#fff',
        padding: '15px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid #eee'
      }}>
        <div style={{ fontSize: '0.8em', color: '#999', marginBottom: '10px' }}>切换模板</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'split', label: 'Split' },
            { key: 'magazine', label: 'Magazine' },
            { key: 'immersive', label: 'Immersive' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setCurrentTemplate(t.key)}
              style={{
                padding: '6px 12px',
                border: '1px solid',
                borderColor: currentTemplate === t.key ? '#000' : '#ddd',
                background: currentTemplate === t.key ? '#000' : '#fff',
                color: currentTemplate === t.key ? '#fff' : '#666',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85em'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 渲染对应模板 */}
      {currentTemplate === 'split' && <Template2 project={projectData} />}
      {currentTemplate === 'magazine' && <Template3 project={projectData} />}
      {currentTemplate === 'immersive' && <Template4 project={projectData} />}
    </div>
  );
};

export default ProjectDetailDispatcher;