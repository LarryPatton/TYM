import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { useClipboard } from '../hooks/useClipboard'; // 引入 Hook
import { useTitle } from '../hooks/useTitle';

const Home = () => {
  useTitle('首页');
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredThemes, setFeaturedThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 方案 4 所需的状态
  const [hoveredThemeItem, setHoveredThemeItem] = useState(null);
  const { copiedId, copy } = useClipboard();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 获取精选项目
        const projectsResponse = await fetch(`${import.meta.env.BASE_URL}projects.csv`);
        const projectsCsv = await projectsResponse.text();
        const projectsData = Papa.parse(projectsCsv, { header: true, skipEmptyLines: true }).data;
        
        const featuredProjs = projectsData
          .filter(p => p.is_featured === 'true')
          .map((item, index) => {
            let size = 'normal';
            if (index === 0) size = 'large';
            else if (index === 3) size = 'wide';
            return { ...item, size };
          });

        // 2. 获取精选主题
        const themesResponse = await fetch(`${import.meta.env.BASE_URL}themes.csv`);
        const themesCsv = await themesResponse.text();
        const themesData = Papa.parse(themesCsv, { header: true, skipEmptyLines: true }).data;

        const themesMap = {};
        themesData.forEach(item => {
          if (item.is_featured === 'true') {
            if (!themesMap[item.category]) {
              themesMap[item.category] = [];
            }
            // 增加展示数量：每个大类最多 12 个
            if (themesMap[item.category].length < 12) { 
              themesMap[item.category].push(item); 
            }
          }
        });

        // 增加展示大类数量：展示前 4 个大类
        const featuredThemesList = Object.keys(themesMap)
          .slice(0, 4) 
          .map(category => ({
            title: category,
            items: themesMap[category]
          }));

        setFeaturedProjects(featuredProjs);
        setFeaturedThemes(featuredThemesList);
        
        // 默认选中第一个主题的第一个子项
        if (featuredThemesList.length > 0 && featuredThemesList[0].items.length > 0) {
          setHoveredThemeItem(featuredThemesList[0].items[0]);
        }

        setLoading(false);

      } catch (error) {
        console.error('Error loading home data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 动画配置
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // 滚动到指定区域
  const scrollToFeatured = () => {
    const element = document.getElementById('featured-projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return null;

  return (
    <div>
      {/* 1. Hero Section - 页面加载即触发 */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ 
          padding: '100px 0 120px 0', 
          borderBottom: '1px solid #eee',
          marginBottom: '80px'
        }}
      >
        <div style={{ maxWidth: '900px' }}>
          <motion.h1 
            variants={fadeInUp}
            style={{ 
              fontSize: '5em', 
              fontWeight: '900', 
              lineHeight: '1.1', 
              letterSpacing: '-2px', 
              marginBottom: '30px',
              color: '#000'
            }}
          >
            Create.<br/>
            Innovate.<br/>
            Inspire.
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            style={{ 
              fontSize: '1.5em', 
              color: '#666', 
              maxWidth: '600px', 
              lineHeight: '1.6',
              marginBottom: '50px'
            }}
          >
            汇聚内部创新力量与外部商业智慧。<br/>
            探索每一个像素背后的无限可能。
          </motion.p>
          <motion.div variants={fadeInUp}>
            <button 
              onClick={scrollToFeatured}
              style={{ 
                display: 'inline-block',
                padding: '15px 40px', 
                background: '#000', 
                color: '#fff', 
                border: 'none',
                borderRadius: '30px',
                fontWeight: '500',
                fontSize: '1.1em',
                cursor: 'pointer'
              }}
            >
              Start Exploring
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. 精选项目 - 滚动触发 */}
      <section id="featured-projects" style={{ marginBottom: '120px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}
        >
          <h2 style={{ fontSize: '2.5em', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>Featured.</h2>
          <Link to="/projects" style={{ color: '#000', textDecoration: 'underline', fontWeight: '500' }}>View All Projects</Link>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gridAutoRows: '300px',
            gap: '20px' 
          }}
        >
          {featuredProjects.map((item, index) => {
            let gridStyle = {};
            if (item.size === 'large') gridStyle = { gridColumn: 'span 2', gridRow: 'span 2' };
            else if (item.size === 'wide') gridStyle = { gridColumn: 'span 3', gridRow: 'span 1' };
            else gridStyle = { gridColumn: 'span 1', gridRow: 'span 1' };

            return (
              <Link 
                to={`/projects/${item.id}`} 
                key={item.id} 
                style={{ 
                  ...gridStyle, 
                  display: 'block', 
                  textDecoration: 'none' 
                }}
              >
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  style={{ 
                    background: '#f0f0f0', 
                    borderRadius: '16px', 
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '1.5em',
                    background: index % 2 === 0 ? '#e5e5e5' : '#dedede',
                    overflow: 'hidden'
                  }}>
                    {item.cover ? (
                      <img 
                        src={item.cover} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerText = item.name; }}
                      />
                    ) : (
                      `[Image: ${item.name}]`
                    )}
                  </div>
                  
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    left: '20px',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{item.name}</span>
                    <span style={{ fontSize: '0.8em', color: '#666' }}>{item.type}</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </section>

      {/* 3. 热门主题 - 方案 4 (列表 + 悬停预览) */}
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5em', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>Themes.</h2>
            <Link to="/themes" style={{ color: '#000', textDecoration: 'underline', fontWeight: '500' }}>Explore Library</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            {/* 左侧：分类列表 */}
            <div>
              {featuredThemes.map((theme, idx) => (
                <div key={idx} style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1.2em', margin: 0, borderLeft: '3px solid #000', paddingLeft: '10px' }}>
                      {theme.title}
                    </h3>
                    {/* 引导至主题页面的链接，传递 category 状态 */}
                    <Link 
                      to="/themes" 
                      state={{ category: theme.title }}
                      style={{ fontSize: '0.9em', color: '#999', textDecoration: 'none' }}
                    >
                      View All &gt;
                    </Link>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {theme.items.map((item, i) => {
                      const isHovered = hoveredThemeItem?.id === item.id;
                      return (
                        <span 
                          key={i}
                          onMouseEnter={() => setHoveredThemeItem(item)}
                          onClick={() => copy(item.prompt, item.id)}
                          style={{ 
                            padding: '8px 16px', 
                            border: '1px solid #eee', 
                            borderRadius: '20px', 
                            cursor: 'pointer', 
                            fontSize: '0.9em', 
                            transition: 'all 0.2s',
                            background: isHovered ? '#000' : '#fff',
                            color: isHovered ? '#fff' : '#000',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          {item.name}
                          
                          {/* 悬停时显示复制图标 */}
                          <motion.span 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ 
                              width: isHovered ? 'auto' : 0, 
                              opacity: isHovered ? 1 : 0 
                            }}
                            style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}
                          >
                            <span style={{ fontSize: '0.8em', marginLeft: '4px' }}>❐</span>
                          </motion.span>
                          
                          {/* 复制反馈 */}
                          {copiedId === item.id && (
                            <span style={{ 
                              position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
                              background: '#000', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em',
                              whiteSpace: 'nowrap', zIndex: 10
                            }}>
                              Copied!
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 右侧：大图预览 */}
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'sticky', top: '100px', 
                aspectRatio: '4/3', 
                background: '#f5f5f5', 
                borderRadius: '16px', 
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
              }}>
                {hoveredThemeItem ? (
                  <motion.div
                    key={hoveredThemeItem.id} // Key 变化触发动画
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%', height: '100%', position: 'relative' }}
                  >
                    {hoveredThemeItem.image_path ? (
                      <img 
                        src={hoveredThemeItem.image_path} 
                        alt={hoveredThemeItem.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { 
                          // 防止死循环
                          if (e.target.dataset.retried) {
                            e.target.style.display = 'none'; 
                            e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ccc;flex-direction:column"><div style="font-size:2em;margin-bottom:10px">[Image]</div><div>${hoveredThemeItem.name}</div></div>`;
                            return;
                          }
                          
                          // 标记已重试
                          e.target.dataset.retried = "true";
                          
                          // 尝试切换扩展名
                          const currentSrc = e.target.src;
                          if (currentSrc.endsWith('.png')) {
                            e.target.src = currentSrc.replace('.png', '.jpg');
                          } else if (currentSrc.endsWith('.jpg')) {
                            e.target.src = currentSrc.replace('.jpg', '.png');
                          } else {
                            e.target.style.display = 'none'; 
                            e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ccc;flex-direction:column"><div style="font-size:2em;margin-bottom:10px">[Image]</div><div>${hoveredThemeItem.name}</div></div>`;
                          }
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2em', marginBottom: '10px' }}>[Image]</div>
                        <div>{hoveredThemeItem.name}</div>
                      </div>
                    )}
                    
                    {/* 预览图上的信息浮层 (已移除) */}
                  </motion.div>
                ) : (
                  <span style={{ color: '#ccc' }}>Hover over a tag to preview</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;