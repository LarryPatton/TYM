import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * ProductEndHint - 产品末尾提示组件
 * 显示"查看更多"标题 + 各产品独立按钮
 * 性能优化版本
 */
const ProductEndHint = memo(({ 
  currentProduct, 
  availableProducts = [],
  productImages = {},
  onSwitchProduct 
}) => {
  const { t } = useTranslation();
  
  if (availableProducts.length <= 0) {
    return null;
  }

  return (
    <div
      style={{
        height: '150vh',
        position: 'relative',
        background: '#0a0a0a',
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 5%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 标题 - 简化动画 */}
          <div
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.4)',
              fontWeight: '500',
              marginBottom: '4rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}
          >
            {t('case.productEndHint.switchPrompt', 'Explore More Products')}
          </div>
          
          {/* 3列网格布局 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            {availableProducts.map((product, index) => (
              <ProductCard
                key={product}
                product={product}
                isActive={product === currentProduct}
                imageSrc={productImages[product]}
                onClick={onSwitchProduct}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * ProductCard - 独立的产品卡片组件，使用 memo 优化
 */
const ProductCard = memo(({ product, isActive, imageSrc, onClick, t }) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(product);
    }
  }, [onClick, product]);

  return (
    <motion.div
      onClick={handleClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      whileHover={{ y: -10 }}
      transition={{ type: 'tween', duration: 0.2 }}
    >
      {/* 图片卡片 */}
      <div style={{
        width: '100%',
        aspectRatio: '3/4',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '1.5rem',
        border: isActive 
          ? '1px solid rgba(255, 87, 34, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'border-color 0.2s ease'
      }}>
        {/* 当前浏览 标签 */}
        {isActive && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: '#FF5722',
            color: '#fff',
            fontSize: '0.75rem',
            padding: '4px 12px',
            borderRadius: '20px',
            zIndex: 10,
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            {t('case.productEndHint.current', 'Current')}
          </div>
        )}

        {/* 图片 - 使用 CSS 硬件加速 */}
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={product}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '10%',
              boxSizing: 'border-box',
              opacity: isActive ? 1 : 0.7,
              transform: 'translateZ(0)', // 启用 GPU 加速
              willChange: 'opacity',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#222' }} />
        )}
        
        {/* 简化的底部渐变 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* 产品名称 */}
      <h3 style={{
        fontSize: '1.5rem',
        color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
        margin: '0 0 0.5rem 0',
        fontWeight: 500
      }}>
        {t(`case.products.${product}`)}
      </h3>

      {/* 按钮 */}
      <div style={{
        fontSize: '0.9rem',
        color: isActive ? '#FF5722' : 'rgba(255, 255, 255, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        {isActive ? t('case.productEndHint.currentlyViewing', 'Currently Viewing') : t('case.productEndHint.viewProduct', 'View Product')}
        {!isActive && <span>→</span>}
      </div>
    </motion.div>
  );
});

ProductEndHint.displayName = 'ProductEndHint';
ProductCard.displayName = 'ProductCard';

export default ProductEndHint;