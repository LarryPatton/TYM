import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import Template2 from './templates/Template2'; // Split
import Template3 from './templates/Template3'; // Magazine
import Template4 from './templates/Template4'; // Immersive

const ProjectDetailDispatcher = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 获取项目基本信息
        const projectsResponse = await fetch('/projects.csv');
        const projectsCsv = await projectsResponse.text();
        const projectsData = Papa.parse(projectsCsv, { header: true, skipEmptyLines: true }).data;
        const project = projectsData.find(p => p.id === id);

        if (!project) {
          console.warn(`Project ${id} not found.`);
          setLoading(false);
          return;
        }

        // 2. 获取项目章节结构
        const sectionsResponse = await fetch('/project_sections.csv');
        const sectionsCsv = await sectionsResponse.text();
        const sectionsData = Papa.parse(sectionsCsv, { header: true, skipEmptyLines: true }).data;
        
        // 筛选出当前项目的章节
        const categories = sectionsData
          .filter(s => s.project_id === id)
          .map((s, index) => ({
            id: `cat-${index}`,
            title: s.category,
            // 暂时生成模拟的 items，后续会从 project_details.csv 获取
            items: Array.from({ length: 4 }, (_, j) => ({
              id: `item-${index}-${j}`,
              name: `${s.category} Asset ${j + 1}`,
              prompt: `Placeholder prompt for ${s.category} asset ${j + 1}...`
            }))
          }));

        // 组装完整数据
        setProjectData({
          ...project,
          categories: categories.length > 0 ? categories : [
            // 如果没有章节数据，提供默认占位
            { id: 'cat-default', title: 'Default Section', items: [] }
          ]
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!projectData) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Project not found.</div>;
  }

  // 将组装好的 projectData 传递给模板
  switch (projectData.template_type) {
    case 'split':
      return <Template2 project={projectData} />;
    case 'magazine':
      return <Template3 project={projectData} />;
    case 'immersive':
    default:
      return <Template4 project={projectData} />;
  }
};

export default ProjectDetailDispatcher;