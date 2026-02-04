import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * ProductEndHint - 产品末尾提示组件
 * 显示"查看更多"标题 + 各产品独立按钮
 */
const ProductEndHint = ({ 
  currentProduct, 
  availableProducts = [],
  onSwitchProduct 
}) => {
  const { t } = useTranslation();
  
  const otherProducts = availableProducts.filter(p => p !== currentProduct);
  
  if (otherProducts.length <= 0) {
    return null;
  }

  const handleClick = (product) => {
    if (onSwitchProduct) {
      onSwitchProduct(product);
    }
  };

  return (
    <div
      style={{
        height: '150vh',
        position: 'relative',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.4)',
              fontWeight: '400',
              marginBottom: '40px',
              letterSpacing: '0.1em'
            }}
          >
            {t('case.productEndHint.switchPrompt', '查看更多')}
          </motion.div>
          
          {/* 产品按钮列表 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            {otherProducts.map((product, index) => (
              <motion.button
                key={product}
                onClick={() => handleClick(product)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '24px 56px',
                  minWidth: '280px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    fontSize: '1.5rem',
                    color: '#fff',
                    fontWeight: '500',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {t(`case.products.${product}`)}
                </span>
                <span
                  style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255, 255, 255, 0.35)',
                  }}
                >
                  →
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductEndHint;