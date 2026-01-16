import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

export const LogoFocusLensScreen = () => {
  const ref = useRef(null);
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]    // 滚动范围: 元素顶部对齐视口顶部 → 元素底部对齐视口底部
  });

  // ============================================
  // 【图片资源配置】
  // ============================================
  const basePath = import.meta.env.BASE_URL || '/';
  const folderPath = `${basePath}images/phase-01/logo-variants`;
  
  /**
   * Logo 变体卡片数据
   * - 共 5 张卡片，随滚动依次激活
   * - 可调整卡片数量和顺序
   */
  const items = [
    { id: 1, title: 'Wireframe', img: `${folderPath}/Group675.png` },  // 线框稿
    { id: 2, title: 'Sketch', img: `${folderPath}/Group671.png` },     // 草图
    { id: 3, title: 'Grid', img: `${folderPath}/Group672.png` },       // 网格
    { id: 4, title: 'Solid', img: `${folderPath}/Group673.png` },      // 实心
    { id: 5, title: 'Final', img: `${folderPath}/Group674.png` }       // 最终版
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);

  // ============================================
  // 【滚动进度 → 激活索引映射】
  // ============================================
  /**
   * 监听滚动进度，计算当前激活的卡片索引
   * - 滚动进度 0 → 1 均匀映射到 0 → (items.length - 1)
   * - 效果: 滚动时依次切换焦点卡片
   */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 将 0~1 的滚动进度映射到 0~4 的索引
      const index = Math.round(latest * (items.length - 1));
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, items.length]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '0', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '100px', left: '50px', zIndex: 20 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>LOGO VARIATIONS</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Exploration Process</p>
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {items.map((item, i) => {
            const isActive = activeIndex === i;
            const distance = Math.abs(activeIndex - i);
            
            // 确保 blur、opacity 和 scale 值不为负数
            const blurValue = Math.max(0, isActive ? 0 : 4);
            const opacityValue = Math.max(0, isActive ? 1 : 0.3 - distance * 0.1);
            const scaleValue = Math.max(0.5, isActive ? 1.5 : 1 - distance * 0.1);

            return (
              <motion.div
                key={i}
                animate={{
                  scale: scaleValue,
                  opacity: opacityValue,
                  zIndex: isActive ? 10 : 1
                }}
                // 使用 tween 动画而非 spring 以避免过冲导致负值
                transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                style={{
                  width: '200px',
                  height: '300px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
                  background: '#fff', // 添加白色背景以适应透明 PNG
                  filter: `blur(${blurValue}px)` // 使用静态 filter 而非动画
                }}
              >
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundImage: `url("${item.img}")`,
                  backgroundSize: 'contain', // 改为 contain 以完整显示 Logo
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }} />
                
                {/* 遮罩与文字 */}
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '20px'
                }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {item.title}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 底部指示器 */}
        <div style={{ position: 'absolute', bottom: '50px', display: 'flex', gap: '10px' }}>
          {items.map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                width: activeIndex === i ? '30px' : '8px',
                background: activeIndex === i ? '#fff' : '#333'
              }}
              style={{ height: '8px', borderRadius: '4px' }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};