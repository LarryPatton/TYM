import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * 单个作品项的滚动展示组件
 */
const ProjectItem = ({ project, index, totalProjects }) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 标题动画：淡入淡出 + 向上位移
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8],
    [0, 1, 1, 1, 0]
  );
  
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8],
    [100, 0, 0, -20, -100]
  );

  const titleScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 0.8],
    [0.9, 1, 1, 0.95]
  );

  // 内容卡片 3D 卷轴动画
  const cardRotateX = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.55],
    [45, 0, 0]
  );

  const cardOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.6, 0.75],
    [0, 1, 1, 0]
  );

  const cardScale = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.55, 0.75],
    [0.85, 1, 1, 0.9]
  );

  const cardY = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.55, 0.75],
    [60, 0, 0, -40]
  );

  // 背景预告文字动画
  const bgTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.7],
    [0.15, 0.08, 0.08, 0]
  );

  const bgTextY = useTransform(
    scrollYProgress,
    [0, 0.5, 0.8],
    [200, 0, -150]
  );

  return (
    <div 
      ref={containerRef}
      style={{
        height: '100vh',  // 缩短切换间隔，更快速的轮播
        position: 'relative',
      }}
    >
      {/* Sticky 容器 */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#0a0a0a',
        }}
      >
        {/* 背景层叠大字 - 下一个项目预告 */}
        {index < totalProjects - 1 && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              x: '-50%',
              opacity: bgTextOpacity,
              y: bgTextY,
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontWeight: '700',
              color: '#333',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {project.nextTitle || ''}
          </motion.div>
        )}

        {/* 主标题层 */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            scale: titleScale,
            textAlign: 'center',
            zIndex: 10,
            willChange: 'transform, opacity',
          }}
        >
          {/* 小标题/副标题 */}
          <motion.p
            style={{
              fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '16px',
            }}
          >
            {project.subtitle}
          </motion.p>
          
          {/* 大标题 */}
          <motion.h2
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: '700',
              color: '#fff',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {project.title}
          </motion.h2>

          {/* 描述文字 */}
          <motion.p
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
              color: '#888',
              marginTop: '20px',
              maxWidth: '500px',
              lineHeight: 1.6,
            }}
          >
            {project.desc}
          </motion.p>
        </motion.div>

        {/* 3D 卷轴内容卡片 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            width: 'min(85vw, 900px)',
            opacity: cardOpacity,
            rotateX: cardRotateX,
            scale: cardScale,
            y: cardY,
            transformPerspective: 1200,
            transformOrigin: 'center bottom',
            willChange: 'transform, opacity',
            zIndex: 5,
          }}
        >
          <Link 
            to={`/work/the-case/${project.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                aspectRatio: '16/9',
                background: project.cover || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* 封面图片 */}
              {project.coverImage ? (
                <img 
                  src={project.coverImage} 
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{ 
                  color: '#444', 
                  fontSize: '1.5rem',
                  fontWeight: '500',
                }}>
                  [ 项目封面 ]
                </div>
              )}

              {/* 悬浮遮罩 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(4px)',
                }}
              >
                查看项目详情 →
              </motion.div>
            </div>
          </Link>
        </motion.div>

        {/* 滚动提示 */}
        {index === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#555',
              fontSize: '0.8rem',
            }}
          >
            <span>向下滚动浏览</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '20px',
                height: '30px',
                border: '2px solid #444',
                borderRadius: '10px',
                position: 'relative',
              }}
            >
              <motion.div
                animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: '4px',
                  height: '6px',
                  background: '#666',
                  borderRadius: '2px',
                  position: 'absolute',
                  top: '6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/**
 * 滚动视差展示主组件
 */
const ScrollParallaxShowcase = ({ projects, sectionTitle = "精选作品" }) => {
  // 为每个项目添加下一个项目的标题信息
  const projectsWithNext = projects.map((project, index) => ({
    ...project,
    nextTitle: index < projects.length - 1 ? projects[index + 1].title : null,
  }));

  return (
    <section
      style={{
        background: '#0a0a0a',
        position: 'relative',
      }}
    >
      {/* 顶部区域标题 - 已移除，直接展示作品 */}
      <div style={{ height: '10vh', background: '#0a0a0a' }} />

      {/* 项目列表 - 滚动视差展示 */}
      {projectsWithNext.map((project, index) => (
        <ProjectItem
          key={project.id}
          project={project}
          index={index}
          totalProjects={projects.length}
        />
      ))}

    </section>
  );
};

export default ScrollParallaxShowcase;
