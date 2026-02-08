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
  productImages = {}, // 新增：接收图片映射
  onSwitchProduct 
}) => {
  const { t } = useTranslation();
  
  // 显示所有产品，不再过滤
  // const otherProducts = availableProducts.filter(p => p !== currentProduct);
  
  if (availableProducts.length <= 0) {
    return null;
  }

  const handleClick = (product) => {
    // 即使是当前产品也可以点击，或者滚动到顶部？
    // 目前需求是跳转，如果是当前产品，简单的跳转可能就是留在当前页顶部
    if (onSwitchProduct) {
      onSwitchProduct(product);
    }
  };

  return (
    <div
      style={{
        height: '150vh', // 恢复 150vh 高度以支持 sticky 效果
        position: 'relative',
        background: '#0a0a0a',
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh', // 视口高度
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
          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
          </motion.div>
          
          {/* 3列网格布局 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', // 3列等宽
              gap: '2rem',
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            {availableProducts.map((product, index) => {
              const isActive = product === currentProduct;
              const imageSrc = productImages[product]; // 获取对应图片

              return (
                <motion.div
                  key={product}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  onClick={() => handleClick(product)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    group: 'product-card' // 用于hover效果引用（需配合css modules or JS logic，这里用JS events）
                  }}
                  whileHover={{ y: -10 }}
                >
                  {/* 图片卡片 */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '3/4', // 竖向比例
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '1.5rem',
                    border: isActive 
                      ? '1px solid rgba(255, 87, 34, 0.5)' // 当前项橙色边框
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
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

                    {/* 图片 */}
                    {imageSrc ? (
                      <img 
                        src={imageSrc} 
                        alt={product}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain', // 保持比例展示
                          padding: '10%', // 内缩一点，避免撑满
                          boxSizing: 'border-box',
                          opacity: isActive ? 1 : 0.7, // 非当前项稍微暗一点
                          transition: 'opacity 0.3s ease, transform 0.5s ease',
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#222' }} /> // 占位
                    )}
                    
                    {/* 悬停时的遮罩效果 (可选) */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                      opacity: 0.6
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEndHint;