import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BrandIdentityContent } from './BrandIdentityScreen';

// ============================================
// 核心原则展示组件 (CorePrinciplesScreen)
// 优化版：放大尺寸，逐个出现，增强叙事感
// 集成 BrandIdentityScreen 实现同屏无缝切换
// ============================================
export const CorePrinciplesScreen = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 品牌色定义
  const brandColor = '#E07B4C'; 
  const brandColorLight = '#FFB088';
  const bgColor = '#0a0a0a';

  // ============================================
  // 阶段 1: Core Principles 动画 (0.0 - 0.5)
  // ============================================
  
  // 整体透明度：在 0.5 - 0.6 期间淡出
  const principlesOpacity = useTransform(scrollYProgress, [0.5, 0.6], [1, 0]);
  // 整体位移：在 0.5 - 0.6 期间上移
  const principlesY = useTransform(scrollYProgress, [0.5, 0.6], ["0%", "-20%"]);

  // 节点透明度
  const opacityCenter = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const opacityTop = useTransform(scrollYProgress, [0.1, 0.15], [0, 1]);
  const opacityLeft = useTransform(scrollYProgress, [0.2, 0.25], [0, 1]);
  const opacityRight = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);

  // 连线进度
  const pathCenterToTop = useTransform(scrollYProgress, [0.05, 0.1], [0, 1]);
  const pathCenterToLeft = useTransform(scrollYProgress, [0.15, 0.2], [0, 1]);
  const pathCenterToRight = useTransform(scrollYProgress, [0.25, 0.3], [0, 1]);
  
  // 外框连线进度 (最后闭合)
  const pathBorder = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);

  // 整体缩放
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  // 底部文字透明度
  const textOpacityTop = useTransform(scrollYProgress, [0.1, 0.15], [0, 1]);
  const textOpacityLeft = useTransform(scrollYProgress, [0.2, 0.25], [0, 1]);
  const textOpacityRight = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);

  // ============================================
  // 阶段 2: Brand Identity 动画 (0.5 - 1.0)
  // ============================================

  // 整体透明度：在 0.5 - 0.6 期间淡入
  const identityOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  // 整体位移：在 0.5 - 0.6 期间从下移入
  const identityY = useTransform(scrollYProgress, [0.5, 0.6], ["20%", "0%"]);
  // 整体缩放
  const identityScale = useTransform(scrollYProgress, [0.5, 1], [0.9, 1]);

  // 内部步骤进度 - 细化为顺序出现
  const identityStep1 = useTransform(scrollYProgress, [0.6, 0.68], [0, 1]); // ZMR (Center)
  const identityStep2 = useTransform(scrollYProgress, [0.68, 0.76], [0, 1]); // Core Values (Left)
  const identityStep3 = useTransform(scrollYProgress, [0.76, 0.84], [0, 1]); // Tonality (Right)
  const identityStep4 = useTransform(scrollYProgress, [0.84, 0.92], [0, 1]); // Personality (Bottom)
  const identityStep5 = useTransform(scrollYProgress, [0.92, 1.0], [0, 1]); // Border/Lines

  // 坐标定义 (放大版) - 视口 1200 x 900
  const centerX = 600;
  const centerY = 550; 
  const radius = 320; 

  const topX = centerX;
  const topY = centerY - radius;

  const leftX = centerX - radius * Math.cos(Math.PI / 6); 
  const leftY = centerY + radius * Math.sin(Math.PI / 6);

  const rightX = centerX + radius * Math.cos(Math.PI / 6);
  const rightY = centerY + radius * Math.sin(Math.PI / 6);

  // 背景图路径
  const bgImage = '/images/phase-01/cover.png';

  return (
    <div ref={ref} style={{ height: '600vh', position: 'relative', background: bgColor }}>
      <div style={{ 
        position: 'sticky', 
        top: '0', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden' 
      }}>
        
        {/* 1. 背景层 (共享) */}
        <div style={{
          position: 'absolute',
          inset: 0, 
          background: `url(${import.meta.env.BASE_URL}${bgImage.replace(/^\//, '')}) center center / cover no-repeat`,
          filter: 'grayscale(100%) brightness(0.2)', 
          zIndex: 0,
          opacity: 0.9 
        }} />

        {/* 2. 背景网格 (共享) */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.05, 
          backgroundImage: `linear-gradient(${brandColor} 1px, transparent 1px), linear-gradient(90deg, ${brandColor} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          zIndex: 1
        }} />

        {/* 2.3 顶部渐变遮罩 - 与上一屏无缝衔接 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40vh',
          background: 'linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)',
          zIndex: 1.5,
          pointerEvents: 'none'
        }} />

        {/* 2.5 底部渐变遮罩 - 确保与下一屏无缝衔接 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50vh', // 增加高度确保覆盖
          background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 70%, #0a0a0a 100%)',
          zIndex: 1.5, // 在网格之上，但在内容之下 (内容 zIndex 是 2 和 3)
          pointerEvents: 'none'
        }} />

        {/* ============================================ */}
        {/* 内容层 1: Core Principles */}
        {/* ============================================ */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 2,
            opacity: principlesOpacity,
            y: principlesY
          }}
        >
          {/* 顶部标题 */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              top: '8%', 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              zIndex: 10,
              opacity: opacityCenter
            }}
          >
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '300', 
              letterSpacing: '4px', 
              margin: 0,
              textAlign: 'center',
              fontFamily: 'var(--font-serif)'
            }}>
              {t('case.phases.phase-01.screens.core-principles.title')}
            </h2>
            <p style={{ 
              color: brandColor, 
              letterSpacing: '2px', 
              marginTop: '10px',
              fontSize: '0.9rem',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>
              {t('case.phases.phase-01.screens.core-principles.subtitle')}
            </p>
          </motion.div>

          {/* 主视觉区域 */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <motion.div style={{ position: 'relative', width: '1200px', height: '900px', scale }}>
              <svg width="100%" height="100%" viewBox="0 0 1200 900" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="principleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={brandColor} />
                    <stop offset="100%" stopColor={brandColorLight} />
                  </linearGradient>
                  <filter id="glow-principle" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <g filter="url(#glow-principle)">
                  {/* 核心连线 */}
                  <motion.path d={`M ${centerX} ${centerY} L ${topX} ${topY}`} fill="none" stroke={brandColor} strokeWidth="3" strokeLinecap="round" style={{ pathLength: pathCenterToTop }} />
                  <motion.path d={`M ${centerX} ${centerY} L ${leftX} ${leftY}`} fill="none" stroke="url(#principleGradient)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: pathCenterToLeft }} />
                  <motion.path d={`M ${centerX} ${centerY} L ${rightX} ${rightY}`} fill="none" stroke="url(#principleGradient)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: pathCenterToRight }} />
                  
                  {/* 外框连线 */}
                  <motion.path d={`M ${topX} ${topY} L ${rightX} ${rightY} L ${leftX} ${leftY} Z`} fill="none" stroke={brandColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="8,8" style={{ pathLength: pathBorder }} />
                </g>

                {/* 中心节点 */}
                <motion.g style={{ opacity: opacityCenter }}>
                  <circle cx={centerX} cy={centerY} r={50} fill={brandColor} fillOpacity="0.1" />
                  <circle cx={centerX} cy={centerY} r={8} fill="#fff" />
                  <circle cx={centerX} cy={centerY} r={20} fill="none" stroke="#fff" strokeWidth="1" opacity="0.5">
                    <animate attributeName="r" from="20" to="35" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x={centerX} y={centerY + 60} fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="2px">
                    {t('case.phases.phase-01.screens.core-principles.nodes.system.label')}
                  </text>
                  <text x={centerX} y={centerY + 80} fill={brandColorLight} fontSize="12" textAnchor="middle" style={{ opacity: 0.8 }}>
                    {t('case.phases.phase-01.screens.core-principles.nodes.system.sub')}
                  </text>
                </motion.g>

                {/* 上方节点 (CLARITY) */}
                <motion.g style={{ opacity: opacityTop }}>
                  <circle cx={topX} cy={topY} r={40} fill={brandColor} fillOpacity="0.05" />
                  <circle cx={topX} cy={topY} r={6} fill={brandColor} />
                  <text x={topX} y={topY - 30} fill="#fff" fontSize="18" fontWeight="bold" textAnchor="middle" letterSpacing="2px">
                    {t('case.phases.phase-01.screens.core-principles.nodes.clarity.label')}
                  </text>
                  <text x={topX} y={topY - 10} fill={brandColorLight} fontSize="14" textAnchor="middle">
                    {t('case.phases.phase-01.screens.core-principles.nodes.clarity.sub')}
                  </text>
                </motion.g>

                {/* 左下节点 (RESTRAINT) */}
                <motion.g style={{ opacity: opacityLeft }}>
                  <circle cx={leftX} cy={leftY} r={40} fill={brandColor} fillOpacity="0.05" />
                  <circle cx={leftX} cy={leftY} r={6} fill={brandColor} />
                  <text x={leftX} y={leftY + 40} fill="#fff" fontSize="18" fontWeight="bold" textAnchor="middle" letterSpacing="2px">
                    {t('case.phases.phase-01.screens.core-principles.nodes.restraint.label')}
                  </text>
                  <text x={leftX} y={leftY + 60} fill={brandColorLight} fontSize="14" textAnchor="middle">
                    {t('case.phases.phase-01.screens.core-principles.nodes.restraint.sub')}
                  </text>
                </motion.g>

                {/* 右下节点 (SCALABILITY) */}
                <motion.g style={{ opacity: opacityRight }}>
                  <circle cx={rightX} cy={rightY} r={40} fill={brandColor} fillOpacity="0.05" />
                  <circle cx={rightX} cy={rightY} r={6} fill={brandColor} />
                  <text x={rightX} y={rightY + 40} fill="#fff" fontSize="18" fontWeight="bold" textAnchor="middle" letterSpacing="2px">
                    {t('case.phases.phase-01.screens.core-principles.nodes.scalability.label')}
                  </text>
                  <text x={rightX} y={rightY + 60} fill={brandColorLight} fontSize="14" textAnchor="middle">
                    {t('case.phases.phase-01.screens.core-principles.nodes.scalability.sub')}
                  </text>
                </motion.g>
              </svg>
            </motion.div>
          </div>

          {/* 底部详细说明 */}
          <div style={{ 
            position: 'absolute', 
            bottom: '5%', 
            width: '100%', 
            maxWidth: '1400px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 50px',
            pointerEvents: 'none'
          }}>
            {/* 左侧说明 */}
            <motion.div style={{ opacity: textOpacityLeft, textAlign: 'left', width: '300px' }}>
              <div style={{ color: brandColor, fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('case.phases.phase-01.screens.core-principles.nodes.restraint.label')}
              </div>
              <div style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {t('case.phases.phase-01.screens.core-principles.nodes.restraint.desc')}
              </div>
            </motion.div>

            {/* 中间说明 */}
            <motion.div style={{ opacity: textOpacityTop, textAlign: 'center', width: '300px', transform: 'translateY(-20px)' }}>
              <div style={{ color: brandColor, fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('case.phases.phase-01.screens.core-principles.nodes.clarity.label')}
              </div>
              <div style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {t('case.phases.phase-01.screens.core-principles.nodes.clarity.desc')}
              </div>
            </motion.div>

            {/* 右侧说明 */}
            <motion.div style={{ opacity: textOpacityRight, textAlign: 'right', width: '300px' }}>
              <div style={{ color: brandColor, fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('case.phases.phase-01.screens.core-principles.nodes.scalability.label')}
              </div>
              <div style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {t('case.phases.phase-01.screens.core-principles.nodes.scalability.desc')}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* 内容层 2: Brand Identity */}
        {/* ============================================ */}
        <BrandIdentityContent 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 3,
            opacity: identityOpacity,
            y: identityY,
            scale: identityScale
          }}
          progress={{
            step1: identityStep1,
            step2: identityStep2,
            step3: identityStep3,
            step4: identityStep4,
            step5: identityStep5
          }}
        />

      </div>
    </div>
  );
};