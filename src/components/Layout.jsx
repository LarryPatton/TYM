import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import BackToTop from './BackToTop';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';

// 主题切换按钮组件
const ThemeToggle = ({ size = 18 }) => {
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
    toggleTheme(event);
  };
  
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid var(--color-border)',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-main)',
        transition: 'all 0.3s ease',
      }}
      title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </motion.button>
  );
};

// 汉堡菜单按钮组件
const HamburgerButton = ({ isOpen, onClick }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    style={{
      width: '44px',
      height: '44px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      position: 'relative',
      zIndex: 1001,
    }}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
  >
    <div style={{ width: '24px', height: '18px', position: 'relative' }}>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
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
        animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
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
const MobileDrawer = ({ isOpen, onClose, navLinks, isActive, t }) => {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)', zIndex: 999,
            }}
          />
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(320px, 85vw)',
              background: 'var(--color-bg)', zIndex: 1000, display: 'flex', flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ height: 'var(--nav-height)', flexShrink: 0 }} />
            <div style={{ flex: 1, padding: 'var(--space-xl) var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={onClose}
                    style={{
                      display: 'block', padding: 'var(--space-md) var(--space-sm)', fontSize: '1.5rem',
                      fontWeight: '600', color: isActive(link.path), textDecoration: 'none',
                      borderBottom: '1px solid var(--color-border)', transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: 'var(--space-xl) var(--space-lg)', borderTop: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', justifyContent: 'space-between' }}>
                <LanguageSwitcher variant="toggle" />
                <ThemeToggle />
              </div>
              <Link to="/about" state={{ scrollTo: 'contact' }} onClick={onClose} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '16px 24px', background: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)', border: 'none', borderRadius: 'var(--radius-full)',
                  fontWeight: '600', fontSize: '1rem', cursor: 'pointer',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isFullWidthPage = true; 
  const hideFooter = false;
  const hideHeader = location.pathname.includes('/work/the-case/');
  
  const isActive = (path) => {
    return location.pathname === path ? 'var(--color-text-main)' : 'var(--color-text-muted)';
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/work', label: t('nav.work') },
    { path: '/about', label: t('nav.about') },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 - Sticky Header */}
      {!hideHeader && (
        <nav style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          background: 'var(--color-bg)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--color-border)',
          padding: isMobile ? '0 var(--space-md)' : '0 40px',
          height: 'var(--nav-height)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          transition: 'background-color var(--transition-theme), border-color var(--transition-theme)',
        }}>
          {/* 左侧 Logo */}
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontWeight: '900', fontSize: isMobile ? '1.2em' : '1.5em', letterSpacing: '-1px' }}>PORTFOLIO.</div>
          </Link>
            
          {/* 桌面端：中间导航链接 */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '40px' }}>
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  style={{ textDecoration: 'none', color: isActive(link.path), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* 右侧操作区域 */}
          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <LanguageSwitcher variant="toggle" />
              <ThemeToggle />
              <Link to="/about" state={{ scrollTo: 'contact' }} style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '10px 24px',
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '500',
                  fontSize: '0.9em',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background-color var(--transition-fast)'
                }}>
                  {t('nav.contact')}
                </button>
              </Link>
            </div>
          ) : (
            <HamburgerButton 
              isOpen={mobileMenuOpen} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
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

      {/* Footer */}
      {!hideFooter && (
        <footer style={{ 
          borderTop: '1px solid var(--color-border)', 
          marginTop: 'auto', 
          padding: isMobile ? '40px var(--space-md)' : '60px 0', 
          textAlign: 'center', 
          color: 'var(--color-text-muted)', 
          fontSize: '0.9em', 
          background: 'var(--color-bg-subtle)',
          transition: 'background-color var(--transition-theme), border-color var(--transition-theme)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: isMobile ? '20px' : '40px', 
            marginBottom: '30px', 
            flexWrap: 'wrap',
            padding: isMobile ? '0 var(--space-sm)' : 0,
          }}>
            <a href="mailto:hello@example.com" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>{t('footer.email')}</a>
            <span style={{ color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: '500' }}>{t('footer.wechat')}</span>
            <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>{t('footer.resume')}</a>
            {!isMobile && (
              <>
                <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>LinkedIn</a>
                <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Twitter</a>
              </>
            )}
          </div>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: 'var(--color-text-main)' }}>PORTFOLIO.</div>
          <div>{t('footer.copyright', { year: new Date().getFullYear() })}</div>
        </footer>
      )}
    </div>
  );
};

export default Layout;