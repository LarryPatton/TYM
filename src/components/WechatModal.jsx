import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

/**
 * 微信二维码弹窗组件
 */
const WechatModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 微信号（可复制）
  const wechatId = 'LUMI_TIAN';
  
  // 二维码图片路径
  const qrCodeImage = '/covers/shared/code.jpg';

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // 复制微信号
  const copyWechatId = async () => {
    try {
      await navigator.clipboard.writeText(wechatId);
      // 可以添加 toast 提示
      alert(t('contact.wechat.copied') || '已复制微信号');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '20px',
          }}
        >
          {/* Modal 内容 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isDark ? '#1a1a1a' : '#fff',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: isDark
                ? '0 25px 80px rgba(0, 0, 0, 0.5)'
                : '0 25px 80px rgba(0, 0, 0, 0.15)',
              position: 'relative',
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isDark ? '#333' : '#f0f0f0',
                color: isDark ? '#888' : '#666',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#444' : '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? '#333' : '#f0f0f0';
              }}
            >
              ×
            </button>

            {/* 标题 */}
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: isDark ? '#fff' : '#111',
            }}>
              {t('contact.wechat.title') || '微信联系'}
            </h3>

            <p style={{
              fontSize: '0.95rem',
              color: isDark ? '#888' : '#666',
              marginBottom: '24px',
            }}>
              {t('contact.wechat.desc') || '扫码添加微信，快速沟通'}
            </p>

            {/* 二维码容器 */}
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 24px',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: isDark ? '#222' : '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={qrCodeImage}
                alt="WeChat QR Code"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  // 占位图：显示微信图标
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 12px;
                      color: ${isDark ? '#555' : '#ccc'};
                    ">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.003-.27-.022-.407-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                      </svg>
                      <span style="font-size: 0.8rem;">二维码待添加</span>
                    </div>
                  `;
                }}
              />
            </div>

            {/* 微信号 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px 20px',
              backgroundColor: isDark ? '#222' : '#f5f5f5',
              borderRadius: '12px',
            }}>
              <span style={{
                fontSize: '0.9rem',
                color: isDark ? '#888' : '#666',
              }}>
                {t('contact.wechat.id') || '微信号'}:
              </span>
              <span style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: isDark ? '#fff' : '#111',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {wechatId}
              </span>
              <button
                onClick={copyWechatId}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  backgroundColor: isDark ? '#333' : '#e5e5e5',
                  color: isDark ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#444' : '#ddd';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDark ? '#333' : '#e5e5e5';
                }}
              >
                {t('contact.wechat.copy') || '复制'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WechatModal;
