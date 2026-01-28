import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';
import ScrollParallaxShowcase from '../components/ScrollParallaxShowcase';
import ServiceSection from '../components/ServiceSection';
import BlindsTransition from '../components/BlindsTransition';
import { useScrollLock } from '../contexts/ScrollLockContext';
import { useIsMobile } from '../hooks/useMediaQuery';

// 首页专用导航圆点组件
const HomeDotNavigation = ({ sections, isMobile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const { lockScroll } = useScrollLock();

  useEffect(() => {
    const handleScroll = () => {
      // 如果正在程序化滚动，跳过检测
      if (isScrollingRef.current) return;
      
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // 找到当前所在的 section
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始检测
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id, index) => {
    const element = document.getElementById(id);
    if (element) {
      // 标记正在滚动，防止 handleScroll 干扰
      isScrollingRef.current = true;
      setCurrentIndex(index);
      
      // 触发全局滚动锁定，禁用其他组件的 onViewportEnter
      // 同时传递目标 section ID，让相关组件可以做特殊处理
      lockScroll(1200, id);
      
      // 计算目标位置，稍微向上偏移确保 section 第一项在视口中心
      // 对于 services section，需要额外偏移以确保第一个服务项在视口中心
      let targetPosition = element.offsetTop;
      if (id === 'services') {
        // 偏移量：确保第一个服务项的中心在视口中心
        // ServiceSection 有 50px padding-top，第一项有 100px padding
        targetPosition = element.offsetTop + 50;
      }
      
      // 使用 scrollTo 进行精确滚动
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // 滚动完成后恢复检测
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1200);
    }
  };

  // 根据当前 section 的背景色决定导航点颜色
  const isDark = sections[currentIndex]?.dark;
  const dotColor = isDark ? 'var(--color-dark-text)' : 'var(--color-text-main)';
  const dotInactiveColor = isDark ? 'var(--color-dark-text-muted)' : 'var(--color-text-light)';

  // 移动端隐藏导航圆点
  if (isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      right: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      zIndex: 100
    }}>
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          onClick={() => scrollToSection(section.id, index)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: currentIndex === index ? '12px' : '10px',
            height: currentIndex === index ? '12px' : '10px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: currentIndex === index ? dotColor : dotInactiveColor,
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          title={section.name}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  useTitle(t('home.pageTitle'));

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
      title: t('home.cases.01-brand-identity.title'), 
      subtitle: t('home.cases.01-brand-identity.subtitle'),
      subtitle2: t('home.cases.01-brand-identity.subtitle2'),
      cover: '#333333' 
    },
    { 
      id: '02-cmf-packaging', 
      title: t('home.cases.02-cmf-packaging.title'), 
      subtitle: t('home.cases.02-cmf-packaging.subtitle'),
      subtitle2: t('home.cases.02-cmf-packaging.subtitle2'),
      cover: '#444444' 
    },
    { 
      id: '03-key-visual', 
      title: t('home.cases.03-key-visual.title'), 
      subtitle: t('home.cases.03-key-visual.subtitle'),
      subtitle2: t('home.cases.03-key-visual.subtitle2'),
      cover: '#555555' 
    },
    { 
      id: '04-regional-marketing', 
      title: t('home.cases.04-regional-marketing.title'), 
      subtitle: t('home.cases.04-regional-marketing.subtitle'),
      subtitle2: t('home.cases.04-regional-marketing.subtitle2'),
      cover: '#666666' 
    },
    { 
      id: '05-offline-space', 
      title: t('home.cases.05-offline-space.title'), 
      subtitle: t('home.cases.05-offline-space.subtitle'),
      subtitle2: t('home.cases.05-offline-space.subtitle2'),
      cover: '#777777' 
    },
    { 
      id: '06-art-gallery', 
      title: t('home.cases.06-art-gallery.title'), 
      subtitle: t('home.cases.06-art-gallery.subtitle'),
      subtitle2: t('home.cases.06-art-gallery.subtitle2'),
      cover: '#888888' 
    },
  ];

  const skills = [
    { title: t('home.skills.productDesign.title'), desc: t('home.skills.productDesign.desc') },
    { title: t('home.skills.development.title'), desc: t('home.skills.development.desc') },
    { title: t('home.skills.strategy.title'), desc: t('home.skills.strategy.desc') },
  ];

  // 专业服务数据
  const services = [
    { 
      id: 'brand-foundation',
      title: t('home.services.brandFoundation.title'), 
      subtitle: t('home.services.brandFoundation.subtitle'),
      problem: t('home.services.brandFoundation.problem'),
      desc: t('home.services.brandFoundation.desc'),
      tags: t('home.services.brandFoundation.chips', { returnObjects: true }),
    },
    { 
      id: 'product-physical',
      title: t('home.services.productPhysical.title'), 
      subtitle: t('home.services.productPhysical.subtitle'),
      problem: t('home.services.productPhysical.problem'),
      desc: t('home.services.productPhysical.desc'),
      tags: t('home.services.productPhysical.chips', { returnObjects: true }),
    },
    { 
      id: 'visual-communication',
      title: t('home.services.visualCommunication.title'), 
      subtitle: t('home.services.visualCommunication.subtitle'),
      problem: t('home.services.visualCommunication.problem'),
      desc: t('home.services.visualCommunication.desc'),
      tags: t('home.services.visualCommunication.chips', { returnObjects: true }),
    },
    { 
      id: 'campaign-marketing',
      title: t('home.services.campaignMarketing.title'), 
      subtitle: t('home.services.campaignMarketing.subtitle'),
      problem: t('home.services.campaignMarketing.problem'),
      desc: t('home.services.campaignMarketing.desc'),
      tags: t('home.services.campaignMarketing.chips', { returnObjects: true }),
    },
    { 
      id: 'offline-applications',
      title: t('home.services.offlineApplications.title'), 
      subtitle: t('home.services.offlineApplications.subtitle'),
      problem: t('home.services.offlineApplications.problem'),
      desc: t('home.services.offlineApplications.desc'),
      tags: t('home.services.offlineApplications.chips', { returnObjects: true }),
    },
    { 
      id: 'creative-exploration',
      title: t('home.services.creativeExploration.title'), 
      subtitle: t('home.services.creativeExploration.subtitle'),
      problem: t('home.services.creativeExploration.problem'),
      desc: t('home.services.creativeExploration.desc'),
      tags: t('home.services.creativeExploration.chips', { returnObjects: true }),
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

  // 首页 Section 配置
  const homeSections = [
    { id: 'hero', name: t('home.sectionHero'), dark: false },
    { id: 'featured-projects', name: t('home.sectionWorks'), dark: false },
    { id: 'services', name: t('home.sectionServices'), dark: true },
    { id: 'contact-cta', name: t('home.sectionContact'), dark: true },
  ];

  return (
    <div>
      {/* 导航圆点 - 移动端隐藏 */}
      <HomeDotNavigation sections={homeSections} isMobile={isMobile} />

      {/* 1. Hero Section - 全屏沉浸式 */}
      <motion.section 
        id="hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ 
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(60px, 8vh, 100px) clamp(40px, 8vw, 120px) clamp(100px, 12vh, 140px)',
          background: 'var(--color-bg-subtle)',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden', // 防止背景装饰溢出
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
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1400px', width: '100%', position: 'relative', zIndex: 1 }}>
          <motion.h1 
            variants={fadeInUp} 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(3.5rem, 12vw, 9rem)', 
              fontWeight: '400', 
              lineHeight: 'var(--line-height-tight)', 
              marginBottom: '30px', 
              letterSpacing: '-0.03em',
              color: 'var(--color-text-main)'
            }}
          >
            {t('home.heroName')}
          </motion.h1>
          <motion.h2 
            variants={fadeInUp} 
            style={{ 
              fontSize: 'clamp(1.3rem, 3vw, 2.5rem)', 
              fontWeight: '400', 
              color: 'var(--color-text-muted)', 
              marginBottom: '40px', 
              fontFamily: 'var(--font-sans)' 
            }}
          >
            {t('home.heroRole')}
          </motion.h2>
          <motion.p 
            variants={fadeInUp} 
            style={{ 
              fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', 
              color: 'var(--color-text-secondary)', 
              maxWidth: '800px', 
              lineHeight: 'var(--line-height-base)', 
              marginBottom: '60px' 
            }}
          >
            {t('home.heroDesc')}<br/>
            {t('home.heroDesc2')}
          </motion.p>
          
          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '15px', marginBottom: '60px', flexWrap: 'wrap' }}>
            {t('home.heroTags', { returnObjects: true }).map(tag => (
              <span 
                key={tag} 
                style={{ 
                  padding: '10px 24px', 
                  background: 'var(--color-surface)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: 'clamp(0.85rem, 1vw, 1rem)', 
                  fontWeight: '500', 
                  color: 'var(--color-text-muted)' 
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
                background: 'var(--color-text-main)', 
                color: 'var(--color-bg)', 
                border: 'none', 
                borderRadius: 'var(--radius-full)', 
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                fontWeight: '500',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {t('home.viewFeaturedCases')}
            </button>
            <Link to="/contact">
              <button 
                style={{ 
                  padding: '18px 48px', 
                  background: 'transparent', 
                  color: 'var(--color-text-main)', 
                  border: '1px solid rgba(0,0,0,0.2)', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease' 
                }}
              >
                {t('home.contactMe')}
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
            color: 'var(--color-text-light)',
            fontSize: '0.75rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          <span>{t('common.scroll')}</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '1px',
              height: '50px',
              background: 'linear-gradient(to bottom, var(--color-text-light), transparent)',
            }}
          />
        </motion.div>

      </motion.section>

      {/* Hero 到作品展示的百叶窗过渡 - Junni 风格 */}
      <BlindsTransition 
        fromColor="#f5f5f5"
        toColor="#0a0a0a"
        blindsCount={13}
        height="80vh"
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
          sectionTitle={t('home.featuredTitle')}
        />
      </div>

      {/* Work 到 Service 的百叶窗过渡 */}
      <BlindsTransition 
        fromColor="#fff"
        toColor="#111"
        blindsCount={13}
        height="80vh"
      >
        {/* 底层内容预览 - 深色背景上的浅色文字 */}
        <div style={{
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontWeight: '800',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.2)', // 修正：在黑底上使用白色描边
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}>
          SERVICES
        </div>
      </BlindsTransition>

      {/* 3. Services Section - 专业能力 */}
      <div id="services">
        <ServiceSection 
          services={services}
          title="SERVICE"
        />
      </div>

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
          {t('home.partnersTitle')}
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
      <section 
        id="contact-cta"
        style={{ 
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
          overflow: 'hidden', // 防止背景装饰溢出
        }}
      >
        {/* 背景装饰圆 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(350px, 55vw, 900px)',
          height: 'clamp(350px, 55vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
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
          {t('home.ctaTitle')}
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
          {t('home.ctaDesc')}
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
              {t('home.emailMe')}
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
            {t('home.wechatContact')}
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