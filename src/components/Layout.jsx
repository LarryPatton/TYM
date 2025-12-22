import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import BackToTop from './BackToTop';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../hooks/useTheme';

// 主题切换按钮组件
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  
  return (
    <motion.button
      onClick={toggleTheme}
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
        fontSize: '1.1em',
        color: 'var(--color-text-main)',
        transition: 'all 0.3s ease',
      }}
      title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {/* 暗色模式显示太阳（切换到亮色），亮色模式显示月亮（切换到暗色） */}
      {theme === 'dark' ? '☀️' : '🌙'}
    </motion.button>
  );
};

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // 判断是否是需要全屏显示的页面
  // 将所有主要页面都视为全屏页面，由页面内部控制 padding 和宽度
  const isFullWidthPage = true; 
  
  // 移除 hideFooter 逻辑，让所有页面都显示 Footer
  const hideFooter = false;
  
  const isActive = (path) => {
    return location.pathname === path ? 'var(--color-text-main)' : 'var(--color-text-muted)';
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 - Sticky Header */}
      <nav style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        background: 'var(--color-bg)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 40px',
        height: '80px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        transition: 'background-color var(--transition-theme), border-color var(--transition-theme)',
      }}>
        {/* 左侧 Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontWeight: '900', fontSize: '1.5em', letterSpacing: '-1px' }}>PORTFOLIO.</div>
        </Link>
          
        {/* 中间导航链接 */}
        <div style={{ display: 'flex', gap: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: isActive('/'), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}>{t('nav.home')}</Link>
          <Link to="/work" style={{ textDecoration: 'none', color: isActive('/work'), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}>{t('nav.work')}</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: isActive('/about'), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}>{t('nav.about')}</Link>
        </div>

        {/* 右侧：语言切换 + 主题切换 + CTA 按钮 */}
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
      </nav>

      {/* 页面内容容器 - 首页全屏，其他页面限制宽度 */}
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

      {/* Footer - 在单屏页面隐藏 */}
      {!hideFooter && (
        <footer style={{ 
          borderTop: '1px solid var(--color-border)', 
          marginTop: 'auto', 
          padding: '60px 0', 
          textAlign: 'center', 
          color: 'var(--color-text-muted)', 
          fontSize: '0.9em', 
          background: 'var(--color-bg-subtle)',
          transition: 'background-color var(--transition-theme), border-color var(--transition-theme)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <a href="mailto:hello@example.com" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>{t('footer.email')}</a>
            <span style={{ color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: '500' }}>{t('footer.wechat')}</span>
            <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>{t('footer.resume')}</a>
            <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>LinkedIn</a>
            <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Twitter</a>
          </div>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: 'var(--color-text-main)' }}>PORTFOLIO.</div>
          <div>{t('footer.copyright', { year: new Date().getFullYear() })}</div>
        </footer>
      )}
    </div>
  );
};

export default Layout;