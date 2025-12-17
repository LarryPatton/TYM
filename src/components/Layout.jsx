import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import BackToTop from './BackToTop';

const Layout = () => {
  const location = useLocation();
  
  // 判断是否是需要全屏显示的页面
  const isFullWidthPage = location.pathname === '/';
  
  const isActive = (path) => {
    return location.pathname === path ? '#000' : '#666';
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', color: '#111', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 - Sticky Header */}
      <nav style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '0 40px',
        height: '80px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* 左侧 Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontWeight: '900', fontSize: '1.5em', letterSpacing: '-1px' }}>PORTFOLIO.</div>
        </Link>
          
        {/* 中间导航链接 */}
        <div style={{ display: 'flex', gap: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: isActive('/'), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}>首页</Link>
          <Link to="/work" style={{ textDecoration: 'none', color: isActive('/work'), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}>作品</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: isActive('/about'), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}>关于</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: isActive('/contact'), fontWeight: '500', fontSize: '1em', transition: 'color 0.2s' }}>联系</Link>
        </div>

        {/* 右侧 CTA 按钮 */}
        <Link to="/contact" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '10px 24px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            fontWeight: '500',
            fontSize: '0.9em',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>
            联系我
          </button>
        </Link>
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

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #eee', marginTop: 'auto', padding: '60px 0', textAlign: 'center', color: '#666', fontSize: '0.9em', background: '#fafafa' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <a href="mailto:hello@example.com" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>邮箱</a>
          <span style={{ color: '#333', cursor: 'pointer', fontWeight: '500' }}>微信</span>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>简历</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>LinkedIn</a>
          <a href="#" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Twitter</a>
        </div>
        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>PORTFOLIO.</div>
        <div>© {new Date().getFullYear()} Your Name. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default Layout;