import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useLocation } from 'react-router-dom';
import { useClipboard } from '../hooks/useClipboard';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useTheme } from '../hooks/useTheme';
import ScrollIndicator from '../components/ScrollIndicator';
import AnimatedSignature from '../components/AnimatedSignature';
import FrostedDotsBackground from '../components/FrostedDotsBackground';
import AboutTypewriter from '../components/AboutTypewriter';
import WechatModal from '../components/WechatModal';

/**
 * About 页面 - 全屏 Sticky Scroll 设计
 * 4 个 section 各自占据一个视口高度，滚动时切换显示
 */
const About = () => {
  const { t } = useTranslation();
  useTitle(t('about.pageTitle'));
  const location = useLocation();
  const { copiedId, copy } = useClipboard();
  const [formStatus, setFormStatus] = useState('idle');
  const [wechatModalOpen, setWechatModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef(null);
  const [isRefReady, setIsRefReady] = useState(false);

  // 确保 ref 在 useScroll 使用前已赋值
  useLayoutEffect(() => {
    if (containerRef.current && !isMobile) {
      setIsRefReady(true);
    }
  }, [isMobile]);

  // 主题颜色配置（白色模式增强对比度，适配彩色动态背景）
  const colors = {
    bg: isDark ? '#0a0a0a' : '#fafafa',
    bgAlt: isDark ? '#111' : 'rgba(255,255,255,0.85)', // 半透明白色，更好融合背景
    text: isDark ? '#fff' : '#111',
    textMuted: isDark ? '#888' : '#555', // #666 → #555，更深
    textLight: isDark ? '#555' : '#666', // #999 → #666，显著加深
    border: isDark ? '#333' : '#bbb', // #ddd → #bbb，更明显
    accent: isDark ? '#fff' : '#111',
    cardBg: isDark ? '#1a1a1a' : 'rgba(255,255,255,0.95)', // 半透明白色卡片
    inputBg: isDark ? '#1a1a1a' : '#fff',
    inputBorder: isDark ? '#333' : '#aaa', // #ddd → #aaa，更深的边框
  };

  // Section 配置
  const sections = [
    { id: 'intro', name: t('about.sectionIntro') },
    { id: 'expertise', name: t('about.sectionExpertise') },
    { id: 'journey', name: t('about.sectionJourney') },
    { id: 'contact', name: t('about.sectionContact') }
  ];

  // 总滚动高度：4个 section
  const totalScrollHeight = sections.length * 100; // vh

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

  // 能力数据
  const capabilities = [
    { title: t('about.expertise.strategy.title'), items: t('about.expertise.strategy.items', { returnObjects: true }) },
    { title: t('about.expertise.design.title'), items: t('about.expertise.design.items', { returnObjects: true }) },
    { title: t('about.expertise.development.title'), items: t('about.expertise.development.items', { returnObjects: true }) }
  ];

  // 工作经历
  const workExperience = [
    { year: t('about.work.item1.year'), role: t('about.work.item1.role'), company: t('about.work.item1.company') },
    { year: t('about.work.item2.year'), role: t('about.work.item2.role'), company: t('about.work.item2.company') },
    { year: t('about.work.item3.year'), role: t('about.work.item3.role'), company: t('about.work.item3.company') },
  ];

  // 教育背景
  const education = [
    { year: t('about.education.item1.year'), degree: t('about.education.item1.degree'), school: t('about.education.item1.school') },
    { year: t('about.education.item2.year'), degree: t('about.education.item2.degree'), school: t('about.education.item2.school') },
  ];

  // 表单提交
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgbqjeg';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(e.target),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) { setFormStatus('success'); e.target.reset(); }
      else { setFormStatus('error'); }
    } catch { setFormStatus('error'); }
  };

  // 导航跳转
  const scrollToSection = (index) => {
    if (containerRef.current) {
      const scrollTarget = (index / sections.length) * containerRef.current.scrollHeight;
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  };

  // 动画变体
  const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.4 } }
  };

  // ==================== 移动端布局 ====================
  if (isMobile) {
    return (
      <MobileAbout 
        t={t} colors={colors} capabilities={capabilities} 
        workExperience={workExperience} education={education}
        copiedId={copiedId} copy={copy} formStatus={formStatus} 
        handleSubmit={handleSubmit} setFormStatus={setFormStatus} isDark={isDark}
        wechatModalOpen={wechatModalOpen} setWechatModalOpen={setWechatModalOpen}
      />
    );
  }

  // 导航栏高度（使用 CSS 变量值）
  const navHeight = 65; // 对应 --nav-height: 65px

  // ==================== 桌面端：Sticky Scroll ====================
  return (
    <div ref={containerRef} style={{ position: 'relative', height: `${totalScrollHeight}vh`, background: colors.bg }}>
      {/* 动态磨砂光斑背景 - 固定在视口，覆盖整个屏幕（包括导航栏后方） */}
      <div style={{ 
        position: 'fixed', 
        inset: 0,
        top: 0, // 从顶部开始，覆盖导航栏空隙
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <FrostedDotsBackground />
      </div>
      
      {/* 左侧分割线 - 固定在视口，从导航栏底部延伸到页面底部 */}
      <div style={{
        position: 'fixed',
        top: `${navHeight}px`,
        left: '80px',
        bottom: 0,
        width: '1px',
        background: isDark ? colors.border : '#222',
        zIndex: 2,
        pointerEvents: 'none', // 确保不阻挡点击
      }} />
      
      {/* Sticky 容器 */}
      <div style={{ position: 'sticky', top: `${navHeight}px`, height: `calc(100vh - ${navHeight}px)`, display: 'flex', overflow: 'hidden', background: 'transparent', zIndex: 1 }}>
        
        {/* 左侧导航 */}
        <div style={{ width: '80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '3px', height: '180px', background: colors.border, borderRadius: '2px', position: 'relative', marginBottom: '24px' }}>
            <motion.div animate={{ height: `${((activeSection + 1) / sections.length) * 100}%` }} transition={{ duration: 0.4 }} style={{ width: '100%', background: colors.accent, borderRadius: '2px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sections.map((section, index) => (
              <motion.button key={section.id} onClick={() => scrollToSection(index)} whileHover={{ scale: 1.2 }} style={{ width: activeSection === index ? '12px' : '8px', height: activeSection === index ? '12px' : '8px', borderRadius: '50%', border: 'none', background: activeSection === index ? colors.accent : colors.border, cursor: 'pointer', transition: 'all 0.3s' }} title={section.name} />
            ))}
          </div>
          <div style={{ marginTop: '24px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: colors.textMuted }}>{String(activeSection + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</div>
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 3vw, 48px)', overflow: 'hidden', boxSizing: 'border-box' }}>
          <AnimatePresence mode="wait">
            {/* Section 1: Intro - 左右两栏布局 */}
            {activeSection === 0 && (
              <motion.div 
                key="intro" 
                variants={contentVariants} 
                initial="hidden" 
                animate="visible" 
                exit="exit" 
                style={{ 
                  width: '100%', 
                  maxWidth: '1400px',
                  maxHeight: '100%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(40px, 5vw, 80px)',
                  alignItems: 'center',
                }}
              >
                {/* 左栏：大照片区域 */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    maxHeight: '100%',
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '400px',
                    aspectRatio: '2 / 3',
                    maxHeight: 'min(600px, calc(100vh - 200px))',
                    borderRadius: '0', 
                    overflow: 'hidden', 
                    background: colors.bgAlt, 
                    position: 'relative',
                  }}>
                    <img 
                      src="/covers/self/tym.jpg" 
                      alt={t('about.greeting')} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center top',
                      }} 
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} 
                    />
                    <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: colors.textMuted, position: 'absolute', top: 0, left: 0 }}>
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* 右栏：签名 + 文字介绍 */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 'clamp(20px, 2.5vw, 32px)',
                  }}
                >
                  {/* 签名区域 */}
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-start', 
                      alignItems: 'center',
                    }}
                  >
                    <AnimatedSignature 
                      isDark={isDark}
                      width={Math.min(360, window.innerWidth * 0.25)}
                      height={Math.min(140, window.innerWidth * 0.1)}
                      duration={2.2}
                      initialDelay={0.4}
                      strokeWidth={1.2}
                      showFill={true}
                    />
                  </motion.div>

                  {/* 文字介绍区域 - 打字机效果 */}
                  <div>
                    <AboutTypewriter
                      greeting={t('about.greeting')}
                      line1={t('about.introLine1')}
                      line2={t('about.introLine2')}
                      line3={t('about.introLine3')}
                      line4={t('about.introLine4')}
                      colors={colors}
                    />
                    <div style={{ marginTop: 'clamp(20px, 2.5vw, 32px)', display: 'flex', gap: '12px' }}>
                      <motion.a 
                        href="/resume.pdf" 
                        target="_blank" 
                        whileHover={{ scale: 1.03 }} 
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          padding: 'clamp(10px, 1.2vw, 13px) clamp(20px, 2.5vw, 28px)', 
                          background: colors.accent, 
                          color: isDark ? '#000' : '#fff', 
                          borderRadius: '100px', 
                          fontSize: 'clamp(0.85rem, 0.95vw, 0.95rem)', 
                          fontWeight: '600', 
                          textDecoration: 'none',
                          boxShadow: isDark ? '0 4px 20px rgba(255,255,255,0.15)' : '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                      >
                        {t('about.downloadResume')}
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Section 2: Expertise */}
            {activeSection === 1 && (
              <motion.div key="expertise" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ width: '100%', maxWidth: '1000px' }}>
                <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px', color: colors.textLight, marginBottom: '45px' }}>{t('about.expertiseTitle')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '45px' }}>
                  {capabilities.map((cap, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: '400', marginBottom: '22px', color: colors.text }}>{cap.title}</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {cap.items.map((item, i) => (
                          <li key={i} style={{ marginBottom: '10px', color: colors.textMuted, fontSize: '0.95rem', paddingLeft: '14px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, top: '8px', width: '4px', height: '4px', borderRadius: '50%', background: colors.textLight }} />{item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section 3: Journey - 双轨时间轴布局 */}
            {activeSection === 2 && (
              <motion.div key="journey" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ width: '100%', maxWidth: '1000px' }}>
                <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px', color: colors.textLight, marginBottom: '45px', textAlign: 'center' }}>{t('about.journeyTitle')}</h2>
                
                {/* 双轨布局容器 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '0', alignItems: 'start' }}>
                  
                  {/* 左侧：工作经历 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '24px', width: '100%', textAlign: 'right', paddingRight: '20px' }}>{t('about.workTitle')}</h3>
                    {workExperience.map((item, index) => (
                      <motion.div 
                        key={`work-${index}`}
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ 
                          x: -4,
                          backgroundColor: colors.bgAlt,
                          boxShadow: isDark ? '0 4px 20px rgba(255,255,255,0.05)' : '0 4px 20px rgba(0,0,0,0.08)'
                        }}
                        style={{ 
                          width: '100%',
                          padding: '20px',
                          paddingRight: '24px',
                          marginBottom: '12px',
                          borderRadius: '8px',
                          borderRight: `3px solid transparent`,
                          textAlign: 'right',
                          cursor: 'default',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderRightColor = colors.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderRightColor = 'transparent';
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: colors.textMuted, marginBottom: '6px' }}>{item.year}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '500', color: colors.text, marginBottom: '4px' }}>{item.role}</div>
                        <div style={{ fontSize: '0.9rem', color: colors.textMuted }}>{item.company}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 中间：时间轴线 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
                    <div style={{ 
                      width: '2px', 
                      flex: 1, 
                      background: colors.border,
                      position: 'relative',
                      minHeight: '300px',
                    }}>
                      {/* 时间轴节点 */}
                      {[...Array(Math.max(workExperience.length, education.length))].map((_, index) => (
                        <div 
                          key={`node-${index}`}
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: `${(index / Math.max(workExperience.length, education.length)) * 100}%`,
                            transform: 'translate(-50%, 20px)',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: colors.bg,
                            border: `2px solid ${colors.accent}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 右侧：教育背景 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '24px', width: '100%', textAlign: 'left', paddingLeft: '20px' }}>{t('about.educationTitle')}</h3>
                    {education.map((item, index) => (
                      <motion.div 
                        key={`edu-${index}`}
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.15, duration: 0.5 }}
                        whileHover={{ 
                          x: 4,
                          backgroundColor: colors.bgAlt,
                          boxShadow: isDark ? '0 4px 20px rgba(255,255,255,0.05)' : '0 4px 20px rgba(0,0,0,0.08)'
                        }}
                        style={{ 
                          width: '100%',
                          padding: '20px',
                          paddingLeft: '24px',
                          marginBottom: '12px',
                          borderRadius: '8px',
                          borderLeft: `3px solid transparent`,
                          textAlign: 'left',
                          cursor: 'default',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderLeftColor = colors.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderLeftColor = 'transparent';
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: colors.textMuted, marginBottom: '6px' }}>{item.year}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '500', color: colors.text, marginBottom: '4px' }}>{item.degree}</div>
                        <div style={{ fontSize: '0.9rem', color: colors.textMuted }}>{item.school}</div>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </motion.div>
            )}

            {/* Section 4: Contact */}
            {activeSection === 3 && (
              <motion.div key="contact" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ width: '100%', maxWidth: '850px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '70px', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: '400', marginBottom: '18px', color: colors.text }}>{t('about.letsTalk')}</h2>
                  <p style={{ fontSize: '1.05rem', color: colors.textMuted, lineHeight: 1.7, marginBottom: '35px' }}>{t('about.contactIntro')}<br/>{t('about.contactIntro2')}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: colors.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6L12 13 2 6"/></svg></div>
                      <div><div style={{ fontSize: '0.75rem', color: colors.textLight, marginBottom: '2px' }}>{t('about.emailLabel')}</div><a href="mailto:tian_yangmin@163.com" style={{ fontSize: '0.95rem', color: colors.text, textDecoration: 'none' }}>tian_yangmin@163.com</a></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: colors.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill={colors.textMuted}><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg></div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: colors.textLight, marginBottom: '4px' }}>{t('about.wechatLabel')}</div>
                        <motion.button 
                          onClick={() => setWechatModalOpen(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ 
                            padding: '8px 16px', 
                            fontSize: '0.9rem', 
                            background: colors.bgAlt, 
                            color: colors.text, 
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h.01M7 12h.01M7 17h.01M12 7h.01M12 12h.01M12 17h.01M17 7h.01M17 12h.01M17 17h.01"/></svg>
                          {t('home.wechatContact')}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '28px', background: colors.cardBg, borderRadius: '14px', border: `1px solid ${colors.border}` }}>
                  {formStatus === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '35px 15px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: colors.text }}>{t('about.messageSent')}</h3>
                      <p style={{ color: colors.textMuted, marginBottom: '18px', fontSize: '0.95rem' }}>{t('about.thankYou')}</p>
                      <button onClick={() => setFormStatus('idle')} style={{ padding: '10px 22px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{t('about.sendAnother')}</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div><label style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '7px', display: 'block' }}>{t('about.formName')}</label><input type="text" name="name" required placeholder={t('about.formNamePlaceholder')} style={{ width: '100%', padding: '11px 14px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.95rem', color: colors.text, outline: 'none', boxSizing: 'border-box' }} /></div>
                        <div><label style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '7px', display: 'block' }}>{t('about.formEmail')}</label><input type="email" name="email" required placeholder={t('about.formEmailPlaceholder')} style={{ width: '100%', padding: '11px 14px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.95rem', color: colors.text, outline: 'none', boxSizing: 'border-box' }} /></div>
                        <div><label style={{ fontSize: '0.8rem', color: colors.textMuted, marginBottom: '7px', display: 'block' }}>{t('about.formDetails')}</label><textarea name="message" rows="4" placeholder={t('about.formDetailsPlaceholder')} style={{ width: '100%', padding: '11px 14px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.95rem', color: colors.text, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} /></div>
                        <button type="submit" disabled={formStatus === 'submitting'} style={{ padding: '13px 22px', background: formStatus === 'submitting' ? colors.textMuted : colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer' }}>{formStatus === 'submitting' ? t('about.submitting') : t('about.submit')}</button>
                        {formStatus === 'error' && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{t('common.error')}</p>}
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 滚动提示 */}
        <ScrollIndicator
          variant="default"
          position="bottom-center"
          color={colors.textLight}
          size="small"
          opacity={activeSection < sections.length - 1 ? 1 : 0}
        />
      </div>
      
      {/* 微信二维码弹窗 */}
      <WechatModal 
        isOpen={wechatModalOpen} 
        onClose={() => setWechatModalOpen(false)} 
      />
    </div>
  );
};

/** 移动端 About - 固定全屏切换模式（与首页一致） */
const MobileAbout = ({ t, colors, capabilities, workExperience, education, copiedId, copy, formStatus, handleSubmit, setFormStatus, isDark, wechatModalOpen, setWechatModalOpen }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const screens = [
    { id: 'intro', name: t('about.sectionIntro') },
    { id: 'expertise', name: t('about.sectionExpertise') },
    { id: 'journey', name: t('about.sectionJourney') },
    { id: 'contact', name: t('about.sectionContact') }
  ];
  const totalScreens = screens.length;

  // 切换屏幕
  const goToScreen = (index) => {
    if (isTransitioning || index === currentScreen) return;
    if (index < 0 || index >= totalScreens) return;
    setIsTransitioning(true);
    setCurrentScreen(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // 禁用页面滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // 进度条拖动逻辑
  const handleTrackInteraction = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.round(percentage * (totalScreens - 1));
    if (newIndex !== currentScreen) goToScreen(newIndex);
  };

  const canPrev = currentScreen > 0;
  const canNext = currentScreen < totalScreens - 1;
  const segmentWidth = 100 / totalScreens;
  const thumbLeft = currentScreen * segmentWidth;

  // 颜色配置
  const bgColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const activeColor = isDark ? '#fff' : colors.text;
  const mutedColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      top: 'var(--nav-height)',
      background: colors.bg,
      overflow: 'hidden',
    }}>
      {/* 动态磨砂光斑背景 */}
      <div style={{ 
        position: 'absolute', 
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <FrostedDotsBackground />
      </div>
      
      {/* 屏幕内容区 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            paddingBottom: '80px',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {/* Screen 0: Intro */}
          {currentScreen === 0 && (
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}>
              <AnimatedSignature isDark={isDark} width={260} height={162} duration={2} strokeWidth={1} />
              <div style={{ width: '50%', maxWidth: '160px', margin: '20px auto', aspectRatio: '2 / 3', borderRadius: '12px', overflow: 'hidden', background: colors.bgAlt }}>
                <img src="/covers/self/tym.jpg" alt={t('about.greeting')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '14px', color: colors.text }}>{t('about.greeting')}</h1>
              <p style={{ color: colors.textMuted, fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{t('about.introLine1')}</p>
              <p style={{ color: colors.textMuted, fontSize: '0.85rem', lineHeight: 1.7, margin: '8px 0 0 0' }}>{t('about.introLine2')}</p>
            </div>
          )}

          {/* Screen 1: Expertise */}
          {currentScreen === 1 && (
            <div style={{ width: '100%', maxWidth: '340px' }}>
              <h2 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '24px', textAlign: 'center' }}>{t('about.expertiseTitle')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {capabilities.map((cap, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: colors.text }}>{cap.title}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {cap.items.map((item, i) => (
                        <li key={i} style={{ marginBottom: '4px', color: colors.textMuted, fontSize: '0.8rem', paddingLeft: '12px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, top: '7px', width: '4px', height: '4px', borderRadius: '50%', background: colors.textLight }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Screen 2: Journey - 移动端双轨展示 */}
          {currentScreen === 2 && (
            <div style={{ width: '100%', maxWidth: '340px' }}>
              <h2 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '24px', textAlign: 'center' }}>{t('about.journeyTitle')}</h2>
              
              {/* 工作经历 */}
              <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.textLight, marginBottom: '12px' }}>{t('about.workTitle')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                {workExperience.map((item, index) => (
                  <motion.div 
                    key={`work-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    style={{ 
                      padding: '12px 0', 
                      borderBottom: index < workExperience.length - 1 ? `1px solid ${colors.border}` : 'none',
                      display: 'grid',
                      gridTemplateColumns: '70px 1fr',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: colors.textLight }}>{item.year}</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: colors.text, marginBottom: '2px' }}>{item.role}</div>
                      <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>{item.company}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 教育背景 */}
              <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: colors.textLight, marginBottom: '12px' }}>{t('about.educationTitle')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {education.map((item, index) => (
                  <motion.div 
                    key={`edu-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (workExperience.length + index) * 0.1, duration: 0.4 }}
                    style={{ 
                      padding: '12px 0', 
                      borderBottom: index < education.length - 1 ? `1px solid ${colors.border}` : 'none',
                      display: 'grid',
                      gridTemplateColumns: '70px 1fr',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: colors.textLight }}>{item.year}</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: colors.text, marginBottom: '2px' }}>{item.degree}</div>
                      <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>{item.school}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Screen 3: Contact */}
          {currentScreen === 3 && (
            <div style={{ width: '100%', maxWidth: '340px' }}>
              <h2 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '16px', textAlign: 'center' }}>{t('about.contactTitle')}</h2>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: '400', marginBottom: '10px', color: colors.text, textAlign: 'center' }}>{t('about.letsTalk')}</h3>
              <p style={{ color: colors.textMuted, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px', textAlign: 'center' }}>{t('about.contactIntro')}</p>
              
              <a href="mailto:tian_yangmin@163.com" style={{ 
                padding: '12px', background: colors.bgAlt, borderRadius: '10px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
                textDecoration: 'none', color: colors.text, marginBottom: '10px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6L12 13 2 6"/></svg>
                <span style={{ fontSize: '0.9rem' }}>tian_yangmin@163.com</span>
              </a>

              {/* 微信二维码按钮 */}
              <motion.button 
                onClick={() => setWechatModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  width: '100%',
                  padding: '12px', 
                  background: colors.bgAlt, 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px', 
                  color: colors.text, 
                  marginBottom: '16px',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.textMuted}><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/></svg>
                {t('home.wechatContact')}
              </motion.button>

              <div style={{ padding: '18px', background: colors.cardBg, borderRadius: '14px', border: `1px solid ${colors.border}` }}>
                {formStatus === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: '6px', color: colors.text }}>{t('about.messageSent')}</h3>
                    <p style={{ color: colors.textMuted, fontSize: '0.8rem', marginBottom: '10px' }}>{t('about.thankYou')}</p>
                    <button onClick={() => setFormStatus('idle')} style={{ padding: '8px 16px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>{t('about.sendAnother')}</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input type="text" name="name" required placeholder={t('about.formNamePlaceholder')} style={{ width: '100%', padding: '10px 12px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.9rem', color: colors.text, boxSizing: 'border-box' }} />
                      <input type="email" name="email" required placeholder={t('about.formEmailPlaceholder')} style={{ width: '100%', padding: '10px 12px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.9rem', color: colors.text, boxSizing: 'border-box' }} />
                      <textarea name="message" rows="3" placeholder={t('about.formDetailsPlaceholder')} style={{ width: '100%', padding: '10px 12px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.9rem', color: colors.text, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                      <button type="submit" disabled={formStatus === 'submitting'} style={{ padding: '11px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>{formStatus === 'submitting' ? t('about.submitting') : t('about.submit')}</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 底部导航条 - 与首页一致的进度条+箭头样式 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px var(--space-page-x)',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: isDark ? 'rgba(17,17,17,0.9)' : 'rgba(250,250,250,0.9)',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 左箭头 */}
          <motion.button
            onClick={() => canPrev && goToScreen(currentScreen - 1)}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', borderRadius: '50%',
              color: canPrev ? activeColor : mutedColor,
              fontSize: '1.2rem', cursor: canPrev ? 'pointer' : 'default',
              transition: 'color 0.3s', flexShrink: 0,
            }}
            disabled={!canPrev}
          >
            ‹
          </motion.button>

          {/* 进度条轨道 */}
          <div
            ref={trackRef}
            onTouchStart={(e) => { setIsDragging(true); handleTrackInteraction(e); }}
            onTouchMove={(e) => isDragging && handleTrackInteraction(e)}
            onTouchEnd={() => setIsDragging(false)}
            onClick={handleTrackInteraction}
            style={{ flex: 1, height: '24px', display: 'flex', alignItems: 'center', cursor: 'pointer', touchAction: 'none' }}
          >
            <div style={{ width: '100%', height: '3px', background: bgColor, borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
              {/* 滑块 */}
              <motion.div
                animate={{ left: `${thumbLeft}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  position: 'absolute', top: '-4px',
                  width: `${segmentWidth}%`, height: '11px',
                  background: activeColor, borderRadius: '6px',
                }}
              />
            </div>
          </div>

          {/* 右箭头 */}
          <motion.button
            onClick={() => canNext && goToScreen(currentScreen + 1)}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', borderRadius: '50%',
              color: canNext ? activeColor : mutedColor,
              fontSize: '1.2rem', cursor: canNext ? 'pointer' : 'default',
              transition: 'color 0.3s', flexShrink: 0,
            }}
            disabled={!canNext}
          >
            ›
          </motion.button>
        </div>

        {/* 当前屏幕标题 */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {screens[currentScreen]?.name}
          </span>
        </div>
      </div>
      
      {/* 微信二维码弹窗 */}
      <WechatModal 
        isOpen={wechatModalOpen} 
        onClose={() => setWechatModalOpen(false)} 
      />
    </div>
  );
};

export default About;
