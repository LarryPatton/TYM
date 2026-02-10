import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSignature from '../../components/AnimatedSignature';
import FrostedDotsBackground from '../../components/FrostedDotsBackground';
import WechatModal from '../../components/WechatModal';

/**
 * 移动端 About 组件
 * 固定全屏切换模式（与首页一致）
 */
const MobileAbout = ({ 
  t, 
  colors, 
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
  isDark, 
  wechatModalOpen, 
  setWechatModalOpen,
  screens 
}) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
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
            <IntroScreen t={t} colors={colors} isDark={isDark} />
          )}

          {/* Screen 1: Journey（职业历程） */}
          {currentScreen === 1 && (
            <JourneyScreen 
              t={t} 
              colors={colors} 
              journey={journey}
              typeLabels={typeLabels}
              typeColors={typeColors}
            />
          )}

          {/* Screen 2: Skills（能力概览） */}
          {currentScreen === 2 && (
            <SkillsScreen 
              t={t}
              colors={colors}
              isDark={isDark}
              skillsOverview={skillsOverview}
            />
          )}

          {/* Screen 3: Contact */}
          {currentScreen === 3 && (
            <ContactScreen 
              t={t} 
              colors={colors} 
              isDark={isDark}
              formStatus={formStatus}
              handleSubmit={handleSubmit}
              setFormStatus={setFormStatus}
              setWechatModalOpen={setWechatModalOpen}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 底部导航条 */}
      <BottomNavigation
        trackRef={trackRef}
        currentScreen={currentScreen}
        totalScreens={totalScreens}
        canPrev={canPrev}
        canNext={canNext}
        segmentWidth={segmentWidth}
        thumbLeft={thumbLeft}
        goToScreen={goToScreen}
        handleTrackInteraction={handleTrackInteraction}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        activeColor={activeColor}
        mutedColor={mutedColor}
        bgColor={bgColor}
        colors={colors}
        isDark={isDark}
        screens={screens}
      />
      
      {/* 微信二维码弹窗 */}
      <WechatModal 
        isOpen={wechatModalOpen} 
        onClose={() => setWechatModalOpen(false)} 
      />
    </div>
  );
};

/**
 * 介绍屏幕组件
 */
