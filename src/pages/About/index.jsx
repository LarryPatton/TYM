import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useScroll } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../hooks/useTitle';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useTheme } from '../../hooks/useTheme';

// 子组件
import DesktopAbout from './DesktopAbout';
import MobileAbout from './MobileAbout';

// 常量和配置
import { getColors, getAboutData, FORMSPREE_ENDPOINT, NAV_HEIGHT } from './constants';

/**
 * About 页面 - 主入口组件
 * 负责状态管理、数据获取和路由逻辑
 * 根据设备类型渲染 DesktopAbout 或 MobileAbout
 */
const About = () => {
  const { t } = useTranslation();
  useTitle(t('about.pageTitle'));
  const location = useLocation();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // 状态管理
  const [formStatus, setFormStatus] = useState('idle');
  const [wechatModalOpen, setWechatModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const [isRefReady, setIsRefReady] = useState(false);

  // 获取颜色配置
  const colors = getColors(isDark);
  
  // 获取数据
  const { sections, mobileScreens, capabilities, workExperience, education, journey, typeLabels, getTypeColors, skillsOverview } = getAboutData(t);
  
  // 根据主题获取类型颜色
  const typeColors = getTypeColors(isDark);

  // 总滚动高度
  const totalScrollHeight = sections.length * 100; // vh

  // 确保 ref 在 useScroll 使用前已赋值
  useLayoutEffect(() => {
    if (containerRef.current && !isMobile) {
      setIsRefReady(true);
    }
  }, [isMobile]);

  // 使用 useScroll 监听滚动进度（仅在桌面端且 ref 准备好时使用）
  const { scrollYProgress } = useScroll(
    isRefReady && !isMobile
      ? {
          target: containerRef,
          offset: ["start start", "end end"]
        }
      : undefined
  );

  // 根据滚动进度计算当前 section
  useEffect(() => {
    if (!scrollYProgress || isMobile) return;
    
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const newIndex = Math.min(
        Math.floor(progress * sections.length),
        sections.length - 1
      );
      if (newIndex !== activeSection && newIndex >= 0) {
        setActiveSection(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, sections.length, activeSection, isMobile]);

  // 处理从其他页面跳转
  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetIndex = sections.findIndex(s => s.id === location.state.scrollTo);
      if (targetIndex >= 0 && containerRef.current) {
        setTimeout(() => {
          const scrollTarget = (targetIndex / sections.length) * containerRef.current.scrollHeight;
          window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location, sections]);

  // 滚动吸附效果（仅桌面端）
  useEffect(() => {
    if (isMobile) return;
    
    let scrollTimeout;
    let isSnapping = false;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastScrollTime = Date.now();
    
    const handleScroll = () => {
      const now = Date.now();
      const deltaTime = now - lastScrollTime;
      const deltaScroll = Math.abs(window.scrollY - lastScrollY);
      
      if (deltaTime > 0) {
        scrollVelocity = deltaScroll / deltaTime;
      }
      
      lastScrollY = window.scrollY;
      lastScrollTime = now;
      
      clearTimeout(scrollTimeout);
      
      const snapDelay = scrollVelocity > 0.8 ? 400 : scrollVelocity > 0.3 ? 250 : 180;
      
      scrollTimeout = setTimeout(() => {
        if (isSnapping) return;
        
        const sectionHeight = window.innerHeight - NAV_HEIGHT;
        const currentScroll = window.scrollY;
        const nearestIndex = Math.round(currentScroll / sectionHeight);
        const targetScroll = nearestIndex * sectionHeight;
        const distancePercent = Math.abs(currentScroll - targetScroll) / sectionHeight;
        
        if (distancePercent > 0.05 && distancePercent < 0.45) {
          isSnapping = true;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          setTimeout(() => { isSnapping = false; }, 600);
        }
      }, snapDelay);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // 表单提交处理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(e.target),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) { 
        setFormStatus('success'); 
        e.target.reset(); 
      } else { 
        setFormStatus('error'); 
      }
    } catch { 
      setFormStatus('error'); 
    }
  };

  // 导航跳转（桌面端）
  const scrollToSection = (index) => {
    if (containerRef.current) {
      const scrollTarget = (index / sections.length) * containerRef.current.scrollHeight;
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  };

  // 共享的 props
  const sharedProps = {
    t,
    colors,
    isDark,
    capabilities,
    workExperience,
    education,
    journey,
    typeLabels,
    typeColors,
    skillsOverview,
    formStatus,
    handleSubmit,
    setFormStatus,
    wechatModalOpen,
    setWechatModalOpen,
  };

  // 根据设备类型渲染不同组件
  if (isMobile) {
    return (
      <MobileAbout 
        {...sharedProps}
        screens={mobileScreens}
      />
    );
  }

  return (
    <DesktopAbout 
      {...sharedProps}
      sections={sections}
      activeSection={activeSection}
      scrollToSection={scrollToSection}
      totalScrollHeight={totalScrollHeight}
      containerRef={containerRef}
    />
  );
};

export default About;
