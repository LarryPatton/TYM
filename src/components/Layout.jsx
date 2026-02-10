import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import BackToTop from './BackToTop';
import LanguageSwitcher from './LanguageSwitcher';
import WechatModal from './WechatModal';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';

// 主题切换按钮组件
const ThemeToggle = ({ size = 16, compact = false, showBorder = true }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  
  // 简洁的 SVG 图标
  const SunIcon = () => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
  
  const MoonIcon = () => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleTheme(event);
  };

  // 紧凑模式用于移动端抽屉，默认用于桌面端导航栏
  const buttonSize = compact ? '34px' : '34px';
  
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: buttonSize,
        height: buttonSize,
        minWidth: buttonSize,
        minHeight: buttonSize,
        borderRadius: '50%',
        border: showBorder ? '1px solid var(--color-border)' : 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-main)',
        transition: 'all 0.3s ease',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
      title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </motion.button>
  );
};

// 汉堡菜单按钮组件 (带页面名)
const HamburgerButton = ({ isOpen, onClick, currentPageName }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: '40px',
      padding: '0 12px 0 16px',
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--color-border)',
      background: 'var(--color-bg)',
      cursor: 'pointer',
      position: 'relative',
      zIndex: 1001,
    }}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
  >
    {/* 页面名 */}
    <span style={{
      fontSize: '0.9rem',
      fontWeight: '500',
      color: 'var(--color-text-main)',
      whiteSpace: 'nowrap',
    }}>
      {currentPageName}
    </span>
    
    {/* 分隔线 */}
    <span style={{
      width: '1px',
      height: '16px',
      background: 'var(--color-border)',
    }} />
    
    {/* 汉堡图标 */}
    <div style={{ width: '18px', height: '14px', position: 'relative' }}>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
          background: 'var(--color-text-main)', borderRadius: '1px', transformOrigin: 'center',
        }}
      />
      <motion.span
        animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px',
          background: 'var(--color-text-main)', borderRadius: '1px', transform: 'translateY(-50%)',
        }}
      />
      <motion.span
        animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px',
          background: 'var(--color-text-main)', borderRadius: '1px', transformOrigin: 'center',
        }}
      />
    </div>
  </motion.button>
);

