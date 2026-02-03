import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * ProductEndHint - 产品末尾提示组件
 * 在每个产品的最后一屏后显示，引导用户切换查看其他产品
 */
const ProductEndHint = ({ currentProduct, availableProducts = [] }) => {
  const { t } = useTranslation();
  
  // 计算还有多少个其他产品可以查看
  const otherProductsCount = availableProducts.length - 1;
  
  if (otherProductsCount <= 0) {
    return null; // 如果没有其他产品，不显示提示
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
        textAlign: 'center'
      }}
    >
      {/* 装饰性分隔线 */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          width: '80px',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.3)',
          marginBottom: '32px'
        }}
      />
      
      {/* 提示文字 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: '400',
          marginBottom: '16px',
          letterSpacing: '0.02em'
        }}
      >
        {t('case.productEndHint.currentProductEnd', `${t(`case.products.${currentProduct}`)} 展示已结束`)}
      </motion.div>
      
      {/* 主提示文字 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          fontSize: '1.5rem',
          color: '#fff',
          fontWeight: '500',
          marginBottom: '8px',
          letterSpacing: '0.01em'
        }}
      >
        {t('case.productEndHint.switchPrompt', '查看更多产品')}
      </motion.div>
      
      {/* 副标题 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '400',
          marginBottom: '40px'
        }}
      >
        {t('case.productEndHint.instruction', '使用右上角的产品标签切换')}
      </motion.div>
      
      {/* 箭头指示 */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.6, 
          delay: 0.7,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 0.5
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.85rem',
          fontWeight: '500',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        <span>↗</span>
        <span>{t('case.productEndHint.arrowText', `还有 ${otherProductsCount} 个产品`)}</span>
      </motion.div>
    </motion.div>
  );
};

export default ProductEndHint;
