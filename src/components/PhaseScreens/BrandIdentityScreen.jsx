import React from 'react';
import { motion } from 'framer-motion';
import { SECTION_PADDING } from './Common';

// ============================================
// 品牌架构图内容组件 (BrandIdentityContent)
// 风格：倒三角形几何布局，与第二屏正三角形呼应
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
   * SVG 视口配置
   * - 视口尺寸: 1200 x 900 (与 CorePrinciples 保持一致)
   * - centerX, centerY: 中心点坐标
   * - radius: 倒三角形半径 (节点到中心的距离)
   * 
   * 可调参数:
   * - radius: 350 - 调整三角形大小
   */
  const centerX = 600;                    // 中心 X 坐标
  const centerY = 450;                    // 中心 Y 坐标
  const radius = 350;                     // 半径 (拉开间距)

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

  // 列表项组件
  const TextGroup = ({ title, items, align = 'left' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, gap: '8px' }}>
      <div style={{ 
        color: brandColor, 
        fontSize: '0.9rem', 
        textTransform: 'uppercase', 
        letterSpacing: '2px', 
        marginBottom: '12px',
        fontWeight: 'bold'
      }}>
        {title}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ color: '#fff', fontSize: '1.1rem', opacity: 0.9, display: 'flex', gap: '8px', alignItems: 'baseline' }}>
          <span>{item.zh}</span>
          <span style={{ fontSize: '0.7em', opacity: 0.5, textTransform: 'uppercase' }}>{item.en}</span>
        </div>
      ))}
    </div>
  );

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
      {/* 顶部标题 */}
      <div style={{ position: 'absolute', top: '10%', textAlign: 'center', zIndex: 10 }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.5rem',
          fontWeight: '300',
          letterSpacing: '4px',
          margin: 0,
          color: '#fff'
        }}>
          BRAND IDENTITY
        </h2>
        <p style={{ 
          color: brandColor, 
          letterSpacing: '2px', 
          marginTop: '10px',
          fontSize: '0.9rem',
          textTransform: 'uppercase'
        }}>
          Once again, who are we?
        </p>
      </div>

      {/* 主视觉区域 */}
      <div style={{ position: 'relative', width: '1200px', height: '900px' }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 900" style={{ overflow: 'visible' }}>
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
        </svg>

        {/* 中心 ZMR */}
        <motion.div 
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            fontSize: '5rem', 
            fontWeight: '700', 
            letterSpacing: '0.15em', 
            color: '#fff', 
            textShadow: `0 0 30px ${brandColorGlow}`,
            zIndex: 10,
            opacity: progress.step1,
            scale: progress.step1
          }}
        >
          ZMR
        </motion.div>

        {/* 左上：Core Values */}
        <motion.div 
          style={{ 
            position: 'absolute',
            left: `${(topLeftX / 1200) * 100}%`,
            top: `${(topLeftY / 900) * 100}%`,
            x: '-100%', // 向左偏移
            y: '-50%',
            paddingRight: '40px',
            opacity: progress.step2
          }}
        >
          <TextGroup 
            title="Core Values" 
            align="flex-end"
            items={[
              { zh: '自由', en: 'Freedom' },
              { zh: '热爱', en: 'Passion' },
              { zh: '真诚', en: 'Truthful' }
            ]} 
          />
        </motion.div>

        {/* 右上：Tonality */}
        <motion.div 
          style={{ 
            position: 'absolute',
            left: `${(topRightX / 1200) * 100}%`,
            top: `${(topRightY / 900) * 100}%`,
            x: '0%', // 向右偏移
            y: '-50%',
            paddingLeft: '40px',
            opacity: progress.step3
          }}
        >
          <TextGroup 
            title="Tonality" 
            align="flex-start"
            items={[
              { zh: '友好', en: 'Friendly' },
              { zh: '好玩', en: 'Playful' },
              { zh: '大胆', en: 'Bold' }
            ]} 
          />
        </motion.div>

        {/* 正下：Personality */}
        <motion.div 
          style={{ 
            position: 'absolute',
            left: '50%',
            top: `${(bottomY / 900) * 100}%`,
            x: '-50%',
            y: '0%', // 向下偏移
            paddingTop: '40px',
            opacity: progress.step4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ 
            color: brandColor, 
            fontSize: '0.9rem', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            marginBottom: '12px',
            fontWeight: 'bold'
          }}>
            Brand Personality
          </div>
          <div style={{ display: 'flex', gap: '40px' }}>
            {['情人 / Lover', '探险家 / Explorer', '创造者 / Creator'].map((item, i) => (
              <div key={i} style={{ color: '#fff', fontSize: '1.1rem', opacity: 0.9 }}>
                {item.split(' / ')[0]} <span style={{ fontSize: '0.7em', opacity: 0.5, textTransform: 'uppercase' }}>{item.split(' / ')[1]}</span>
              </div>
            ))}
          </div>
        </motion.div>

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
