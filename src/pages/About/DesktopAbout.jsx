import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollIndicator from '../../components/ScrollIndicator';
import AnimatedSignature from '../../components/AnimatedSignature';
import FrostedDotsBackground from '../../components/FrostedDotsBackground';
import AboutTypewriter from '../../components/AboutTypewriter';
import WechatModal from '../../components/WechatModal';
import { contentVariants, NAV_HEIGHT } from './constants';

/**
 * 桌面端 About 组件
 * 全屏 Sticky Scroll 设计
 */
const DesktopAbout = ({
  t,
  colors,
  sections,
  workExperience,
  education,
  journey,
  typeLabels,
  typeColors,
  skillsOverview,
  activeSection,
  scrollToSection,
  totalScrollHeight,
  containerRef,
  isDark,
  formStatus,
  handleSubmit,
  setFormStatus,
  wechatModalOpen,
  setWechatModalOpen,
}) => {
  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        height: `${totalScrollHeight}vh`, 
        background: colors.bg 
      }}
    >
      {/* 动态磨砂光斑背景 */}
      <div style={{ 
        position: 'fixed', 
        inset: 0,
        top: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <FrostedDotsBackground />
      </div>
      
      {/* 左侧分割线 */}
      <div style={{
        position: 'fixed',
        top: `${NAV_HEIGHT}px`,
        left: '80px',
        bottom: 0,
        width: '1px',
        background: isDark ? colors.border : '#222',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      
      {/* Sticky 容器 */}
      <div style={{ 
        position: 'sticky', 
        top: `${NAV_HEIGHT}px`, 
        height: `calc(100vh - ${NAV_HEIGHT}px)`, 
        display: 'flex', 
        overflow: 'hidden', 
        background: 'transparent', 
        zIndex: 1 
      }}>
        
        {/* 左侧导航 */}
        <LeftNavigation 
          sections={sections}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          colors={colors}
        />

        {/* 内容区域 */}
        <div style={{ 
          flex: 1, 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 'clamp(24px, 3vw, 48px)', 
          overflow: 'hidden', 
          boxSizing: 'border-box' 
        }}>
          <AnimatePresence mode="wait">
            {/* Section 1: Intro */}
            {activeSection === 0 && (
              <IntroSection t={t} colors={colors} isDark={isDark} />
            )}

            {/* Section 2: 职业历程 & 能力概览 */}
            {activeSection === 1 && (
              <JourneySection 
                t={t} 
                colors={colors} 
                isDark={isDark}
                journey={journey}
                typeLabels={typeLabels}
                typeColors={typeColors}
                skillsOverview={skillsOverview}
              />
            )}

            {/* Section 3: Contact */}
            {activeSection === 2 && (
              <ContactSection 
                t={t}
                colors={colors}
                isDark={isDark}
                formStatus={formStatus}
                handleSubmit={handleSubmit}
                setFormStatus={setFormStatus}
                setWechatModalOpen={setWechatModalOpen}
              />
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

/**
 * 左侧导航组件
 */
const LeftNavigation = ({ sections, activeSection, scrollToSection, colors }) => (
  <div style={{ 
    width: '80px', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    {/* 进度条 */}
    <div style={{ 
      width: '3px', 
      height: '180px', 
      background: colors.border, 
      borderRadius: '2px', 
      position: 'relative', 
      marginBottom: '24px' 
    }}>
      <motion.div 
        animate={{ height: `${((activeSection + 1) / sections.length) * 100}%` }} 
        transition={{ duration: 0.4 }} 
        style={{ width: '100%', background: colors.accent, borderRadius: '2px' }} 
      />
    </div>
    
    {/* 导航点 */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {sections.map((section, index) => (
        <motion.button 
          key={section.id} 
          onClick={() => scrollToSection(index)} 
          whileHover={{ scale: 1.2 }} 
          style={{ 
            width: activeSection === index ? '12px' : '8px', 
            height: activeSection === index ? '12px' : '8px', 
            borderRadius: '50%', 
            border: 'none', 
            background: activeSection === index ? colors.accent : colors.border, 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }} 
          title={section.name} 
        />
      ))}
    </div>
    
    {/* 页码 */}
    <div style={{ 
      marginTop: '24px', 
      fontSize: '0.7rem', 
      fontFamily: 'var(--font-mono)', 
      color: colors.textMuted 
    }}>
      {String(activeSection + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
    </div>
  </div>
);

/**
 * Intro Section 组件
 */
const IntroSection = ({ t, colors, isDark }) => (
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
    {/* 左栏：照片 */}
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
          onError={(e) => { 
            e.target.style.display = 'none'; 
            e.target.nextSibling.style.display = 'flex'; 
          }} 
        />
        <div style={{ 
          display: 'none', 
          width: '100%', 
          height: '100%', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: colors.textMuted, 
          position: 'absolute', 
          top: 0, 
          left: 0 
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
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

      {/* 打字机效果文字 */}
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
);

/**
 * Journey Section 组件 - 职业历程 & 能力概览（左右分栏布局）
 * 左侧：时间线（保持原有设计）
 * 右侧：能力模块（黑色细线分区 + 打字机效果）
 */
const JourneySection = ({ t, colors, isDark, journey, typeLabels, typeColors, skillsOverview }) => (
  <motion.div 
    key="journey" 
    variants={contentVariants} 
    initial="hidden" 
    animate="visible" 
    exit="exit" 
    style={{ 
      width: '100%', 
      maxWidth: '1200px',
      display: 'grid',
      gridTemplateColumns: '1fr 1px 1fr',
      gap: '0',
      alignItems: 'center',
      margin: '0 auto',
    }}
  >
    {/* 左侧：能力概览 */}
    <div style={{ paddingRight: 'clamp(32px, 4vw, 60px)' }}>
      <SkillsOverviewPanel 
        skillsOverview={skillsOverview}
        colors={colors}
        isDark={isDark}
      />
    </div>

    {/* 中间分隔线 */}
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: '100%' }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{
        width: '1px',
        background: isDark ? colors.border : '#222',
        alignSelf: 'stretch',
      }}
    />

    {/* 右侧：职业历程时间线 */}
    <div style={{ 
      paddingLeft: 'clamp(32px, 4vw, 60px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 标题 - 增大字号 + 白色突出 */}
      <h2 style={{ 
        fontSize: '0.9rem', 
        textTransform: 'uppercase', 
        letterSpacing: '3px', 
        color: isDark ? '#fff' : colors.text, 
        fontWeight: '600',
        marginBottom: '24px',
      }}>
        {t('about.journeyTitle')}
      </h2>

      {/* 时间轴内容 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {journey.map((item, index) => (
          <JourneyRow 
            key={`journey-${index}`}
            item={item}
            index={index}
            colors={colors}
            typeLabels={typeLabels}
            typeColors={typeColors}
            isDark={isDark}
            isFirst={index === 0}
            isLast={index === journey.length - 1}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

/**
 * 能力概览面板组件
 * 黑色细线分区 + 打字机效果 + 悬停交互
 */
const SkillsOverviewPanel = ({ skillsOverview, colors, isDark }) => {
  const [expandedModule, setExpandedModule] = React.useState(null);

  return (
    <div>
      {/* 标题 - 增大字号 + 白色突出 */}
      <h2 style={{ 
        fontSize: '0.9rem', 
        textTransform: 'uppercase', 
        letterSpacing: '3px', 
        color: isDark ? '#fff' : colors.text, 
        fontWeight: '600',
        marginBottom: '16px',
      }}>
        {skillsOverview.title}
      </h2>

      {/* 介绍文字 - 添加左侧彩色竖线装饰 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          paddingLeft: '16px',
          borderLeft: `3px solid ${isDark ? '#fff' : colors.accent}`,
          marginBottom: '20px',
        }}
      >
        <p style={{
          fontSize: '0.95rem',
          color: isDark ? '#ddd' : colors.textMuted,
          lineHeight: 1.8,
          margin: 0,
          fontStyle: 'italic',
        }}>
          {skillsOverview.intro}
        </p>
      </motion.div>

      {/* 分隔线 */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          height: '1px',
          background: isDark ? colors.border : '#222',
          marginBottom: '16px',
        }}
      />

      {/* 能力模块列表 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {skillsOverview.modules.map((module, index) => (
          <SkillModule
            key={module.key}
            module={module}
            index={index}
            colors={colors}
            isDark={isDark}
            isExpanded={expandedModule === module.key}
            onToggle={() => setExpandedModule(expandedModule === module.key ? null : module.key)}
            deliverableLabel={skillsOverview.deliverableLabel}
          />
        ))}
      </div>

      {/* 技术栈/工具 - 标题 + 标签样式 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        style={{ marginTop: '20px' }}
      >
        {/* 工具标题 */}
        <h3 style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: isDark ? '#fff' : colors.text,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '12px',
        }}>
          {skillsOverview.tools.label}
        </h3>
        
        {/* 工具标签列表 */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px',
        }}>
          {skillsOverview.tools.items.split(' / ').map((tool, index) => (
            <motion.span
              key={tool}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + index * 0.05, duration: 0.3 }}
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: isDark ? '#ccc' : colors.textMuted,
                padding: '4px 10px',
                borderRadius: '4px',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              {tool.trim()}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/**
 * 单个能力模块组件
 * 悬停展开交付物
 */
const SkillModule = ({ module, index, colors, isDark, isExpanded, onToggle, deliverableLabel }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
    onMouseEnter={onToggle}
    onMouseLeave={() => isExpanded && onToggle()}
    style={{
      padding: '12px 0',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      cursor: 'pointer',
    }}
  >
    {/* 模块标题 */}
    <div style={{
      fontSize: '0.95rem',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '4px',
      transition: 'color 0.2s',
    }}>
      {module.title}
    </div>

    {/* 模块描述 */}
    <div style={{
      fontSize: '0.8rem',
      color: colors.textMuted,
      lineHeight: 1.5,
    }}>
      {module.desc}
    </div>

    {/* 交付物（悬停展开） */}
    <motion.div
      initial={false}
      animate={{ 
        height: isExpanded ? 'auto' : 0,
        opacity: isExpanded ? 1 : 0,
        marginTop: isExpanded ? 8 : 0,
      }}
      transition={{ duration: 0.2 }}
      style={{ overflow: 'hidden' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        paddingLeft: '12px',
        borderLeft: `2px solid ${colors.accent}`,
      }}>
        <span style={{
          fontSize: '0.65rem',
          color: colors.textLight,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {deliverableLabel}:
        </span>
        <span style={{
          fontSize: '0.75rem',
          color: colors.text,
        }}>
          {module.deliverables}
        </span>
      </div>
    </motion.div>
  </motion.div>
);

/**
 * 职业历程单行组件 - 使用 grid 布局确保精确对齐
 * 时间轴线在每个 row 中绘制，确保穿过圆点中心
 */
const JourneyRow = ({ item, index, colors, typeLabels, typeColors, isFirst, isLast }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
    style={{ 
      display: 'grid',
      gridTemplateColumns: '100px 20px 1fr',
      gap: '12px',
      alignItems: 'start',
      position: 'relative',
    }}
  >
    {/* 左侧：时间区域 */}
    <div style={{ 
      textAlign: 'right',
      paddingTop: '1px',
    }}>
      <div style={{
        fontSize: '0.82rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: '500',
        color: colors.text,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}>
        {item.period}
      </div>
    </div>

    {/* 中间：时间轴圆点 + 连接线 */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      height: '100%',
    }}>
      {/* 上半段连接线 */}
      {!isFirst && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '6px',
          background: colors.border,
        }} />
      )}
      
      {/* 圆点 */}
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: typeColors[item.type],
        border: `2px solid ${colors.bg}`,
        boxShadow: `0 0 0 2px ${typeColors[item.type]}50`,
        flexShrink: 0,
        marginTop: '4px',
        zIndex: 2,
        position: 'relative',
      }} />
      
      {/* 下半段连接线 */}
      {!isLast && (
        <div style={{
          flex: 1,
          width: '1px',
          background: colors.border,
          marginTop: '4px',
          minHeight: '40px',
        }} />
      )}
    </div>

    {/* 右侧：内容区域 */}
    <div style={{ minWidth: 0 }}>
      {/* 标题行：标签 + 标题在同一行 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '2px',
      }}>
        {/* 类型标签 - 深色模式黑白，浅色模式彩色 */}
        <span style={{
          fontSize: '0.58rem',
          fontWeight: '700',
          color: typeColors[item.type],
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          padding: '2px 7px',
          borderRadius: '3px',
          background: `${typeColors[item.type]}15`,
          border: `1px solid ${typeColors[item.type]}40`,
          flexShrink: 0,
        }}>
          {typeLabels[item.type]}
        </span>
        
        {/* 标题 */}
        <HoverUnderlineTitle 
          text={item.title} 
          colors={colors} 
        />
      </div>
      
      {/* 副标题 */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: colors.textMuted,
        marginTop: '2px',
      }}>
        {item.subtitle}
      </div>
    </div>
  </motion.div>
);

/**
 * 悬停下划线标题组件
 */
const HoverUnderlineTitle = ({ text, colors }) => (
  <div 
    style={{ 
      fontSize: '1.1rem', 
      fontWeight: '500', 
      color: colors.text, 
      marginBottom: '4px',
      display: 'inline-block',
      position: 'relative',
    }}
    onMouseEnter={(e) => {
      const underline = e.currentTarget.querySelector('.hover-underline');
      if (underline) underline.style.width = '100%';
    }}
    onMouseLeave={(e) => {
      const underline = e.currentTarget.querySelector('.hover-underline');
      if (underline) underline.style.width = '0%';
    }}
  >
    {text}
    <span 
      className="hover-underline"
      style={{
        position: 'absolute',
        bottom: '-2px',
        left: 0,
        width: '0%',
        height: '1px',
        background: colors.text,
        transition: 'width 0.3s ease',
      }}
    />
  </div>
);

/**
 * Contact Section 组件
 * 重构版：简洁透明风格，左右高度均衡
 */
const ContactSection = ({ t, colors, isDark, formStatus, handleSubmit, setFormStatus, setWechatModalOpen }) => (
  <motion.div 
    key="contact" 
    variants={contentVariants} 
    initial="hidden" 
    animate="visible" 
    exit="exit" 
    style={{ 
      width: '100%', 
      maxWidth: '960px', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '80px', 
      alignItems: 'center',
    }}
  >
    {/* 左侧：标题和联系方式 */}
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h2 style={{ 
        fontFamily: 'var(--font-serif)', 
        fontSize: 'clamp(2rem, 4vw, 3rem)', 
        fontWeight: '400', 
        marginBottom: '20px', 
        color: colors.text,
        lineHeight: 1.2,
      }}>
        {t('about.letsTalk')}
      </h2>
      <p style={{ 
        fontSize: '0.95rem', 
        color: colors.textMuted, 
        lineHeight: 1.8, 
        marginBottom: '40px' 
      }}>
        {t('about.contactIntro')}<br/>{t('about.contactIntro2')}
      </p>
      
      {/* 简洁的联系方式列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 邮箱 */}
        <ContactRow 
          href="mailto:tian_yangmin@163.com"
          icon={<EmailIcon color={colors.text} />}
          label={t('about.emailLabel')}
          value="tian_yangmin@163.com"
          colors={colors}
          isDark={isDark}
        />
        
        {/* 微信 */}
        <ContactRow 
          onClick={() => setWechatModalOpen(true)}
          icon={<WechatIcon color={isDark ? '#07C160' : '#07C160'} />}
          label={t('about.wechatLabel')}
          value={t('home.wechatContact')}
          colors={colors}
          isDark={isDark}
          isButton
        />
      </div>
    </div>
    
    {/* 右侧：表单（无卡片背景） */}
    <ContactForm 
      t={t}
      colors={colors}
      isDark={isDark}
      formStatus={formStatus}
      handleSubmit={handleSubmit}
      setFormStatus={setFormStatus}
    />
  </motion.div>
);

/**
 * 简洁联系方式行组件
 * 无卡片背景，图标+文字，明显的悬停效果
 */
const ContactRow = ({ href, onClick, icon, label, value, colors, isButton, isDark }) => {
  const Component = isButton ? motion.button : motion.a;
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Component 
      href={!isButton ? href : undefined}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '14px',
        padding: '10px 14px',
        marginLeft: '-14px',
        background: isHovered ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent',
        borderRadius: '8px',
        border: 'none',
        textDecoration: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.2s',
      }}
    >
      {/* 图标 */}
      <div style={{ 
        width: '28px', 
        height: '28px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexShrink: 0,
        transition: 'transform 0.2s',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        {icon}
      </div>
      
      {/* 文字 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ 
          fontSize: '0.7rem', 
          color: colors.textLight, 
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {label}
        </span>
        <span style={{ 
          fontSize: '0.9rem', 
          color: isHovered ? colors.accent : colors.text, 
          fontWeight: '500',
          transition: 'color 0.2s',
          textDecoration: isHovered ? 'underline' : 'none',
          textUnderlineOffset: '3px',
        }}>
          {value}
        </span>
      </div>
      
      {/* 箭头指示 */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
        transition={{ duration: 0.2 }}
        style={{ 
          marginLeft: 'auto',
          color: colors.accent,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </motion.div>
    </Component>
  );
};

/**
 * 联系表单组件
 * 重构版：结构化表单 + 下拉选择框
 */
const ContactForm = ({ t, colors, isDark, formStatus, handleSubmit, setFormStatus }) => (
  <div>
    {formStatus === 'success' ? (
      <SuccessMessage t={t} colors={colors} isDark={isDark} setFormStatus={setFormStatus} />
    ) : (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 基本信息行 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormInput 
              type="text" 
              name="name" 
              placeholder={t('about.formNamePlaceholder')} 
              colors={colors}
              isDark={isDark}
            />
            <FormInput 
              type="email" 
              name="email" 
              placeholder={t('about.formEmailPlaceholder')} 
              colors={colors}
              isDark={isDark}
            />
          </div>
          
          {/* 结构化选项行 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormSelect
              name="consultType"
              placeholder={t('about.formConsultType')}
              options={[
                { value: 'brand', label: t('about.formConsultTypeOptions.brand') },
                { value: 'packaging', label: t('about.formConsultTypeOptions.packaging') },
                { value: 'ecommerce', label: t('about.formConsultTypeOptions.ecommerce') },
                { value: 'other', label: t('about.formConsultTypeOptions.other') },
              ]}
              colors={colors}
              isDark={isDark}
            />
            <FormSelect
              name="projectStage"
              placeholder={t('about.formProjectStage')}
              options={[
                { value: 'concept', label: t('about.formProjectStageOptions.concept') },
                { value: 'plan', label: t('about.formProjectStageOptions.plan') },
                { value: 'progress', label: t('about.formProjectStageOptions.progress') },
              ]}
              colors={colors}
              isDark={isDark}
            />
          </div>
          
          {/* 结构化选项行 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormSelect
              name="budget"
              placeholder={t('about.formBudget')}
              options={[
                { value: 'under5k', label: t('about.formBudgetOptions.under5k') },
                { value: '5to10k', label: t('about.formBudgetOptions.5to10k') },
                { value: '10to30k', label: t('about.formBudgetOptions.10to30k') },
                { value: 'over30k', label: t('about.formBudgetOptions.over30k') },
              ]}
              colors={colors}
              isDark={isDark}
            />
            <FormSelect
              name="timeline"
              placeholder={t('about.formTimeline')}
              options={[
                { value: 'urgent', label: t('about.formTimelineOptions.urgent') },
                { value: 'normal', label: t('about.formTimelineOptions.normal') },
                { value: 'flexible', label: t('about.formTimelineOptions.flexible') },
              ]}
              colors={colors}
              isDark={isDark}
            />
          </div>
          
          {/* 补充说明 */}
          <FormTextarea 
            name="message" 
            placeholder={t('about.formDetailsPlaceholder')} 
            colors={colors}
            isDark={isDark}
          />
          
          {/* 提交按钮 */}
          <motion.button 
            type="submit" 
            disabled={formStatus === 'submitting'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              padding: '13px', 
              background: colors.accent, 
              color: isDark ? '#000' : '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '0.9rem', 
              fontWeight: '600', 
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            {formStatus === 'submitting' ? t('about.submitting') : t('about.submit')}
          </motion.button>
        </div>
      </form>
    )}
  </div>
);

/**
 * 表单下拉选择框组件
 * 自定义样式，更好的视觉效果
 */
const FormSelect = ({ name, placeholder, options, colors, isDark }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');
  const selectRef = React.useRef(null);

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || '';

  // 点击外部关闭
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} style={{ position: 'relative' }}>
      {/* 隐藏的原生 select 用于表单提交 */}
      <input type="hidden" name={name} value={selectedValue} required />
      
      {/* 自定义选择框按钮 */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.99 }}
        style={{
          width: '100%',
          padding: '12px 14px',
          paddingRight: '36px',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: selectedValue ? colors.text : colors.textMuted,
          textAlign: 'left',
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'border-color 0.2s, background 0.2s',
          position: 'relative',
        }}
      >
        {selectedLabel || placeholder}
        
        {/* 下拉箭头 */}
        <motion.svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={isDark ? '#fff' : '#000'}
          strokeWidth="2"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            marginTop: '-6px',
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </motion.svg>
      </motion.button>
      
      {/* 下拉选项列表 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              background: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '8px',
              boxShadow: isDark 
                ? '0 8px 32px rgba(0,0,0,0.4)' 
                : '0 8px 32px rgba(0,0,0,0.1)',
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            {options.map((opt, index) => (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSelectedValue(opt.value);
                  setIsOpen(false);
                }}
                whileHover={{ 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: selectedValue === opt.value 
                    ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)')
                    : 'transparent',
                  border: 'none',
                  borderBottom: index < options.length - 1 
                    ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`
                    : 'none',
                  fontSize: '0.88rem',
                  color: selectedValue === opt.value ? colors.accent : colors.text,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {opt.label}
                {selectedValue === opt.value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 表单输入框组件
 * 重构版：透明背景 + 边框
 */
const FormInput = ({ type, name, placeholder, colors, isDark }) => (
  <input 
    type={type} 
    name={name} 
    required 
    placeholder={placeholder} 
    style={{ 
      width: '100%', 
      padding: '12px 14px', 
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', 
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, 
      borderRadius: '8px', 
      fontSize: '0.9rem', 
      color: colors.text, 
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      transition: 'border-color 0.2s, background 0.2s',
      outline: 'none',
    }} 
    onFocus={(e) => {
      e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
      e.target.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
      e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)';
    }}
  />
);

/**
 * 表单文本域组件
 * 重构版：透明背景 + 边框
 */
const FormTextarea = ({ name, placeholder, colors, isDark }) => (
  <textarea 
    name={name} 
    rows="4" 
    placeholder={placeholder} 
    style={{ 
      width: '100%', 
      padding: '12px 14px', 
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', 
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, 
      borderRadius: '8px', 
      fontSize: '0.9rem', 
      color: colors.text, 
      resize: 'none', 
      fontFamily: 'inherit', 
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      transition: 'border-color 0.2s, background 0.2s',
      outline: 'none',
    }} 
    onFocus={(e) => {
      e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
      e.target.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
      e.target.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)';
    }}
  />
);

/**
 * 成功消息组件
 */
const SuccessMessage = ({ t, colors, isDark, setFormStatus }) => (
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
);

// 图标组件
const EmailIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 6L12 13 2 6"/>
  </svg>
);

const WechatIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
  </svg>
);

export default DesktopAbout;
