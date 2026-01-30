import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { useControls, button, buttonGroup } from 'leva'; // 已禁用：移除调试面板

/**
 * ============================================
 * 屏幕: 组件拼装展示 (ComponentAssemblyScreen)
 * ============================================
 * 原本带调试面板，可调整每个图片的位置和大小
 * 已禁用 Leva 调试面板，使用固定配置参数
 * ============================================
 */

// 素材基础路径
const BASE_PATH = '/images/phase-02/分散';

// ===== 默认配置参数 =====
const DEFAULT_CONFIG = {
  container: { padding: 50, gap: 8, maxWidth: 1600 },
  grid: { col1Width: 150, col2Width: 200, col4Width: 200, col5Width: 220 },
  colOffsets: {
    '左1列X': -25, '左1列Y': 5, '左1列缩放': 0.95,
    '左2列X': -20, '左2列Y': 5, '左2列缩放': 1,
    '中间X': 45, '中间Y': -10, '中间缩放': 0.95,
    '右1列X': 300, '右1列Y': 0, '右1列缩放': 1.4,
    '右2列X': 300, '右2列Y': 130, '右2列缩放': 1.25,
    '底部X': -10, '底部Y': -55, '底部缩放': 0.8,
  },
  images: {
    L1: { x: 66, y: 2, scale: 1.45 },
    L2: { x: 65, y: 43, scale: 1.45 },
    L3: { x: 316, y: -162, scale: 1.94 },
    L4: { x: 95, y: -51, scale: 1.89 },
    L5: { x: 95, y: 34, scale: 1.9 },
    L6: { x: 95, y: 110, scale: 1.91 },
    C1: { x: 0, y: -1, scale: 1.05 },
    C3: { x: 174, y: 268, scale: 0.95 },
    C4: { x: 174, y: 259, scale: 0.95 },
    C5: { x: 30, y: -172, scale: 0.36 },
    R1: { x: -331, y: 24, scale: 1.25 },
    R2: { x: -210, y: 40, scale: 1.9 },
    R3: { x: -331, y: 97, scale: 1.25 },
    R4: { x: -208, y: 112, scale: 1.85 },
    R5: { x: -465, y: 241, scale: 1.58 },
    R6: { x: -466, y: 360, scale: 1.55 },
  }
};