// 移动端抽屉导航组件
const MobileDrawer = ({ isOpen, onClose, navLinks, isActive, t, currentPath }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)', 
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9998,
            }}
          />
          {/* 抽屉面板 */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            style={{
              position: 'fixed', 
              top: 0, 
              right: 0, 
              bottom: 0, 
              width: '160px',
              background: 'var(--color-bg)', 
              zIndex: 9999, 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.1)',
              borderLeft: '1px solid var(--color-border)',
            }}
          >
            {/* 顶部留白 */}
            <div style={{ height: 'var(--nav-height)', flexShrink: 0 }} />
            
            {/* 导航链接区域 - 方案D: 品牌风格 */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 12px',
              gap: '8px',
            }}>
              {navLinks.map((link, index) => {
                // 使用 startsWith 匹配子路径，但首页需要精确匹配
                const isCurrentActive = link.path === '/' 
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path);
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '12px 16px', 
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        letterSpacing: '-0.02em',
                        color: isActive(link.path), 
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                    >
                      {link.label}
                      {/* 底部装饰点 - 当前页面显示 */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: isCurrentActive ? 1 : 0 }}
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                          marginTop: '6px',
                        }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* 底部操作区域 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-bg-subtle)',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px',
              }}
            >
              {/* 语言和主题切换 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <LanguageSwitcher variant="compact" />
                <ThemeToggle size={14} compact />
              </div>
              {/* 联系按钮 */}
              <Link to="/about" state={{ scrollTo: 'contact' }} onClick={onClose} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}>
                  {t('nav.contact')}
                </button>
              </Link>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wechatModalOpen, setWechatModalOpen] = useState(false); // 页脚微信弹窗状态
  const [isInHeroArea, setIsInHeroArea] = useState(true); // 是否在 Hero 区域
  const [isInContactArea, setIsInContactArea] = useState(false); // 是否在 Contact 区域
  const [logoTopIndex, setLogoTopIndex] = useState(0); // Logo 顶层图片索引（0 或 1）
  const [logoRotation, setLogoRotation] = useState(0); // 底层 Logo 旋转角度（持续累加）
  
  // Logo 顶层图片交替动画 + 底层图片逆时针旋转（两种主题都启用）
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoTopIndex(prev => (prev === 0 ? 1 : 0));
      setLogoRotation(prev => prev - 90); // 每次逆时针旋转 90 度
    }, 3000); // 每 3 秒切换一次
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isFullWidthPage = true; 
  // 首页移动端、work/gallery 页面隐藏 footer
  const hideFooter = (location.pathname === '/' && isMobile) || location.pathname === '/work' || location.pathname === '/gallery';
  const hideHeader = location.pathname.includes('/work/the-case/');
  
  // 判断是否在首页
  const isHomePage = location.pathname === '/';
  // 判断是否在 About 页面
  const isAboutPage = location.pathname === '/about';
  // 判断是否在 Gallery List 页面
  const isGalleryListPage = location.pathname === '/gallery/list';
  // 判断是否在 Case Index 页面
  const isCasePage = location.pathname === '/work/the-case';
  // 判断是否在 Gallery 模块子页面 (form-structure, material-texture, narrative-imagery)
  const isGalleryModulePage = location.pathname.startsWith('/gallery/') && 
    location.pathname !== '/gallery/list' &&
    !location.pathname.startsWith('/gallery/list/');
  
  // 监听滚动，判断是否在 Hero 区域或 Contact 区域
  useEffect(() => {
    // About 页面不需要监听滚动，始终透明
    if (isAboutPage) {
      setIsInHeroArea(false);
      setIsInContactArea(false);
      return;
    }
    
    if (!isHomePage) {
      setIsInHeroArea(false);
      setIsInContactArea(false);
      return;
    }
    
    const handleScroll = () => {
      // Hero 区域大约是一个视口高度
      const heroHeight = window.innerHeight - 80; // 减去导航栏高度
      setIsInHeroArea(window.scrollY < heroHeight * 0.8); // 滚动超过 80% Hero 高度后切换
      
      // 检测是否在 contact-cta 区域
      const contactSection = document.getElementById('contact-cta');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        // 当 contact 区域顶部进入视口顶部（考虑导航栏高度）时，视为进入 contact 区域
        const navHeight = 80;
        const isInContact = rect.top <= navHeight && rect.bottom > navHeight;
        setIsInContactArea(isInContact);
      } else {
        setIsInContactArea(false);
      }
    };
    
    handleScroll(); // 初始检测
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, isAboutPage]);
  
  // 导航栏是否透明
  // - 首页 Hero 区域或 Contact 区域（亮色模式）
  // - About 页面（亮色模式）
  // - Gallery List 页面（亮色模式）
  // - Case Index 页面（亮色模式）
  // - Gallery 模块子页面（亮色模式）
  const isNavTransparent = theme === 'light' && (
    (isHomePage && (isInHeroArea || isInContactArea)) || 
    isAboutPage ||
    isGalleryListPage ||
    isCasePage ||
    isGalleryModulePage
  );
  
  const isActive = (path) => {
    return location.pathname === path ? 'var(--color-text-main)' : 'var(--color-text-muted)';
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/work', label: t('nav.work') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/about', label: t('nav.about') },
  ];

  // 获取当前页面名称
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/') return t('nav.home');
    if (path.startsWith('/work')) return t('nav.work');
    if (path.startsWith('/gallery')) return t('nav.gallery');
    if (path.startsWith('/about')) return t('nav.about');
    return t('nav.home');
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 - Sticky Header */}
      {!hideHeader && (
        <nav style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          // 首页 Hero 区域透明，其他情况有背景色
          background: isNavTransparent ? 'transparent' : 'var(--color-bg)', 
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          // 首页 Hero 区域用黑色细线，其他情况用默认边框色
          borderBottom: isNavTransparent ? '1px solid var(--color-text-main)' : '1px solid var(--color-border)',
          padding: isMobile ? '0 var(--space-md)' : '0 40px',
          height: 'var(--nav-height)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}>
          {/* 左侧 Logo */}
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', height: '40px' }}>
            {theme === 'dark' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', height: '100%' }}>
                {/* Logo 双层叠加容器 */}
                <div style={{ 
                  position: 'relative',
                  height: isMobile ? '26px' : '32px',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {/* 底层图片 - 逆时针持续旋转动画 */}
                  <motion.img 
                    src="/images/logo/logo_black_bottom.png" 
                    alt="Portfolio Logo" 
                    animate={{ 
                      rotate: logoRotation,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ 
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }} 
                  />
                  {/* 顶层图片1 - 交替显示 */}
                  <motion.img 
                    src="/images/logo/logo_black_top.png" 
                    alt="" 
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                      opacity: logoTopIndex === 0 ? 1 : 0,
                      scale: logoTopIndex === 0 ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                    }} 
                  />
                  {/* 顶层图片2 - 交替显示 */}
                  <motion.img 
                    src="/images/logo/logo_black_top2.png" 
                    alt="" 
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ 
                      opacity: logoTopIndex === 1 ? 1 : 0,
                      scale: logoTopIndex === 1 ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                    }} 
                  />
                </div>
                <span style={{ 
                  fontFamily: "'Afacad', sans-serif",
                  fontWeight: '600',
                  fontSize: isMobile ? '1.4em' : '1.75em',
                  letterSpacing: '0.02em',
                  color: 'var(--color-text-main)',
                  lineHeight: 1,
                }}>
                  LUMI TIAN
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', height: '100%' }}>
                {/* Logo 双层叠加容器 - 白色模式 */}
                <div style={{ 
                  position: 'relative',
                  height: isMobile ? '26px' : '32px',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {/* 底层图片 - 逆时针持续旋转动画 */}
                  <motion.img 
                    src="/images/logo/logo_white_bottom.png" 
                    alt="Portfolio Logo" 
                    animate={{ 
                      rotate: logoRotation,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ 
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }} 
                  />
                  {/* 顶层图片1 - 交替显示 */}
                  <motion.img 
                    src="/images/logo/logo_white_top.png" 
                    alt="" 
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                      opacity: logoTopIndex === 0 ? 1 : 0,
                      scale: logoTopIndex === 0 ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                    }} 
                  />
                  {/* 顶层图片2 - 交替显示 */}
                  <motion.img 
                    src="/images/logo/logo_white_top2.png" 
                    alt="" 
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ 
                      opacity: logoTopIndex === 1 ? 1 : 0,
                      scale: logoTopIndex === 1 ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%', 
                      width: 'auto',
                      objectFit: 'contain',
                    }} 
                  />
                </div>
                <span style={{ 
                  fontFamily: "'Afacad', sans-serif",
                  fontWeight: '600',
                  fontSize: isMobile ? '1.4em' : '1.75em',
                  letterSpacing: '0.02em',
                  color: 'var(--color-text-main)',
                  lineHeight: 1,
                }}>
                  LUMI TIAN
                </span>
              </div>
            )}
          </Link>
            
          {/* 桌面端：中间导航链接 */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '40px' }}>
              {navLinks.map(link => {
                // 使用 startsWith 匹配子路径，但首页需要精确匹配
                const isCurrentActive = link.path === '/' 
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    style={{ 
                      textDecoration: 'none', 
                      color: isCurrentActive ? 'var(--color-text-main)' : 'var(--color-text-muted)', 
                      fontWeight: '500', 
                      fontSize: '1em', 
                      transition: 'color 0.2s',
                      position: 'relative',
                      display: 'inline-block',
                      paddingBottom: '4px',
                    }}
                    className={`nav-link-underline ${isCurrentActive ? 'nav-link-active' : ''}`}
                  >
                    {link.label}
                    {/* 下划线 */}
                    <span className="nav-underline" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* 右侧操作区域 */}
          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '40px' }}>
              {/* 透明导航栏时，按钮使用黑色边框 */}
              <div style={{ 
                height: '36px',
                borderRadius: 'var(--radius-full)',
                border: isNavTransparent ? '1px solid var(--color-text-main)' : '1px solid var(--color-border)',
                transition: 'border-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
              }}>
                <LanguageSwitcher variant="toggle" />
              </div>
              <div style={{ 
                height: '36px',
                width: '36px',
                borderRadius: '50%',
                border: isNavTransparent ? '1px solid var(--color-text-main)' : '1px solid var(--color-border)',
                transition: 'border-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ThemeToggle showBorder={false} />
              </div>
              <Link to="/about" state={{ scrollTo: 'contact' }} style={{ textDecoration: 'none', height: '36px', display: 'flex', alignItems: 'center' }}>
                <button style={{
                  height: '36px',
                  padding: '0 20px',
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '500',
                  fontSize: '0.88em',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background-color var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {t('nav.contact')}
                </button>
              </Link>
            </div>
          ) : (
            <HamburgerButton 
              isOpen={mobileMenuOpen} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              currentPageName={getCurrentPageName()}
            />
          )}
        </nav>
      )}

      {/* 移动端抽屉导航 */}
      <MobileDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        isActive={isActive}
        t={t}
        currentPath={location.pathname}
      />

      {/* 页面内容容器 */}
      <main style={{ 
        maxWidth: isFullWidthPage ? 'none' : '1400px', 
        margin: '0 auto', 
        padding: isFullWidthPage ? '0' : '40px', 
        width: '100%', 
        boxSizing: 'border-box', 
        flex: 1 
      }}>
        <Outlet />
      </main>

      {/* 回到顶部按钮 */}
      <BackToTop />

      {/* Footer - 极简两行分离式 */}
      {!hideFooter && (
        <footer style={{ 
          borderTop: '1px solid var(--color-border)', 
          marginTop: 'auto', 
          padding: isMobile ? '32px var(--space-md)' : '48px 0', 
          textAlign: 'center', 
          color: 'var(--color-text-muted)', 
          fontSize: '0.9em', 
          background: 'var(--color-bg-subtle)',
          transition: 'background-color var(--transition-theme), border-color var(--transition-theme)',
          position: 'relative',
          zIndex: 10,
        }}>
          {/* 第一行：身份信息 */}
          <div style={{ 
            marginBottom: '16px',
            fontWeight: '600',
            fontSize: '1.1em',
            color: 'var(--color-text-main)',
            letterSpacing: '0.02em',
          }}>
            田阳敏 · 品牌设计师
          </div>
          
          {/* 第二行：联系方式链接 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: isMobile ? '8px' : '12px', 
            marginBottom: '20px', 
            flexWrap: 'wrap',
            fontSize: '0.95em',
          }}>
            <a 
              href="mailto:tian_yangmin@163.com" 
              style={{ 
                color: 'var(--color-text-secondary)', 
                textDecoration: 'none', 
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-text-main)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              邮箱
            </a>
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <span 
              onClick={() => setWechatModalOpen(true)}
              style={{ 
                color: 'var(--color-text-secondary)', 
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-text-main)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              微信
            </span>
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: 'var(--color-text-secondary)', 
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-text-main)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              简历 PDF（2026-02）
            </a>
          </div>
          
          {/* 第三行：版权信息 */}
          <div style={{ 
            fontSize: '0.85em',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            © 2026 Lumi Tian. All rights reserved.
          </div>
        </footer>
      )}
      
      {/* 页脚微信二维码弹窗 */}
      <WechatModal 
        isOpen={wechatModalOpen} 
        onClose={() => setWechatModalOpen(false)} 
      />
    </div>
  );
};

export default Layout;
