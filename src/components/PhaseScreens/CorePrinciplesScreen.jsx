import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BrandIdentityContent } from './BrandIdentityScreen';
import { useScreenTransition } from './TransitionContext';

// ============================================
// 核心原则展示组件 (CorePrinciplesScreen)
// 优化版：放大尺寸，逐个出现，增强叙事感
// 集成 BrandIdentityScreen 实现同屏无缝切换
// 
// 过渡配置位置: src/config/transitionConfig.js → SCREEN_TRANSITIONS['core-principles']
// ============================================
export const CorePrinciplesScreen = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  
  // 获取过渡配置 (支持实时调试)
  const T = useScreenTransition('core-principles');
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // ============================================
  // 【品牌色定义】
  // ============================================
  const brandColor = '#FF4600';
  const brandColorLight = '#FF7A3D';
  const bgColor = '#0a0a0a';

  // ============================================
  // 【动效参数 - 从统一配置读取】
  // 修改过渡效果请编辑: src/config/transitionConfig.js
  // ============================================
  
  // === 阶段1: Core Principles 动画 ===
  
  // 节点顺序出现
  const opacityCenter = useTransform(scrollYProgress, T.nodeCenter.scrollRange, T.nodeCenter.valueRange);
  const opacityTop = useTransform(scrollYProgress, T.nodeTop.scrollRange, T.nodeTop.valueRange);
  const opacityLeft = useTransform(scrollYProgress, T.nodeLeft.scrollRange, T.nodeLeft.valueRange);
  const opacityRight = useTransform(scrollYProgress, T.nodeRight.scrollRange, T.nodeRight.valueRange);
  
  // 连线绘制
  const pathCenterToTop = useTransform(scrollYProgress, T.pathCenterToTop.scrollRange, T.pathCenterToTop.valueRange);
  const pathCenterToLeft = useTransform(scrollYProgress, T.pathCenterToLeft.scrollRange, T.pathCenterToLeft.valueRange);
  const pathCenterToRight = useTransform(scrollYProgress, T.pathCenterToRight.scrollRange, T.pathCenterToRight.valueRange);
  const pathBorder = useTransform(scrollYProgress, T.pathBorder.scrollRange, T.pathBorder.valueRange);
  
  // 整体缩放
  const scale = useTransform(scrollYProgress, T.phase1Scale.scrollRange, T.phase1Scale.valueRange);
  
  // 阶段1离场
  const principlesOpacity = useTransform(scrollYProgress, T.phase1ExitOpacity.scrollRange, T.phase1ExitOpacity.valueRange);
  const principlesY = useTransform(scrollYProgress, T.phase1ExitY.scrollRange, T.phase1ExitY.valueRange);
  
  // 底部说明文字透明度 (复用节点透明度配置)
  const textOpacityTop = opacityTop;
  const textOpacityLeft = opacityLeft;
  const textOpacityRight = opacityRight;

  // === 阶段2: Brand Identity 动画 ===
  
  // 入场动画
  const identityOpacity = useTransform(scrollYProgress, T.phase2EntryOpacity.scrollRange, T.phase2EntryOpacity.valueRange);
  const identityY = useTransform(scrollYProgress, T.phase2EntryY.scrollRange, T.phase2EntryY.valueRange);
  const identityScale = useTransform(scrollYProgress, T.phase2Scale.scrollRange, T.phase2Scale.valueRange);
  
  // 内部元素顺序出现
  const identityStep1 = useTransform(scrollYProgress, T.identityStep1.scrollRange, T.identityStep1.valueRange);
  const identityStep2 = useTransform(scrollYProgress, T.identityStep2.scrollRange, T.identityStep2.valueRange);
  const identityStep3 = useTransform(scrollYProgress, T.identityStep3.scrollRange, T.identityStep3.valueRange);
  const identityStep4 = useTransform(scrollYProgress, T.identityStep4.scrollRange, T.identityStep4.valueRange);
  const identityStep5 = useTransform(scrollYProgress, T.identityStep5.scrollRange, T.identityStep5.valueRange);

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