const ComponentAssemblyScreen = () => {
  const [copied, setCopied] = useState(false);

  // 构建图片路径
  const getImageSrc = (file) => {
    return `${import.meta.env.BASE_URL}${BASE_PATH.replace(/^\//, '')}/${file}`;
  };

  // ===== 使用固定配置（已禁用 Leva 调试面板） =====
  const colOffsets = DEFAULT_CONFIG.colOffsets;
  const containerConfig = DEFAULT_CONFIG.container;
  const gridConfig = DEFAULT_CONFIG.grid;
  
  // 直接使用配置中的图片参数
  const imageConfigs = DEFAULT_CONFIG.images;
  const { L1, L2, L3, L4, L5, L6, C1, C3, C4, C5, R1, R2, R3, R4, R5, R6 } = imageConfigs;

  // 图片样式生成器 (支持列偏移)
  const getImageStyle = (config, colXOffset = 0, colYOffset = 0, colScale = 1) => ({
    width: '100%',
    height: 'auto',
    display: 'block',
    transform: `translate(${config.x + colXOffset}px, ${config.y + colYOffset}px) scale(${config.scale * colScale})`,
    transformOrigin: 'center center'
  });

  // ===== 飞入动画配置 =====
  const flyInVariants = {
    // 从左侧飞入
    fromLeft: {
      hidden: { opacity: 0, x: -200 },
      visible: { opacity: 1, x: 0 }
    },
    // 从右侧飞入
    fromRight: {
      hidden: { opacity: 0, x: 200 },
      visible: { opacity: 1, x: 0 }
    },
    // 从下方飞入
    fromBottom: {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0 }
    },
    // 缩放进入 (中间主图)
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  };

  // 动画过渡配置
  const transition = {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1] // cubic-bezier 缓动
  };

  // 创建带延迟的过渡
  const getDelayedTransition = (delay) => ({
    ...transition,
    delay
  });

  return (
    <section 
      style={{ 
        minHeight: '100vh',
        position: 'relative',
        background: '#0a0a0a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: `${containerConfig.padding}px`
      }}
    >
      {/* 复制成功提示 */}
      {copied && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#22c55e',
          color: '#fff',
          padding: '16px 32px',
          borderRadius: '8px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          ✅ 配置已复制到剪贴板！
        </div>
      )}

      {/* 主体网格区域 */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `${gridConfig.col1Width}px ${gridConfig.col2Width}px 1fr ${gridConfig.col4Width}px ${gridConfig.col5Width}px`,
        gridTemplateRows: '1fr auto',
        gap: `${containerConfig.gap}px`,
        maxWidth: `${containerConfig.maxWidth}px`,
        margin: '0 auto',
        width: '100%'
      }}>
        {/* ===== 左1列: L1~L6 (从左飞入) ===== */}
        <motion.div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${containerConfig.gap}px`,
            gridRow: '1 / 2'
          }}
          variants={flyInVariants.fromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={getDelayedTransition(0)}
        >
          {[L1, L2, L3, L4, L5, L6].map((config, i) => (
            <img
              key={`L${i + 1}`}
              src={getImageSrc(`L${i + 1}.png`)}
              alt={`L${i + 1}`}
              style={getImageStyle(config, colOffsets['左1列X'], colOffsets['左1列Y'], colOffsets['左1列缩放'])}
            />
          ))}
        </motion.div>

        {/* ===== 左2列: C3 + C4 (从左飞入，延迟 0.1s) ===== */}
        <motion.div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${containerConfig.gap}px`,
            gridRow: '1 / 2'
          }}
          variants={flyInVariants.fromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={getDelayedTransition(0.1)}
        >
          <img src={getImageSrc('C3.png')} alt="C3" style={getImageStyle(C3, colOffsets['左2列X'], colOffsets['左2列Y'], colOffsets['左2列缩放'])} />
          <img src={getImageSrc('C4.png')} alt="C4" style={getImageStyle(C4, colOffsets['左2列X'], colOffsets['左2列Y'], colOffsets['左2列缩放'])} />
        </motion.div>

        {/* ===== 中间: C1 主图 (缩放进入，延迟 0.2s) ===== */}
        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gridRow: '1 / 2'
          }}
          variants={flyInVariants.scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={getDelayedTransition(0.2)}
        >
          <img
            src={getImageSrc('C1.png')}
            alt="C1"
            style={{
              ...getImageStyle(C1, colOffsets['中间X'], colOffsets['中间Y'], colOffsets['中间缩放']),
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
        </motion.div>

        {/* ===== 右1列: R1~R4 (从右飞入，延迟 0.1s) ===== */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: `${containerConfig.gap}px`,
            gridRow: '1 / 2',
            alignContent: 'start'
          }}
          variants={flyInVariants.fromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={getDelayedTransition(0.1)}
        >
          <img src={getImageSrc('R1.png')} alt="R1" style={getImageStyle(R1, colOffsets['右1列X'], colOffsets['右1列Y'], colOffsets['右1列缩放'])} />
          <img src={getImageSrc('R2.png')} alt="R2" style={getImageStyle(R2, colOffsets['右1列X'], colOffsets['右1列Y'], colOffsets['右1列缩放'])} />
          <img src={getImageSrc('R3.png')} alt="R3" style={getImageStyle(R3, colOffsets['右1列X'], colOffsets['右1列Y'], colOffsets['右1列缩放'])} />
          <img src={getImageSrc('R4.png')} alt="R4" style={getImageStyle(R4, colOffsets['右1列X'], colOffsets['右1列Y'], colOffsets['右1列缩放'])} />
        </motion.div>

        {/* ===== 右2列: R5 + R6 (从右飞入) ===== */}
        <motion.div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${containerConfig.gap}px`,
            gridRow: '1 / 2'
          }}
          variants={flyInVariants.fromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={getDelayedTransition(0)}
        >
          <img src={getImageSrc('R5.png')} alt="R5" style={getImageStyle(R5, colOffsets['右2列X'], colOffsets['右2列Y'], colOffsets['右2列缩放'])} />
          <img src={getImageSrc('R6.png')} alt="R6" style={getImageStyle(R6, colOffsets['右2列X'], colOffsets['右2列Y'], colOffsets['右2列缩放'])} />
        </motion.div>

        {/* ===== 底部横条: C5 (从下飞入，延迟 0.3s) ===== */}
        <motion.div 
          style={{
            gridColumn: '1 / -1',
            gridRow: '2 / 3'
          }}
          variants={flyInVariants.fromBottom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={getDelayedTransition(0.3)}
        >
          <img src={getImageSrc('C5.png')} alt="C5" style={getImageStyle(C5, colOffsets['底部X'], colOffsets['底部Y'], colOffsets['底部缩放'])} />
        </motion.div>
      </div>
    </section>
  );
};

export { ComponentAssemblyScreen };
export default ComponentAssemblyScreen;