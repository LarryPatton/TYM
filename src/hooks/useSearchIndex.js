import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useSearchIndex = () => {
  const [index, setIndex] = useState({ projects: [], themes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 并行加载 CSV
        const [projectsRes, themesRes] = await Promise.all([
          fetch('/projects.csv'),
          fetch('/themes.csv')
        ]);

        const projectsCsv = await projectsRes.text();
        const themesCsv = await themesRes.text();

        const projectsData = Papa.parse(projectsCsv, { header: true, skipEmptyLines: true }).data;
        const themesData = Papa.parse(themesCsv, { header: true, skipEmptyLines: true }).data;

        setIndex({
          projects: projectsData,
          themes: themesData
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading search index:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { index, loading };
};