const IntroScreen = ({ t, colors, isDark }) => (
  <div style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}>
    <AnimatedSignature isDark={isDark} width={260} height={162} duration={2} strokeWidth={1} />
    <div style={{ 
      width: '50%', 
      maxWidth: '160px', 
      margin: '20px auto', 
      aspectRatio: '2 / 3', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      background: colors.bgAlt 
    }}>
      <img 
        src="/covers/self/tym.jpg" 
        alt={t('about.greeting')} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        onError={(e) => { e.target.style.display = 'none'; }} 
      />
    </div>
    <h1 style={{ 
      fontFamily: 'var(--font-serif)', 
      fontSize: '1.6rem', 
      fontWeight: '400', 
      marginBottom: '14px', 
      color: colors.text 
    }}>
      {t('about.greeting')}
    </h1>
    <p style={{ color: colors.textMuted, fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
      {t('about.introLine1')}
    </p>
    <p style={{ color: colors.textMuted, fontSize: '0.85rem', lineHeight: 1.7, margin: '8px 0 0 0' }}>
      {t('about.introLine2')}
    </p>
  </div>
);

/**
 * 职业历程屏幕组件（合并时间轴版本）
 */
const JourneyScreen = ({ t, colors, journey, typeLabels, typeColors }) => (
  <div style={{ width: '100%', maxWidth: '340px' }}>
    <h2 style={{ 
      fontSize: '0.7rem', 
      textTransform: 'uppercase', 
      letterSpacing: '2px', 
      color: colors.textLight, 
      marginBottom: '24px', 
      textAlign: 'center' 
    }}>
      {t('about.journeyTitle')}
    </h2>
    
    {/* 合并的职业历程列表 */}
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* 时间轴线 */}
      <div style={{
        position: 'absolute',
        left: '85px', // 80px宽度 + 5px间距
        top: '12px',
        bottom: '12px',
        width: '1px',
        background: colors.border,
      }} />

      {journey.map((item, index) => (
        <motion.div 
          key={`journey-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          style={{ 
            padding: '12px 0', 
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          {/* 左侧：起止年份 */}
          <div style={{ 
            width: '80px', 
            flexShrink: 0,
            textAlign: 'right',
            paddingTop: '4px',
          }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontFamily: 'var(--font-mono)', 
              fontWeight: '500',
              color: colors.text,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
            }}>
              {item.period}
            </div>
          </div>

          {/* 中间：时间轴圆点 */}
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: typeColors[item.type],
            border: `2px solid ${colors.bg}`,
            boxShadow: `0 0 0 1px ${typeColors[item.type]}40`,
            flexShrink: 0,
            marginTop: '5px',
            zIndex: 1,
          }} />

          {/* 右侧：内容 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 类型标签 */}
            <span style={{
              fontSize: '0.6rem',
              fontWeight: '600',
              color: typeColors[item.type],
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '1px 5px',
              borderRadius: '3px',
              background: `${typeColors[item.type]}12`,
              display: 'inline-block',
              marginBottom: '4px',
            }}>
              {typeLabels[item.type]}
            </span>
            
            {/* 标题 */}
            <div style={{ 
              fontSize: '0.9rem', 
              fontWeight: '500', 
              color: colors.text, 
              marginBottom: '2px',
              lineHeight: 1.3,
            }}>
              {item.title}
            </div>
            
            {/* 副标题 */}
            <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>
              {item.subtitle}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/**
 * 能力概览屏幕组件
 * 移动端版本：紧凑布局，点击展开交付物
 */
const SkillsScreen = ({ t, colors, isDark, skillsOverview }) => {
  const [expandedModule, setExpandedModule] = useState(null);

  return (
    <div style={{ width: '100%', maxWidth: '340px' }}>
      {/* 标题 */}
      <h2 style={{ 
        fontSize: '0.7rem', 
        textTransform: 'uppercase', 
        letterSpacing: '2px', 
        color: colors.textLight, 
        marginBottom: '12px', 
        textAlign: 'center' 
      }}>
        {skillsOverview.title}
      </h2>

      {/* 介绍文字 */}
      <p style={{
        fontSize: '0.8rem',
        color: colors.textMuted,
        lineHeight: 1.6,
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        {skillsOverview.intro}
      </p>

      {/* 分隔线 */}
      <div style={{
        height: '1px',
        background: isDark ? colors.border : '#222',
        marginBottom: '12px',
      }} />

      {/* 能力模块列表 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {skillsOverview.modules.map((module, index) => (
          <motion.div
            key={module.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            onClick={() => setExpandedModule(expandedModule === module.key ? null : module.key)}
            style={{
              padding: '10px 0',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              cursor: 'pointer',
            }}
          >
            {/* 模块标题 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '500',
                color: colors.text,
              }}>
                {module.title}
              </div>
              <motion.span
                animate={{ rotate: expandedModule === module.key ? 180 : 0 }}
                style={{
                  fontSize: '0.7rem',
                  color: colors.textMuted,
                }}
              >
                ▼
              </motion.span>
            </div>

            {/* 模块描述 */}
            <div style={{
              fontSize: '0.75rem',
              color: colors.textMuted,
              lineHeight: 1.4,
              marginTop: '4px',
            }}>
              {module.desc}
            </div>

            {/* 交付物（点击展开） */}
            <AnimatePresence>
              {expandedModule === module.key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    marginTop: '8px',
                    paddingLeft: '10px',
                    borderLeft: `2px solid ${colors.accent}`,
                  }}>
                    <span style={{
                      fontSize: '0.6rem',
                      color: colors.textLight,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {skillsOverview.deliverableLabel}:
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: colors.text,
                      marginLeft: '6px',
                    }}>
                      {module.deliverables}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 底部分隔线 */}
      <div style={{
        height: '1px',
        background: isDark ? colors.border : '#222',
        marginTop: '4px',
        marginBottom: '14px',
      }} />

      {/* 工具 - 分组展示 */}
      <div>
        {/* 工具总标题 */}
        <div style={{
          fontSize: '0.7rem',
          fontWeight: '600',
          color: colors.textLight,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          {skillsOverview.tools.label}
        </div>
        
        {/* 专业向工具组 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '0.65rem',
            color: colors.textMuted,
            marginBottom: '6px',
            textAlign: 'center',
          }}>
            {skillsOverview.tools.professional?.label}
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '4px',
            justifyContent: 'center',
          }}>
            {(Array.isArray(skillsOverview.tools.professional?.items) 
              ? skillsOverview.tools.professional.items 
              : []
            ).map((tool, index) => (
              <span
                key={tool}
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: isDark ? '#ccc' : colors.textMuted,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
        
        {/* 通用效率工具组 */}
        <div>
          <div style={{
            fontSize: '0.65rem',
            color: colors.textMuted,
            marginBottom: '6px',
            textAlign: 'center',
          }}>
            {skillsOverview.tools.efficiency?.label}
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '4px',
            justifyContent: 'center',
          }}>
            {(Array.isArray(skillsOverview.tools.efficiency?.items) 
              ? skillsOverview.tools.efficiency.items 
              : []
            ).map((tool, index) => (
              <span
                key={tool}
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: isDark ? '#ccc' : colors.textMuted,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 联系屏幕组件
 */
const ContactScreen = ({ t, colors, isDark, formStatus, handleSubmit, setFormStatus, setWechatModalOpen }) => (
  <div style={{ width: '100%', maxWidth: '340px' }}>
    <h2 style={{ 
      fontSize: '0.7rem', 
      textTransform: 'uppercase', 
      letterSpacing: '2px', 
      color: colors.textLight, 
      marginBottom: '16px', 
      textAlign: 'center' 
    }}>
      {t('about.contactTitle')}
    </h2>
    <h3 style={{ 
      fontFamily: 'var(--font-serif)', 
      fontSize: '1.4rem', 
      fontWeight: '400', 
      marginBottom: '10px', 
      color: colors.text, 
      textAlign: 'center' 
    }}>
      {t('about.letsTalk')}
    </h3>
    <p style={{ 
      color: colors.textMuted, 
      fontSize: '0.85rem', 
      lineHeight: 1.6, 
      marginBottom: '20px', 
      textAlign: 'center' 
    }}>
      {t('about.contactIntro')}
    </p>
    
    {/* 邮箱链接 */}
    <a href="mailto:tian_yangmin@163.com" style={{ 
      padding: '12px', 
      background: colors.bgAlt, 
      borderRadius: '10px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '10px', 
      textDecoration: 'none', 
      color: colors.text, 
      marginBottom: '10px'
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M22 6L12 13 2 6"/>
      </svg>
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.textMuted}>
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
      </svg>
      {t('home.wechatContact')}
    </motion.button>

    {/* 联系表单 */}
    <ContactForm 
      t={t} 
      colors={colors} 
      isDark={isDark} 
      formStatus={formStatus} 
      handleSubmit={handleSubmit} 
      setFormStatus={setFormStatus} 
    />
  </div>
);

/**
 * 联系表单组件
 */
const ContactForm = ({ t, colors, isDark, formStatus, handleSubmit, setFormStatus }) => (
  <div style={{ 
    padding: '18px', 
    background: colors.cardBg, 
    borderRadius: '14px', 
    border: `1px solid ${colors.border}` 
  }}>
    {formStatus === 'success' ? (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: '#22c55e20', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 10px' 
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '6px', color: colors.text }}>
          {t('about.messageSent')}
        </h3>
        <p style={{ color: colors.textMuted, fontSize: '0.8rem', marginBottom: '10px' }}>
          {t('about.thankYou')}
        </p>
        <button 
          onClick={() => setFormStatus('idle')} 
          style={{ 
            padding: '8px 16px', 
            background: colors.accent, 
            color: isDark ? '#000' : '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontSize: '0.85rem' 
          }}
        >
          {t('about.sendAnother')}
        </button>
      </div>
    ) : (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            name="name" 
            required 
            placeholder={t('about.formNamePlaceholder')} 
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              background: colors.inputBg, 
              border: `1px solid ${colors.inputBorder}`, 
              borderRadius: '8px', 
              fontSize: '0.9rem', 
              color: colors.text, 
              boxSizing: 'border-box' 
            }} 
          />
          <input 
            type="email" 
            name="email" 
            required 
            placeholder={t('about.formEmailPlaceholder')} 
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              background: colors.inputBg, 
              border: `1px solid ${colors.inputBorder}`, 
              borderRadius: '8px', 
              fontSize: '0.9rem', 
              color: colors.text, 
              boxSizing: 'border-box' 
            }} 
          />
          <textarea 
            name="message" 
            rows="3" 
            placeholder={t('about.formDetailsPlaceholder')} 
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              background: colors.inputBg, 
              border: `1px solid ${colors.inputBorder}`, 
              borderRadius: '8px', 
              fontSize: '0.9rem', 
              color: colors.text, 
              resize: 'none', 
              fontFamily: 'inherit', 
              boxSizing: 'border-box' 
            }} 
          />
          <button 
            type="submit" 
            disabled={formStatus === 'submitting'} 
            style={{ 
              padding: '11px', 
              background: colors.accent, 
              color: isDark ? '#000' : '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '0.9rem', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            {formStatus === 'submitting' ? t('about.submitting') : t('about.submit')}
          </button>
        </div>
      </form>
    )}
  </div>
);

/**
 * 底部导航组件
 */
const BottomNavigation = ({
  trackRef,
  currentScreen,
  totalScreens,
  canPrev,
  canNext,
  segmentWidth,
  thumbLeft,
  goToScreen,
  handleTrackInteraction,
  isDragging,
  setIsDragging,
  activeColor,
  mutedColor,
  bgColor,
  colors,
  isDark,
  screens
}) => (
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
          width: '32px', 
          height: '32px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'transparent', 
          border: 'none', 
          borderRadius: '50%',
          color: canPrev ? activeColor : mutedColor,
          fontSize: '1.2rem', 
          cursor: canPrev ? 'pointer' : 'default',
          transition: 'color 0.3s', 
          flexShrink: 0,
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
        style={{ 
          flex: 1, 
          height: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', 
          touchAction: 'none' 
        }}
      >
        <div style={{ 
          width: '100%', 
          height: '3px', 
          background: bgColor, 
          borderRadius: '2px', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <motion.div
            animate={{ left: `${thumbLeft}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute', 
              top: '-4px',
              width: `${segmentWidth}%`, 
              height: '11px',
              background: activeColor, 
              borderRadius: '6px',
            }}
          />
        </div>
      </div>

      {/* 右箭头 */}
      <motion.button
        onClick={() => canNext && goToScreen(currentScreen + 1)}
        whileTap={{ scale: 0.9 }}
        style={{
          width: '32px', 
          height: '32px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'transparent', 
          border: 'none', 
          borderRadius: '50%',
          color: canNext ? activeColor : mutedColor,
          fontSize: '1.2rem', 
          cursor: canNext ? 'pointer' : 'default',
          transition: 'color 0.3s', 
          flexShrink: 0,
        }}
        disabled={!canNext}
      >
        ›
      </motion.button>
    </div>

    {/* 当前屏幕标题 */}
    <div style={{ textAlign: 'center', marginTop: '8px' }}>
      <span style={{ 
        fontSize: '0.7rem', 
        color: colors.textMuted, 
        textTransform: 'uppercase', 
        letterSpacing: '1px' 
      }}>
        {screens[currentScreen]?.name}
      </span>
    </div>
  </div>
);

export default MobileAbout;
