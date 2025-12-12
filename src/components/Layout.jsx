import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import SmartBreadcrumbs from './SmartBreadcrumbs';
import BackToTop from './BackToTop';
import GlobalSearch from './GlobalSearch';

const Layout = () => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', color: '#111' }}>
      {/* 顶部导航 - 现代风格 */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
          <div style={{ fontWeight: '900', fontSize: '1.5em', letterSpacing: '-1px' }}>LOGO.</div>
          
          {/* 导航链接 - 居中/左侧跟随 */}
          <div style={{ display: 'flex', gap: '30px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#111', fontWeight: '500', fontSize: '0.95em' }}>首页</Link>
            <Link to="/projects" style={{ textDecoration: 'none', color: '#111', fontWeight: '500', fontSize: '0.95em' }}>项目</Link>
            <Link to="/themes" style={{ textDecoration: 'none', color: '#111', fontWeight: '500', fontSize: '0.95em' }}>主题</Link>
          </div>
        </div>

        {/* 右侧功能区 */}
        <div>
          <GlobalSearch />
        </div>
      </nav>

      {/* 智能面包屑 */}
      <SmartBreadcrumbs />

      {/* 页面内容容器 - 加宽 */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        <Outlet />
      </main>

      {/* 回到顶部按钮 */}
      <BackToTop />

      {/* Footer - 极简 */}
      <footer style={{ borderTop: '1px solid #eee', marginTop: '80px', padding: '60px 0', textAlign: 'center', color: '#999', fontSize: '0.9em' }}>
        <div style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>LOGO.</div>
        © 2023 All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;