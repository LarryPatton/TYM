import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Papa from 'papaparse';

const SmartBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [projectMap, setProjectMap] = useState({});

  // 加载项目数据以获取名称映射
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/projects.csv');
        const csvText = await response.text();
        const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
        
        const map = {};
        data.forEach(p => {
          map[p.id] = p.name;
        });
        setProjectMap(map);
      } catch (error) {
        console.error('Error loading project names for breadcrumbs:', error);
      }
    };

    fetchProjects();
  }, []);

  // 路由映射表
  const routeMap = {
    'projects': '项目库',
    'themes': '主题库',
    'demo': '交互演示',
    'demo2': 'Hero演示',
    'demo3': '主题预览演示'
  };

  // 如果是首页，不显示面包屑
  if (pathnames.length === 0) return null;

  return (
    <nav style={{ padding: '20px 40px', fontSize: '0.9em', color: '#666' }}>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
        {/* 首页节点 */}
        <li>
          <Link to="/" style={{ textDecoration: 'none', color: '#999', fontWeight: '500' }}>首页</Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // 获取显示名称
          let displayName = routeMap[value] || projectMap[value] || value;

          // 特殊处理：如果是 t1, t2, t3, t4 这种模板路径，隐藏
          if (['t1', 't2', 't3', 't4'].includes(value)) {
             return null; 
          }

          return (
            <li key={to} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ margin: '0 10px', color: '#ccc' }}>/</span>
              
              {isLast ? (
                <span style={{ color: '#000', fontWeight: '600' }}>{displayName}</span>
              ) : (
                <Link 
                  to={to} 
                  style={{ textDecoration: 'none', color: '#666', cursor: 'pointer' }}
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SmartBreadcrumbs;