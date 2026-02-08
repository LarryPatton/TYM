import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link } from 'react-router-dom';
import ScrollParallaxShowcase from '../components/ScrollParallaxShowcase';
import ServiceSection from '../components/ServiceSection';
import BlindsTransition from '../components/BlindsTransition';
import PartnersSection from '../components/PartnersSection';
import MobileHome from '../components/MobileHome';
import WechatModal from '../components/WechatModal';
import ScrollIndicator from '../components/ScrollIndicator';
import FrostedDotsBackground from '../components/FrostedDotsBackground';
import LoadingScreen from '../components/LoadingScreen';
import HeroTrailEffect from '../components/HeroTrailEffect';
import TypewriterHero from '../components/TypewriterHero';
import { useScrollLock } from '../contexts/ScrollLockContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useTheme } from '../hooks/useTheme';
import { useImagePreloader } from '../hooks/useImagePreloader';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  useTitle(t('home.pageTitle'));

  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  
  // 微信弹窗状态
  const [wechatModalOpen, setWechatModalOpen] = useState(false);

  // ===== 百叶窗过渡统一配置 =====
  const BLINDS_CONFIG = {
    // 尺寸
    height: "70vh",
    blindsCount: 13,
    // 统一颜色 token
    colors: {
      from: '#f5f5f5',      // 起始色（浅色）
      to: '#0a0a0a',        // 结束色（深色）
      textColor: 'rgba(255, 255, 255, 0.88)',  // 实心填充文字颜色
    },
    // 统一字体样式
    textStyle: {
      fontSize: 'clamp(4rem, 15vw, 12rem)',
      fontWeight: '400',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-sans)',
    },
  };

  // 主题相关颜色配置（仅用于 CTA 等区域）
  const themeColors = {
    // CTA 区域
    ctaBg: isDark ? '#111' : '#f5f5f5',
    ctaText: isDark ? '#fff' : '#111',
    ctaTextMuted: isDark ? '#777' : '#666',
    ctaButtonBg: isDark ? '#fff' : '#111',
    ctaButtonText: isDark ? '#000' : '#fff',
    ctaButtonBorder: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)',
    ctaGradientLine: isDark ? '#333' : '#ddd',
    ctaDecoCircle: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    // Footer
    footerGradient: isDark 
      ? 'linear-gradient(to bottom, #111, #0a0a0a)'
      : 'linear-gradient(to bottom, #f5f5f5, #eee)',
  };

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
    padding: isMobile ? '0 var(--space-page-x)' : '0 clamp(40px, 8vw, 120px)',
  };

  // 精选作品案例
  const featuredCases = [
    { 
      id: '01-brand-identity', 
      title: t('home.cases.01-brand-identity.title'), 
      subtitle: t('home.cases.01-brand-identity.subtitle'),
      subtitle2: t('home.cases.01-brand-identity.subtitle2'),
      coverImage: '/images/works/work-01.png' 
    },
    { 
      id: '02-cmf-packaging', 
      title: t('home.cases.02-cmf-packaging.title'), 
      subtitle: t('home.cases.02-cmf-packaging.subtitle'),
      subtitle2: t('home.cases.02-cmf-packaging.subtitle2'),
      coverImage: '/images/works/work-02.png' 
    },
    { 
      id: '03-key-visual', 
      title: t('home.cases.03-key-visual.title'), 
      subtitle: t('home.cases.03-key-visual.subtitle'),
      subtitle2: t('home.cases.03-key-visual.subtitle2'),
      coverImage: '/images/works/work-03.png' 
    },
    { 
      id: '04-regional-marketing', 
      title: t('home.cases.04-regional-marketing.title'), 
      subtitle: t('home.cases.04-regional-marketing.subtitle'),
      subtitle2: t('home.cases.04-regional-marketing.subtitle2'),
      coverImage: '/images/works/work-04.png' 
    },
    { 
      id: '05-offline-space', 
      title: t('home.cases.05-offline-space.title'), 
      subtitle: t('home.cases.05-offline-space.subtitle'),
      subtitle2: t('home.cases.05-offline-space.subtitle2'),
      coverImage: '/images/works/work-05.png' 
    },
    { 
      id: '06-art-gallery', 
      title: t('home.cases.06-art-gallery.title'), 
      subtitle: t('home.cases.06-art-gallery.subtitle'),
      subtitle2: t('home.cases.06-art-gallery.subtitle2'),
      coverImage: '/images/works/work-06.png' 
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
      images: {
        main: '/images/services/service-01-main.png',
        sub1: '/images/services/service-01-sub1.png',
        sub2: '/images/services/service-01-sub2.png',
      },
    },
    { 
      id: 'product-physical',
      title: t('home.services.productPhysical.title'), 
      subtitle: t('home.services.productPhysical.subtitle'),
      problem: t('home.services.productPhysical.problem'),
      desc: t('home.services.productPhysical.desc'),
      tags: t('home.services.productPhysical.chips', { returnObjects: true }),
      images: {
        main: '/images/services/service-02-main.png',
        sub1: '/images/services/service-02-sub1.png',
        sub2: '/images/services/service-02-sub2.png',
      },
    },
    { 
      id: 'visual-communication',
      title: t('home.services.visualCommunication.title'), 
      subtitle: t('home.services.visualCommunication.subtitle'),
      problem: t('home.services.visualCommunication.problem'),
      desc: t('home.services.visualCommunication.desc'),
      tags: t('home.services.visualCommunication.chips', { returnObjects: true }),
      images: {
        main: '/images/services/service-03-main.png',
        sub1: '/images/services/service-03-sub1.png',
        sub2: '/images/services/service-03-sub2.png',
      },
    },
    { 
      id: 'campaign-marketing',
      title: t('home.services.campaignMarketing.title'), 
      subtitle: t('home.services.campaignMarketing.subtitle'),
      problem: t('home.services.campaignMarketing.problem'),
      desc: t('home.services.campaignMarketing.desc'),
      tags: t('home.services.campaignMarketing.chips', { returnObjects: true }),
      images: {
        main: '/images/services/service-04-main.png',
        sub1: '/images/services/service-04-sub1.png',
        sub2: '/images/services/service-04-sub2.png',
      },
    },
    { 
      id: 'offline-applications',
      title: t('home.services.offlineApplications.title'), 
      subtitle: t('home.services.offlineApplications.subtitle'),
      problem: t('home.services.offlineApplications.problem'),
      desc: t('home.services.offlineApplications.desc'),
      tags: t('home.services.offlineApplications.chips', { returnObjects: true }),
      images: {
        main: '/images/services/service-05-main.png',
        sub1: '/images/services/service-05-sub1.png',
        sub2: '/images/services/service-05-sub2.png',
      },
    },
    { 
      id: 'creative-exploration',
      title: t('home.services.creativeExploration.title'), 
      subtitle: t('home.services.creativeExploration.subtitle'),
      problem: t('home.services.creativeExploration.problem'),
      desc: t('home.services.creativeExploration.desc'),
      tags: t('home.services.creativeExploration.chips', { returnObjects: true }),
      images: {
        main: '/images/services/service-06-main.png',
        sub1: '/images/services/service-06-sub1.png',
        sub2: '/images/services/service-06-sub2.png',
      },
    },
  ];

  // 合作品牌数据
  const partnersData = [
    { id: 'partner-01', image: '/images/partners/partner-01.png' },
    { id: 'partner-02', image: '/images/partners/partner-02.png' },
    { id: 'partner-03', image: '/images/partners/partner-03.png' },
    { id: 'partner-04', image: '/images/partners/partner-04.png' },
    { id: 'partner-05', image: '/images/partners/partner-05.png' },
    { id: 'partner-06', image: '/images/partners/partner-06.png' },
  ];

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

  // ========== 图片预加载 ==========
  
  // 收集首页需要预加载的图片 URL（首屏关键资源）
  const imageUrls = useMemo(() => {
    const urls = [];
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizeUrl = (path) => {
      if (!path || typeof path !== 'string') return null;
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      return baseUrl + cleanPath;
    };
    
    // 1. 精选作品封面图（首屏关键资源）
    featuredCases.forEach(item => {
      if (item.coverImage) {
        urls.push(normalizeUrl(item.coverImage));
      }
    });
    
    // 2. 合作伙伴 logo（首屏可见）
    partnersData.forEach(partner => {
      if (partner.image) {
        urls.push(normalizeUrl(partner.image));
      }
    });
    
    // 3. Hero 区域鼠标拖尾效果图片（trail 素材）
    for (let i = 1; i <= 9; i++) {
      urls.push(normalizeUrl(`/images/trail/Slide 16_9 - ${i}.png`));
    }
    
    // 去重并过滤空值
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '');
    
    console.log('[Home] Collected image URLs:', uniqueUrls.length, uniqueUrls);
    
    return uniqueUrls;
  }, []);
  
  // 添加标志位，确保只加载一次
  const [hasPreloaded, setHasPreloaded] = useState(false);
  // 添加 canEnter 状态，由动画完成回调控制
  const [canEnter, setCanEnter] = useState(false);
  
  // 使用图片预加载 Hook（85% 阈值策略，首页需要完整体验）
  const { isLoading, progress, loadedCount, totalCount, fromCache } = useImagePreloader(imageUrls, {
    enabled: !hasPreloaded,
    threshold: 85, // 首页加载 85% 后才可进入（确保首屏完整）
    pageId: 'home', // 页面级缓存标识
    onThresholdReached: (info) => {
      console.log('[Home] ✅ 85% threshold reached!', info);
    },
    onComplete: (stats) => {
      console.log('[Home] ✅ 100% loading complete!', stats);
      setHasPreloaded(true);
    },
    onProgress: (info) => {
      console.log('[Home] Progress update:', info);
    }
  });
  
  // 动画完成回调：只有动画播放完毕且真实加载 >= 85% 时才允许进入
  const handleAnimationComplete = useCallback(() => {
    if (progress >= 85) {
      console.log('[Home] ✅ Animation complete! User can enter page.');
      setCanEnter(true);
    }
  }, [progress]);
  
  // 🚀 缓存命中时直接跳过加载页（不等待动画）
  useEffect(() => {
    if (fromCache && !canEnter) {
      console.log('[Home] 🚀 Cache hit! Skipping loading screen.');
      setCanEnter(true);
    }
  }, [fromCache, canEnter]);

  // ==================== 移动端：使用全新的分屏布局 ====================
  if (isMobile) {
    return (
      <>
        {/* 加载屏幕 */}
        <LoadingScreen 
          isVisible={!canEnter}
          realProgress={progress}
          loadedCount={loadedCount}
          totalCount={totalCount}
          phaseNumber="" // 首页不显示 Phase 编号
          threshold={85}
          minDuration={2000} // 首页最小动画时长 2 秒（品牌展示）
          onAnimationComplete={handleAnimationComplete}
        />
        
        <AnimatePresence mode="wait">
          {canEnter && (
            <motion.div
              key="mobile-home-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MobileHome 
                featuredCases={featuredCases}
                services={services}
                partners={partnersData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ==================== 桌面端：保持原有布局 ====================
  return (
    <>
      {/* 加载屏幕 */}
      <LoadingScreen 
        isVisible={!canEnter}
        realProgress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        phaseNumber="" // 首页不显示 Phase 编号
        threshold={85}
        minDuration={2000} // 首页最小动画时长 2 秒（品牌展示）
        onAnimationComplete={handleAnimationComplete}
      />
      
      <AnimatePresence mode="wait">
        {canEnter && (
          <motion.div
            key="desktop-home-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {/* 导航圆点 - 移动端隐藏 */}
              <HomeDotNavigation sections={homeSections} isMobile={isMobile} />

              {/* 桌面端 Hero 区域鼠标拖尾特效 */}
              {!isMobile && <HeroTrailEffect isMobile={isMobile} />}

      {/* 1. Hero Section - 全屏沉浸式 */}
      <motion.section 
        id="hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ 
          minHeight: isMobile ? 'calc(100vh - var(--nav-height))' : 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile 
            ? 'var(--space-2xl) var(--space-page-x) var(--space-3xl)'
            : 'clamp(60px, 8vh, 100px) clamp(40px, 8vw, 120px) clamp(100px, 12vh, 140px)',
          background: 'transparent', // 让光斑背景显示
          position: 'relative',
          boxSizing: 'border-box',
          // 移除 overflow: hidden，允许背景向上延伸
        }}
      >
        {/* Hero 区域光斑背景 - 使用 fixed 定位覆盖导航栏 */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            zIndex: -1, // 在内容之下
            pointerEvents: 'none',
          }}
        >
          <FrostedDotsBackground speed={2} />
        </motion.div>

        {/* 居中排版的文字区域 - 打字机效果 */}
        <TypewriterHero 
          name={t('home.heroName')}
          role={t('home.heroRole')}
          desc1={t('home.heroDesc')}
          desc2={t('home.heroDesc2')}
        />

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

      {/* Hero 到作品展示的百叶窗过渡 - 移动端隐藏 */}
      {!isMobile && (
        <BlindsTransition 
          fromColor={BLINDS_CONFIG.colors.from}
          toColor={BLINDS_CONFIG.colors.to}
          blindsCount={BLINDS_CONFIG.blindsCount}
          height={BLINDS_CONFIG.height}
        >
          <div style={{
            ...BLINDS_CONFIG.textStyle,
            color: BLINDS_CONFIG.colors.textColor,
          }}>
            {t('home.blinds.works')}
          </div>
        </BlindsTransition>
      )}

      {/* 2. Featured Cases - 滚动视差展示 */}
      <div 
        id="featured-projects"
        style={isMobile ? {
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
        } : {}}
      >
        <ScrollParallaxShowcase 
          projects={featuredCases} 
          sectionTitle={t('home.featuredTitle')}
        />
      </div>

      {/* Work 到 Service 的百叶窗过渡 - 移动端隐藏 */}
      {!isMobile && (
        <BlindsTransition 
          fromColor={BLINDS_CONFIG.colors.from}
          toColor={BLINDS_CONFIG.colors.to}
          blindsCount={BLINDS_CONFIG.blindsCount}
          height={BLINDS_CONFIG.height}
        >
          <div style={{
            ...BLINDS_CONFIG.textStyle,
            color: BLINDS_CONFIG.colors.textColor,
          }}>
            {t('home.blinds.services')}
          </div>
        </BlindsTransition>
      )}

      {/* 3. Services Section - 专业能力 */}
      <div id="services">
        <ServiceSection 
          services={services}
          title="SERVICE"
        />
      </div>

      {/* Service 到 Partners 的百叶窗过渡 - 移动端隐藏 */}
      {!isMobile && (
        <BlindsTransition 
          fromColor={BLINDS_CONFIG.colors.from}
          toColor={BLINDS_CONFIG.colors.to}
          blindsCount={BLINDS_CONFIG.blindsCount}
          height={BLINDS_CONFIG.height}
        >
          <div style={{
            ...BLINDS_CONFIG.textStyle,
            color: BLINDS_CONFIG.colors.textColor,
          }}>
            {t('home.blinds.partners')}
          </div>
        </BlindsTransition>
      )}

      {/* 4. Trust Area - 合作品牌 - 全屏飞入+收束效果 */}
      <PartnersSection partners={partnersData} />

      {/* 5. Contact CTA - Sticky 全屏沉浸式 */}
      <section 
        id="contact-cta"
        style={{ 
          position: 'relative',
          height: '200vh', // Sticky 滚动高度
        }}
      >
        {/* 背景层 - sticky 固定 */}
        <div
          style={{
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)',
            pointerEvents: 'none',
          }}
        >
          <FrostedDotsBackground speed={2} />
        </div>
        
        {/* 内容层 - 也是 sticky，叠加在背景上 */}
        <div
          style={{
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)',
            marginTop: 'calc(-100vh + 80px)', // 抵消背景层高度，让内容叠加在背景上
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile 
              ? 'var(--space-3xl) var(--space-page-x)'
              : 'clamp(60px, 10vh, 100px) clamp(40px, 8vw, 120px)', 
            textAlign: 'center', 
            color: themeColors.ctaText,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* 顶部装饰线 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1px',
            height: '80px',
            background: `linear-gradient(to bottom, ${themeColors.ctaGradientLine}, transparent)`,
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
              color: themeColors.ctaTextMuted, 
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
                whileHover={{ scale: 1.05, boxShadow: isDark ? '0 10px 40px -10px rgba(255,255,255,0.3)' : '0 10px 40px -10px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  padding: '20px 60px', 
                  background: themeColors.ctaButtonBg, 
                  color: themeColors.ctaButtonText, 
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
              onClick={() => setWechatModalOpen(true)}
              whileHover={{ scale: 1.05, borderColor: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                padding: '20px 60px', 
                background: 'transparent', 
                color: themeColors.ctaText, 
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'var(--color-text-main)'}`, 
                borderRadius: '100px', 
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {t('home.wechatContact')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 微信二维码弹窗 */}
      <WechatModal 
        isOpen={wechatModalOpen} 
        onClose={() => setWechatModalOpen(false)} 
      />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Force update check
export default Home;