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

  // 全屏滚动切换效果（仅桌面端）- 类似 fullpage.js
  useEffect(() => {
    if (isMobile) return;
    
    let isAnimating = false;
    let currentIndex = 0;
    const sectionHeight = window.innerHeight - NAV_HEIGHT;
    const maxIndex = sections.length - 1;
    
    // 初始化当前索引
    currentIndex = Math.round(window.scrollY / sectionHeight);
    currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
    
    const scrollToIndex = (index) => {
      if (isAnimating) return;
      
      // 限制索引范围
      const targetIndex = Math.min(Math.max(index, 0), maxIndex);
      
      // 如果尝试超过最后一屏，允许滚动到 footer
      if (index > maxIndex) {
        // 滚动到页面底部
        isAnimating = true;
        window.scrollTo({ 
          top: document.documentElement.scrollHeight, 
          behavior: 'smooth' 
        });
        setTimeout(() => { isAnimating = false; }, 800);
        return;
      }
      
      // 如果从 footer 区域向上滚动，回到最后一屏
      if (index < 0) {
        return;
      }
      
      const targetScroll = targetIndex * sectionHeight;
      
      isAnimating = true;
      currentIndex = targetIndex;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      setTimeout(() => { isAnimating = false; }, 800);
    };
    
    const handleWheel = (e) => {
      // 检测是否在 footer 区域
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const currentScroll = window.scrollY;
      const distanceToBottom = documentHeight - currentScroll - viewportHeight;
      const isInFooter = distanceToBottom < 100;
      
      // 如果在 footer 区域且向上滚动，回到最后一屏
      if (isInFooter && e.deltaY < 0) {
        e.preventDefault();
        scrollToIndex(maxIndex);
        return;
      }
      
      // 如果在 footer 区域且向下滚动，允许自然滚动
      if (isInFooter && e.deltaY > 0) {
        return;
      }
      
      // 更新当前索引（基于当前滚动位置）
      currentIndex = Math.round(currentScroll / sectionHeight);
      currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
      
      // 阻止默认滚动
      e.preventDefault();
      
      // 根据滚动方向切换屏幕
      if (e.deltaY > 0) {
        // 向下滚动
        scrollToIndex(currentIndex + 1);
      } else if (e.deltaY < 0) {
        // 向上滚动
        scrollToIndex(currentIndex - 1);
      }
    };
    
    // 处理键盘事件（上下箭头、Page Up/Down）
    const handleKeydown = (e) => {
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.key)) {
        e.preventDefault();
        const currentScroll = window.scrollY;
        currentIndex = Math.round(currentScroll / sectionHeight);
        scrollToIndex(currentIndex + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        const currentScroll = window.scrollY;
        currentIndex = Math.round(currentScroll / sectionHeight);
        scrollToIndex(currentIndex - 1);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isMobile, sections.length]);

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
