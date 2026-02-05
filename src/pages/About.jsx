import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { useLocation } from 'react-router-dom';
import { useClipboard } from '../hooks/useClipboard';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useTheme } from '../hooks/useTheme';

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
  const [activeSection, setActiveSection] = useState(0);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef(null);

  // 主题颜色配置
  const colors = {
    bg: isDark ? '#0a0a0a' : '#fafafa',
    bgAlt: isDark ? '#111' : '#f5f5f5',
    text: isDark ? '#fff' : '#111',
    textMuted: isDark ? '#888' : '#666',
    textLight: isDark ? '#555' : '#999',
    border: isDark ? '#333' : '#ddd',
    accent: isDark ? '#fff' : '#111',
    cardBg: isDark ? '#1a1a1a' : '#fff',
    inputBg: isDark ? '#1a1a1a' : '#fff',
    inputBorder: isDark ? '#333' : '#ddd',
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

  // 使用 useScroll 监听滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 根据滚动进度计算当前 section
  useEffect(() => {
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
  }, [scrollYProgress, sections.length, activeSection]);

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

  // 职业历程
  const journey = [
    { year: t('about.journey.item1.year'), role: t('about.journey.item1.role'), company: t('about.journey.item1.company') },
    { year: t('about.journey.item2.year'), role: t('about.journey.item2.role'), company: t('about.journey.item2.company') },
    { year: t('about.journey.item3.year'), role: t('about.journey.item3.role'), company: t('about.journey.item3.company') },
    { year: t('about.journey.item4.year'), role: t('about.journey.item4.role'), company: t('about.journey.item4.company') },
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
        t={t} colors={colors} capabilities={capabilities} journey={journey}
        copiedId={copiedId} copy={copy} formStatus={formStatus} 
        handleSubmit={handleSubmit} setFormStatus={setFormStatus} isDark={isDark}
      />
    );
  }

  // 导航栏高度
  const navHeight = 80;

  // ==================== 桌面端：Sticky Scroll ====================
  return (
    <div ref={containerRef} style={{ position: 'relative', height: `${totalScrollHeight}vh`, background: colors.bg }}>
      {/* Sticky 容器 */}
      <div style={{ position: 'sticky', top: `${navHeight}px`, height: `calc(100vh - ${navHeight}px)`, display: 'flex', overflow: 'hidden', background: colors.bg }}>
        
        {/* 左侧导航 */}
        <div style={{ width: '80px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: `1px solid ${colors.border}` }}>
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
        <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(40px, 5vw, 80px)', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            {/* Section 1: Intro */}
            {activeSection === 0 && (
              <motion.div key="intro" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '60px', alignItems: 'center' }}>
                <div>
                  <div style={{ aspectRatio: '3 / 4', borderRadius: '16px', overflow: 'hidden', background: colors.bgAlt, border: `1px solid ${colors.border}` }}>
                    <img src="/images/about/portrait.jpg" alt={t('about.greeting')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                    <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: colors.textMuted }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg></div>
                  </div>
                </div>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: '400', marginBottom: '28px', lineHeight: 1.15, color: colors.text }}>{t('about.greeting')}</h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', color: colors.textMuted, fontSize: '1.05rem', lineHeight: 1.7 }}>
                    <p style={{ margin: 0 }}>{t('about.introLine1')}</p>
                    <p style={{ margin: 0 }}>{t('about.introLine2')}</p>
                    <p style={{ margin: 0 }}>{t('about.introLine3')}</p>
                    <p style={{ margin: 0 }}>{t('about.introLine4')}</p>
                  </div>
                  <div style={{ marginTop: '35px', display: 'flex', gap: '15px' }}>
                    <motion.a href="/resume.pdf" target="_blank" whileHover={{ scale: 1.05 }} style={{ padding: '13px 30px', background: colors.accent, color: isDark ? '#000' : '#fff', borderRadius: '100px', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>{t('about.downloadResume')}</motion.a>
                  </div>
                </div>
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

            {/* Section 3: Journey */}
            {activeSection === 2 && (
              <motion.div key="journey" variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ width: '100%', maxWidth: '750px' }}>
                <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '3px', color: colors.textLight, marginBottom: '45px' }}>{t('about.journeyTitle')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {journey.map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '35px', padding: '28px 0', borderBottom: index < journey.length - 1 ? `1px solid ${colors.border}` : 'none', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: colors.textMuted }}>{item.year}</div>
                      <div><div style={{ fontSize: '1.25rem', fontWeight: '500', color: colors.text, marginBottom: '5px' }}>{item.role}</div><div style={{ fontSize: '0.95rem', color: colors.textMuted }}>{item.company}</div></div>
                    </motion.div>
                  ))}
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
                      <div><div style={{ fontSize: '0.75rem', color: colors.textLight, marginBottom: '2px' }}>{t('about.wechatLabel')}</div><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '0.95rem', color: colors.text }}>your_wechat_id</span><button onClick={() => copy('your_wechat_id', 'wechat')} style={{ padding: '3px 9px', fontSize: '0.7rem', background: colors.bgAlt, color: colors.textMuted, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{copiedId === 'wechat' ? t('about.copied') : t('about.copy')}</button></div></div>
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
        {activeSection < sections.length - 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', bottom: '35px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px', color: colors.textLight, fontSize: '0.75rem' }}>
            <span>{t('common.scroll')}</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↓</motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/** 移动端 About */
const MobileAbout = ({ t, colors, capabilities, journey, copiedId, copy, formStatus, handleSubmit, setFormStatus, isDark }) => (
  <div style={{ padding: 'var(--space-lg) var(--space-page-x)', background: colors.bg }}>
    {/* Intro */}
    <section style={{ marginBottom: '50px', paddingTop: 'var(--space-md)' }}>
      <div style={{ width: '50%', maxWidth: '160px', margin: '0 auto 25px', aspectRatio: '3 / 4', borderRadius: '12px', overflow: 'hidden', background: colors.bgAlt }}>
        <img src="/images/about/portrait.jpg" alt={t('about.greeting')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
      </div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '400', textAlign: 'center', marginBottom: '18px', color: colors.text }}>{t('about.greeting')}</h1>
      <div style={{ color: colors.textMuted, fontSize: '0.9rem', lineHeight: 1.7, textAlign: 'center' }}><p>{t('about.introLine1')}</p><p>{t('about.introLine2')}</p></div>
    </section>

    {/* Expertise */}
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '25px', borderTop: `1px solid ${colors.border}`, paddingTop: '18px' }}>{t('about.expertiseTitle')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {capabilities.map((cap, index) => (
          <div key={index}><h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '10px', color: colors.text }}>{cap.title}</h3><ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{cap.items.map((item, i) => <li key={i} style={{ marginBottom: '6px', color: colors.textMuted, fontSize: '0.85rem' }}>{item}</li>)}</ul></div>
        ))}
      </div>
    </section>

    {/* Journey */}
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '25px', borderTop: `1px solid ${colors.border}`, paddingTop: '18px' }}>{t('about.journeyTitle')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {journey.map((item, index) => (
          <div key={index} style={{ paddingBottom: '20px', borderBottom: index < journey.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: colors.textLight, marginBottom: '6px' }}>{item.year}</div>
            <div style={{ fontSize: '1rem', fontWeight: '500', color: colors.text, marginBottom: '3px' }}>{item.role}</div>
            <div style={{ fontSize: '0.85rem', color: colors.textMuted }}>{item.company}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Contact */}
    <section>
      <h2 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.textLight, marginBottom: '18px', borderTop: `1px solid ${colors.border}`, paddingTop: '18px' }}>{t('about.contactTitle')}</h2>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: '400', marginBottom: '12px', color: colors.text }}>{t('about.letsTalk')}</h3>
      <p style={{ color: colors.textMuted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '25px' }}>{t('about.contactIntro')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '25px' }}>
        <a href="mailto:tian_yangmin@163.com" style={{ padding: '14px', background: colors.bgAlt, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: colors.text }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6L12 13 2 6"/></svg><span style={{ fontSize: '0.9rem' }}>tian_yangmin@163.com</span></a>
      </div>
      <div style={{ padding: '20px', background: colors.cardBg, borderRadius: '14px', border: `1px solid ${colors.border}` }}>
        {formStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '18px 0' }}><div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div><h3 style={{ fontSize: '1rem', marginBottom: '8px', color: colors.text }}>{t('about.messageSent')}</h3><p style={{ color: colors.textMuted, fontSize: '0.85rem', marginBottom: '12px' }}>{t('about.thankYou')}</p><button onClick={() => setFormStatus('idle')} style={{ padding: '9px 18px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>{t('about.sendAnother')}</button></div>
        ) : (
          <form onSubmit={handleSubmit}><div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}><input type="text" name="name" required placeholder={t('about.formNamePlaceholder')} style={{ width: '100%', padding: '11px 12px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.95rem', color: colors.text, boxSizing: 'border-box' }} /><input type="email" name="email" required placeholder={t('about.formEmailPlaceholder')} style={{ width: '100%', padding: '11px 12px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.95rem', color: colors.text, boxSizing: 'border-box' }} /><textarea name="message" rows="4" placeholder={t('about.formDetailsPlaceholder')} style={{ width: '100%', padding: '11px 12px', background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: '8px', fontSize: '0.95rem', color: colors.text, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} /><button type="submit" disabled={formStatus === 'submitting'} style={{ padding: '12px', background: colors.accent, color: isDark ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}>{formStatus === 'submitting' ? t('about.submitting') : t('about.submit')}</button></div></form>
        )}
      </div>
    </section>
  </div>
);

export default About;
