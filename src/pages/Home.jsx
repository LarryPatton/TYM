import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';
import ScrollParallaxShowcase from '../components/ScrollParallaxShowcase';
import ServiceSection from '../components/ServiceSection';
import BlindsTransition from '../components/BlindsTransition';

const Home = () => {
  useTitle('首页');

  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // 全屏容器样式
  const fullscreenSection = {
    width: '100%',
    padding: '0 clamp(40px, 8vw, 120px)',
  };

  // Mock Data - 精选作品案例
  const featuredCases = [
    { 
      id: '01-brand-identity', 
      title: '品牌视觉识别', 
      subtitle: 'Chapter 01 · 品牌基因的提炼',
      desc: '从品牌战略到视觉表达的完整识别系统。', 
      cover: '#2a2a3e' 
    },
    { 
      id: '02-ui-guidelines', 
      title: 'UI 视觉规范', 
      subtitle: 'Chapter 02 · 视觉系统的建立',
      desc: '建立跨平台的数字视觉语言与组件库。', 
      cover: '#1e3a5f' 
    },
    { 
      id: '03-cmf', 
      title: '产品 CMF 定义', 
      subtitle: 'Chapter 03 · 物理质感的转译',
      desc: '将数字美学转化为实体产品的材质与工艺。', 
      cover: '#3d2e1e' 
    },
    { 
      id: '04-motion-design', 
      title: '动效设计系统', 
      subtitle: 'Chapter 04 · 动态交互的编排',
      desc: '为界面注入生命力的动效设计规范。', 
      cover: '#2e3d2e' 
    },
    { 
      id: '05-data-viz', 
      title: '数据可视化', 
      subtitle: 'Chapter 05 · 复杂信息的简化',
      desc: '将复杂数据转化为直观可理解的视觉叙事。', 
      cover: '#3e2e3d' 
    },
    { 
      id: '06-marketing-plan', 
      title: '品牌营销视觉', 
      subtitle: 'Chapter 06 · 跨渠道的视觉延展',
      desc: '跨渠道的视觉系统延展与传播策略。', 
      cover: '#1e2e3e' 
    },
  ];

  const skills = [
    { title: '产品设计', desc: 'UI/UX, 原型设计, 设计系统' },
    { title: '开发', desc: 'React, 前端架构, 交大顺' },
    { title: '策略', desc: '用户研究, 产品策略, 数据分析' },
  ];

  // 专业服务数据
  const services = [
    { 
      id: 'design-system',
      title: 'Design System', 
      desc: '构建跨平台的设计语言与组件库，确保品牌一致性与开发效率的完美平衡。' 
    },
    { 
      id: 'product-design',
      title: 'Product Design', 
      desc: '从用户研究到交互设计、视觉设计的全链路产品设计服务，打造卓越用户体验。' 
    },
    { 
      id: 'development',
      title: 'Development', 
      desc: '基于 React/Vue 的现代前端开发，动效实现，响应式设计与性能优化。' 
    },
    { 
      id: 'strategy',
      title: 'Strategy', 
      desc: '用户研究、竞品分析、产品策略规划，数据驱动的设计决策支持。' 
    },
  ];

  // 合作品牌数据
  const partners = ['Google', 'Spotify', 'Airbnb', 'Stripe', 'Nike'];

  const scrollToFeatured = () => {
    const element = document.getElementById('featured-projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* 1. Hero Section - 全屏沉浸式 */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ 
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(60px, 8vh, 100px) clamp(40px, 8vw, 120px) clamp(100px, 12vh, 140px)',
          background: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* 背景装饰元素 */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          width: 'clamp(250px, 35vw, 600px)',
          height: 'clamp(250px, 35vw, 600px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 224, 42, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1400px', width: '100%', position: 'relative', zIndex: 1 }}>
          <motion.h1 
            variants={fadeInUp} 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(3.5rem, 12vw, 9rem)', 
              fontWeight: '400', 
              lineHeight: '1', 
              marginBottom: '30px', 
              letterSpacing: '-0.03em' 
            }}
          >
            你的名字
          </motion.h1>
          <motion.h2 
            variants={fadeInUp} 
            style={{ 
              fontSize: 'clamp(1.3rem, 3vw, 2.5rem)', 
              fontWeight: '400', 
              color: '#666', 
              marginBottom: '40px', 
              fontFamily: 'var(--font-sans)' 
            }}
          >
            产品设计师 & 开发者
          </motion.h2>
          <motion.p 
            variants={fadeInUp} 
            style={{ 
              fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', 
              color: '#444', 
              maxWidth: '800px', 
              lineHeight: '1.6', 
              marginBottom: '60px' 
            }}
          >
            打造融合美学与功能的数字体验。<br/>
            通过设计与代码，帮助品牌讲述他们的故事。
          </motion.p>
          
          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '15px', marginBottom: '60px', flexWrap: 'wrap' }}>
            {['UI/UX', 'React', 'Motion', 'Strategy'].map(tag => (
              <span 
                key={tag} 
                style={{ 
                  padding: '10px 24px', 
                  background: 'rgba(255,255,255,0.8)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.08)', 
                  borderRadius: '100px', 
                  fontSize: 'clamp(0.85rem, 1vw, 1rem)', 
                  fontWeight: '500', 
                  color: '#555' 
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={scrollToFeatured}
              style={{ 
                padding: '18px 48px', 
                background: '#111', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '100px', 
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                fontWeight: '500',
              }}
            >
              查看精选案例
            </button>
            <Link to="/contact">
              <button 
                style={{ 
                  padding: '18px 48px', 
                  background: 'transparent', 
                  color: '#111', 
                  border: '1px solid rgba(0,0,0,0.2)', 
                  borderRadius: '100px', 
                  fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease' 
                }}
              >
                联系我
              </button>
            </Link>
          </motion.div>
        </div>

        {/* 滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            opacity: scrollIndicatorOpacity,
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            color: '#999',
            fontSize: '0.75rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '1px',
              height: '50px',
              background: 'linear-gradient(to bottom, #999, transparent)',
            }}
          />
        </motion.div>

      </motion.section>

      {/* Hero 到作品展示的百叶窗过渡 - Junni 风格 */}
      <BlindsTransition 
        fromColor="#f5f5f5"
        toColor="#0a0a0a"
        blindsCount={6}
        height="70vh"
      >
        {/* 底层内容预览 */}
        <div style={{
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontWeight: '800',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.15)',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}>
          WORKS
        </div>
      </BlindsTransition>

      {/* 2. Featured Cases - 滚动视差展示 */}
      <div id="featured-projects">
        <ScrollParallaxShowcase 
          projects={featuredCases} 
          sectionTitle="作品集导读 · 精选作品"
        />
      </div>

      {/* Work 到 Service 的百叶窗过渡 */}
      <BlindsTransition 
        fromColor="#0a0a0a"
        toColor="#f5f5f5"
        blindsCount={6}
        height="140vh"
      >
        {/* 底层内容预览 - 浅色背景上的深色文字 */}
        <div style={{
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontWeight: '800',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(0,0,0,0.15)',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}>
          SERVICES
        </div>
      </BlindsTransition>

      {/* 3. Services Section - 专业能力 */}
      <ServiceSection 
        services={services}
        title="SERVICE"
        sectionLabel="专业能力"
      />

      {/* 4. Trust Area - 合作品牌（与 ServiceSection 深色区域无缝连接） */}
      <section style={{ 
        padding: 'clamp(80px, 12vh, 140px) clamp(40px, 8vw, 120px)', 
        textAlign: 'center',
        background: '#111',
        position: 'relative',
      }}>
        {/* 顶部装饰线 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '60px',
          background: 'linear-gradient(to bottom, #333, transparent)',
        }} />

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ 
            color: '#555', 
            marginBottom: '60px', 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '4px' 
          }}
        >
          合作品牌
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'clamp(40px, 8vw, 100px)', 
            flexWrap: 'wrap',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {partners.map((brand, index) => (
            <motion.span 
              key={brand} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{ 
                fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', 
                fontWeight: '700', 
                color: '#fff',
                letterSpacing: '0.05em',
                cursor: 'default',
                transition: 'opacity 0.3s ease',
              }}
            >
              {brand}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* 5. Contact CTA - 全屏沉浸式 */}
      <section style={{ 
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(100px, 15vh, 160px) clamp(40px, 8vw, 120px)', 
        textAlign: 'center', 
        background: '#111', 
        color: '#fff',
        position: 'relative',
      }}>
        {/* 背景装饰圆 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(350px, 55vw, 900px)',
          height: 'clamp(350px, 55vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 224, 42, 0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* 顶部装饰线 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to bottom, #333, transparent)',
        }} />

        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', 
            fontWeight: '400', 
            marginBottom: '30px',
            position: 'relative',
            zIndex: 1,
            lineHeight: 1.1,
          }}
        >
          想一起做点什么？
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
            color: '#777', 
            marginBottom: '60px',
            maxWidth: '600px',
            lineHeight: 1.6,
            position: 'relative',
            zIndex: 1,
          }}
        >
          让我们共同创造令人惊叹的作品。
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <a href="mailto:hello@example.com">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px -10px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                padding: '20px 60px', 
                background: '#fff', 
                color: '#000', 
                border: 'none', 
                borderRadius: '100px', 
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', 
                cursor: 'pointer', 
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              发邮件给我
            </motion.button>
          </a>
          <motion.button 
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.5)' }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              padding: '20px 60px', 
              background: 'transparent', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.25)', 
              borderRadius: '100px', 
              fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            微信联系
          </motion.button>
        </motion.div>
      </section>

      {/* Footer 过渡区域 */}
      <div style={{
        height: '80px',
        background: 'linear-gradient(to bottom, #111, #0a0a0a)',
      }} />
    </div>
  );
};

export default Home;