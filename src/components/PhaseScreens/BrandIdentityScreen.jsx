import React from 'react';
import { motion } from 'framer-motion';
import { SECTION_PADDING } from './Common';

// ============================================
// 品牌架构图内容组件 (BrandIdentityContent)
// 风格：倒三角形几何布局，与第二屏正三角形呼应
// 响应式：基于 vh/vw 确保在任何窗口尺寸下一屏显示完整
// ============================================
export const BrandIdentityContent = ({ style, progress }) => {
  // ============================================
  // 【品牌色定义】
  // ============================================
  const brandColor = '#FF4600';           // 品牌主色: 鲜橙色
  const brandColorGlow = 'rgba(255, 70, 0, 0.4)'; // 品牌色发光效果
  const brandColorLight = '#FF7A3D';      // 品牌亮色: 浅橙色

  // ============================================
  // 【几何坐标配置】
  // ============================================
  
  /**
   * SVG 视口配置 (viewBox 内部坐标不变，容器尺寸响应式)
   * - viewBox: 0 0 1200 900
   * - 容器: min(90vw, 1200px) x min(65vh, 900px)
   * - 通过 preserveAspectRatio 让 SVG 等比缩放填充容器
   */
  const centerX = 600;
  const centerY = 450;
  const radius = 350;

  /**
   * 倒三角形顶点坐标计算
   * - 左上: Core Values (核心价值)
   * - 右上: Tonality (调性)
   * - 正下: Personality (个性)
   * 
   * 数学原理: 使用三角函数计算等边三角形顶点
   */
  // 左上顶点 (Core Values)
  const topLeftX = centerX - radius * Math.cos(Math.PI / 6);
  const topLeftY = centerY - radius * Math.sin(Math.PI / 6);
  
  // 右上顶点 (Tonality)
  const topRightX = centerX + radius * Math.cos(Math.PI / 6);
  const topRightY = centerY - radius * Math.sin(Math.PI / 6);

  // 正下顶点 (Personality)
  const bottomX = centerX;
  const bottomY = centerY + radius;

  // TextGroup 不再需要 —— 文字节点已移入 SVG 内部随 viewBox 等比缩放

  return (
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {/* 顶部标题 - 响应式字号 */}
      <div style={{ 
        position: 'absolute', 
        top: 'clamp(3vh, 8%, 10vh)', 
        textAlign: 'center', 
        zIndex: 10 
      }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
          fontWeight: '300',
          letterSpacing: '4px',
          margin: 0,
          color: '#fff'
        }}>
          品牌核心架构
        </h2>
        <p style={{ 
          color: brandColor, 
          letterSpacing: '2px', 
          marginTop: 'clamp(4px, 1vh, 10px)',
          fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
        }}>
          再次追问，我们是谁？
        </p>
      </div>

      {/* 主视觉区域 - 响应式容器 */}
      <div style={{ 
        position: 'relative', 
        width: 'min(90vw, 1200px)', 
        height: 'min(65vh, 900px)',
        maxHeight: '70vh'
      }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1200 900" 
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="glow-identity" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g filter="url(#glow-identity)">
            {/* 射线：中心 -> 顶点 */}
            <motion.line x1={centerX} y1={centerY} x2={topLeftX} y2={topLeftY} stroke={brandColor} strokeWidth="2" style={{ pathLength: progress.step2, opacity: 0.6 }} />
            <motion.line x1={centerX} y1={centerY} x2={topRightX} y2={topRightY} stroke={brandColor} strokeWidth="2" style={{ pathLength: progress.step3, opacity: 0.6 }} />
            <motion.line x1={centerX} y1={centerY} x2={bottomX} y2={bottomY} stroke={brandColor} strokeWidth="2" style={{ pathLength: progress.step4, opacity: 0.6 }} />

            {/* 外框：倒三角形 */}
            <motion.path 
              d={`M ${topLeftX} ${topLeftY} L ${topRightX} ${topRightY} L ${bottomX} ${bottomY} Z`} 
              fill="none" 
              stroke={brandColor} 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              style={{ pathLength: progress.step5, opacity: 0.3 }} 
            />
          </g>

          {/* 节点装饰 */}
          {[
            { x: topLeftX, y: topLeftY, step: progress.step2 },
            { x: topRightX, y: topRightY, step: progress.step3 },
            { x: bottomX, y: bottomY, step: progress.step4 }
          ].map((node, i) => (
            <motion.g key={i} style={{ opacity: node.step }}>
              <circle cx={node.x} cy={node.y} r="4" fill={brandColor} />
              <circle cx={node.x} cy={node.y} r="12" fill="none" stroke={brandColor} strokeWidth="1" opacity="0.5" />
            </motion.g>
          ))}

          {/* === 文字节点移入 SVG 内部，随 viewBox 等比缩放 === */}

          {/* 中心 ZMR */}
          <motion.g style={{ opacity: progress.step1 }}>
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize="72"
              fontWeight="700"
              letterSpacing="0.15em"
              style={{ filter: `drop-shadow(0 0 30px ${brandColorGlow})` }}
            >
              ZMR
            </text>
          </motion.g>

          {/* 左上：Core Values */}
          <motion.g style={{ opacity: progress.step2 }}>
            <text x={topLeftX - 50} y={topLeftY - 60} textAnchor="end" fill={brandColor} fontSize="14" fontWeight="bold" letterSpacing="2">
              核心价值
            </text>
            {['自由', '热爱', '真诚'].map((item, i) => (
              <text key={i} x={topLeftX - 50} y={topLeftY - 30 + i * 28} textAnchor="end" fill="#fff" fontSize="17" opacity="0.9">
                {item}
              </text>
            ))}
          </motion.g>

          {/* 右上：Tonality */}
          <motion.g style={{ opacity: progress.step3 }}>
            <text x={topRightX + 50} y={topRightY - 60} textAnchor="start" fill={brandColor} fontSize="14" fontWeight="bold" letterSpacing="2">
              品牌调性
            </text>
            {['友好', '好玩', '大胆'].map((item, i) => (
              <text key={i} x={topRightX + 50} y={topRightY - 30 + i * 28} textAnchor="start" fill="#fff" fontSize="17" opacity="0.9">
                {item}
              </text>
            ))}
          </motion.g>

          {/* 正下：Personality */}
          <motion.g style={{ opacity: progress.step4 }}>
            <text x={bottomX} y={bottomY + 40} textAnchor="middle" fill={brandColor} fontSize="14" fontWeight="bold" letterSpacing="2">
              品牌人格
            </text>
            {['情人', '探险家', '创造者'].map((item, i) => (
              <text key={i} x={bottomX + (i - 1) * 100} y={bottomY + 70} textAnchor="middle" fill="#fff" fontSize="17" opacity="0.9">
                {item}
              </text>
            ))}
          </motion.g>

        </svg>
      </div>
    </motion.div>
  );
};

// ============================================
// 品牌架构图动态展示组件 (BrandIdentityScreen)
// 兼容旧的独立调用方式
// ============================================
export const BrandIdentityScreen = () => {
  // 简单的包装，用于独立显示时的兼容
  return (
    <section style={{ height: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BrandIdentityContent 
        style={{ opacity: 1 }} 
        progress={{ step1: 1, step2: 1, step3: 1, step4: 1, step5: 1 }} 
      />
    </section>
  );
};