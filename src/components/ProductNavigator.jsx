import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * ProductNavigator - 产品切换导航栏
 * 固定在页面顶部，展示多个产品标签，支持点击切换
 */
const ProductNavigator = ({ 
  products = [], 
  currentProduct, 
  onProductChange,
  visible = true 
}) => {
  const { t } = useTranslation();

  if (!visible || products.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: visible ? 1 : 0, 
        y: visible ? 0 : -20,
        pointerEvents: visible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}
    >
      {/* 标签：产品 */}
      <div
        style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '500',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginRight: '4px'
        }}
      >
        {t('case.products.label', 'Products')}
      </div>

      {/* 产品标签列表 */}
      {products.map((productId) => {
        const isActive = currentProduct === productId;
        
        return (
          <motion.button
            key={productId}
            onClick={() => onProductChange(productId)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isActive 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: isActive 
                ? '1px solid rgba(255, 255, 255, 0.3)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: isActive ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
              letterSpacing: '0.02em'
            }}
          >
            {t(`case.products.${productId}`, productId)}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ProductNavigator;
