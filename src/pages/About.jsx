import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';
import { Link, useLocation } from 'react-router-dom';
import { useClipboard } from '../hooks/useClipboard';

// 导航圆点组件 (适配自然滚动)
const DotNavigation = ({ sections }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: '40px',
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
          onClick={() => scrollToSection(section.id)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: currentIndex === index ? '12px' : '8px',
            height: currentIndex === index ? '12px' : '8px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: currentIndex === index ? 'var(--color-text-main)' : 'var(--color-border)',
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

const About = () => {
  const { t } = useTranslation();
  useTitle(t('about.pageTitle'));
  const location = useLocation();
  const { copiedId, copy } = useClipboard();
  const [formStatus, setFormStatus] = useState('idle');

  // 处理从其他页面跳转过来时的滚动
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, [location]);

  const sections = [
    { id: 'intro', name: t('about.sectionIntro') },
    { id: 'expertise', name: t('about.sectionExpertise') },
    { id: 'journey', name: t('about.sectionJourney') },
    { id: 'contact', name: t('about.sectionContact') }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
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
        delayChildren: 0.1
      }
    }
  };

  const capabilities = [
    {
      title: t('about.expertise.strategy.title'),
      items: t('about.expertise.strategy.items', { returnObjects: true })
    },
    {
      title: t('about.expertise.design.title'),
      items: t('about.expertise.design.items', { returnObjects: true })
    },
    {
      title: t('about.expertise.development.title'),
      items: t('about.expertise.development.items', { returnObjects: true })
    }
  ];

  const journey = [
    { 
      year: t('about.journey.item1.year'), 
      role: t('about.journey.item1.role'), 
      company: t('about.journey.item1.company'),
      logo: '/images/about/logos/tech-innovators.svg'
    },
    { 
      year: t('about.journey.item2.year'), 
      role: t('about.journey.item2.role'), 
      company: t('about.journey.item2.company'),
      logo: '/images/about/logos/creative-studio.svg'
    },
    { 
      year: t('about.journey.item3.year'), 
      role: t('about.journey.item3.role'), 
      company: t('about.journey.item3.company'),
      logo: '/images/about/logos/startup-alpha.svg'
    },
    { 
      year: t('about.journey.item4.year'), 
      role: t('about.journey.item4.role'), 
      company: t('about.journey.item4.company'),
      logo: '/images/about/logos/academy-arts.svg'
    },
  ];

  // 滚动提示透明度控制
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  // Formspree 表单提交处理
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgbqjeg';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setFormStatus('success');
        e.target.reset(); // 清空表单
      } else {
        const data = await response.json();
        if (data.errors) {
          console.error('Form errors:', data.errors);
        }
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setFormStatus('error');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <DotNavigation sections={sections} />

      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          opacity: scrollIndicatorOpacity,
          position: 'fixed',
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
          zIndex: 50,
          pointerEvents: 'none',
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

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: 'clamp(60px, 8vh, 100px) clamp(40px, 5vw, 80px)',
          boxSizing: 'border-box'
        }}
      >
        
        {/* Section 1: Intro */}
        <section id="intro" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: '60px', alignItems: 'start' }}>
            {/* 左侧：个人形象照 */}
            <motion.div 
              variants={fadeInUp}
              style={{ position: 'sticky', top: '100px' }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3 / 4',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)'
              }}>
                {/* 形象照图片 - 替换 src 为您的实际照片路径 */}
                <img 
                  src="/images/about/portrait.jpg" 
                  alt={t('about.greeting')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top'
                  }}
                  onError={(e) => {
                    // 图片加载失败时显示占位符
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* 占位符 - 图片不存在时显示 */}
                <div style={{
                  display: 'none',
                  position: 'absolute',
                  inset: 0,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  gap: '12px'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                  </svg>
                  <span style={{ fontSize: '0.85rem' }}>Portrait Photo</span>
                </div>
              </div>
              {/* 形象照下方的装饰标签 */}
              <div style={{
                marginTop: '16px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  padding: '6px 12px',
                  background: 'var(--color-bg-subtle)',
                  borderRadius: '100px',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)'
                }}>
                  {t('about.expertise.design.title')}
                </span>
                <span style={{
                  padding: '6px 12px',
                  background: 'var(--color-bg-subtle)',
                  borderRadius: '100px',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)'
                }}>
                  Brand Visual
                </span>
              </div>
            </motion.div>

            {/* 右侧：文字介绍 */}
            <motion.div variants={fadeInUp} style={{ paddingTop: '20px' }}>
              <h1 style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                fontWeight: '400', 
                lineHeight: 1.1, 
                marginBottom: '40px',
                letterSpacing: '-0.03em'
              }}>
                {t('about.title')}
              </h1>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--color-text-main)', marginBottom: '24px', fontWeight: '500' }}>
                {t('about.greeting')}<br/>
                {t('about.introLine1')}
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                {t('about.introLine2')}
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                {t('about.introLine3')}
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '40px' }}>
                {t('about.introLine4')}
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <button 
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  style={{ 
                    padding: '12px 30px', 
                    background: 'var(--color-text-main)', 
                    color: 'var(--color-bg)', 
                    border: 'none', 
                    borderRadius: '100px', 
                    fontSize: '0.9rem', 
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {t('about.contactMe')}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Expertise */}
        <section id="expertise" style={{ marginBottom: '160px' }}>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            <motion.div variants={fadeInUp} style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-muted)' }}>{t('about.expertiseTitle')}</h2>
            </motion.div>
            
            {capabilities.map((cap, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px', fontWeight: '400' }}>{cap.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cap.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '10px', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: Journey */}
        <section id="journey" style={{ marginBottom: '160px' }}>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '60px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px' }}>
            <motion.div variants={fadeInUp}>
              <h2 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-muted)', position: 'sticky', top: '100px' }}>{t('about.journeyTitle')}</h2>
            </motion.div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {journey.map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '48px 100px 1fr', 
                    gap: '20px',
                    alignItems: 'center'
                  }}
                >
                  {/* 公司 Logo */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img 
                      src={item.logo} 
                      alt={item.company}
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        // Logo 加载失败时显示首字母
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Logo 占位符 - 显示公司名首字母 */}
                    <span style={{
                      display: 'none',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-serif)'
                    }}>
                      {item.company.charAt(0)}
                    </span>
                  </div>
                  
                  {/* 年份 */}
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{item.year}</div>
                  
                  {/* 职位和公司 */}
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '4px' }}>{item.role}</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>{item.company}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Contact (Merged) */}
        <section id="contact" style={{ marginBottom: '100px' }}>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px' }}>
            
            {/* Left Column: Info */}
            <div>
              <motion.div variants={fadeInUp}>
                <h2 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-muted)', marginBottom: '40px' }}>{t('about.contactTitle')}</h2>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
                  fontWeight: '400', 
                  lineHeight: 1.1, 
                  marginBottom: '40px',
                  letterSpacing: '-0.03em',
                  color: 'var(--color-text-main)'
                }}
              >
                {t('about.letsTalk')}
              </motion.h1>
              
              <motion.p variants={fadeInUp} style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '450px' }}>
                {t('about.contactIntro')}<br/>
                {t('about.contactIntro2')}
              </motion.p>

              {/* 个人签名装饰 */}
              <motion.div 
                variants={fadeInUp}
                style={{ 
                  marginBottom: '40px',
                  position: 'relative'
                }}
              >
                {/* 签名图片 - 替换为实际签名图片路径 */}
                <img 
                  src="/images/about/signature.svg" 
                  alt="Signature"
                  style={{
                    height: '60px',
                    width: 'auto',
                    opacity: 0.8,
                    filter: 'var(--filter-invert, none)'
                  }}
                  onError={(e) => {
                    // 签名图片加载失败时显示手写风格文字
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                {/* 签名占位符 - 手写风格 */}
                <div style={{
                  display: 'none',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontStyle: 'italic',
                  color: 'var(--color-text-main)',
                  opacity: 0.6,
                  transform: 'rotate(-3deg)',
                  letterSpacing: '2px'
                }}>
                  Lumi Tian
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Email Item */}
                <div>
                  <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>{t('about.emailLabel')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <a href="mailto:hello@example.com" style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', textDecoration: 'none', fontFamily: 'var(--font-serif)' }}>
                      hello@example.com
                    </a>
                    <button 
                      onClick={() => copy('hello@example.com', 'email')}
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid var(--color-border)', 
                        borderRadius: '20px', 
                        padding: '4px 12px', 
                        fontSize: '0.75rem', 
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      {copiedId === 'email' ? t('about.copied') : t('about.copy')}
                    </button>
                  </div>
                </div>

                {/* WeChat Item */}
                <div>
                  <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>{t('about.wechatLabel')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-serif)' }}>
                      wx_username
                    </span>
                    <button 
                      onClick={() => copy('wx_username', 'wechat')}
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid var(--color-border)', 
                        borderRadius: '20px', 
                        padding: '4px 12px', 
                        fontSize: '0.75rem', 
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      {copiedId === 'wechat' ? t('about.copied') : t('about.copy')}
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                  {['LinkedIn', 'Twitter', 'Instagram'].map(social => (
                    <a key={social} href="#" style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                      {social}
                    </a>
                  ))}
                </div>

              </motion.div>
            </div>

            {/* Right Column: Form */}
            <motion.div variants={fadeInUp}>
              <div style={{ 
                background: 'var(--color-bg)', 
                padding: '40px', 
                borderRadius: '24px', 
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '30px', fontWeight: '400' }}>{t('about.projectConsultation')}</h3>
                
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '40px 0' }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✨</div>
                    <h3 style={{ marginBottom: '10px' }}>{t('about.messageSent')}</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>{t('about.thankYou')}</p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      style={{ padding: '12px 30px', background: 'var(--color-text-main)', color: 'var(--color-bg)', border: 'none', borderRadius: '100px', cursor: 'pointer' }}
                    >
                      {t('about.sendAnother')}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* 错误提示 */}
                    {formStatus === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>⚠️</span>
                        <span>{t('about.formError') || '发送失败，请稍后重试或直接发送邮件联系我。'}</span>
                      </motion.div>
                    )}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('about.formName')}</label>
                        <input name="name" required type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} placeholder={t('about.formNamePlaceholder')} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('about.formEmail')}</label>
                        <input name="email" required type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} placeholder={t('about.formEmailPlaceholder')} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('about.formProjectType')}</label>
                      <select name="project_type" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', color: 'var(--color-text-main)' }}>
                        <option>{t('about.formProjectTypeOptions.webDesign')}</option>
                        <option>{t('about.formProjectTypeOptions.mobileApp')}</option>
                        <option>{t('about.formProjectTypeOptions.branding')}</option>
                        <option>{t('about.formProjectTypeOptions.consulting')}</option>
                        <option>{t('about.formProjectTypeOptions.other')}</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t('about.formDetails')}</label>
                      <textarea name="message" required rows="5" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)', fontSize: '0.95rem', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} placeholder={t('about.formDetailsPlaceholder')}></textarea>
                    </div>

                    <button
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      style={{ 
                        marginTop: '10px',
                        width: '100%', 
                        padding: '16px', 
                        background: 'var(--color-text-main)', 
                        color: 'var(--color-bg)', 
                        border: 'none', 
                        borderRadius: '100px', 
                        fontSize: '0.95rem', 
                        fontWeight: '500', 
                        cursor: formStatus === 'submitting' ? 'wait' : 'pointer', 
                        opacity: formStatus === 'submitting' ? 0.7 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {formStatus === 'submitting' ? t('about.submitting') : t('about.submit')}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </section>

      </motion.div>
    </div>
  );
};

export default About;