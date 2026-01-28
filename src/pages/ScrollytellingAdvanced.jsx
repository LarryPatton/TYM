import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// ============================================
// Phase 1: 媒体控制类 (Media Control)
// ============================================

// 1. Brand Hero Section - 品牌官网高级展示 (Video Version)
const ScrollDrivenVideo = () => {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 视频源：使用一个高质量的墨水/流体视频，具有高级感
  // 备选：https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-208-large.mp4
  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-208-large.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 确保视频元数据已加载，以便获取 duration
    const handleLoadedMetadata = () => {
      // 初始状态
      video.currentTime = 0;
    };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // 核心逻辑：将滚动进度映射到视频时间
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (video.duration) {
        // 使用 requestAnimationFrame 确保平滑
        requestAnimationFrame(() => {
          // 加上一点缓冲或平滑算法可以更顺畅，这里直接映射
          video.currentTime = latest * video.duration;
        });
      }
    });

    return () => {
      unsubscribe();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [scrollYProgress]);

  // 动画映射
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0, 0, 1]); // 中间隐藏，两头显示
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0, 0.8]); // 视频清晰度变化

  return (
    <div ref={ref} style={{ height: '500vh', position: 'relative', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* 视频层 */}
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8 // 稍微降低亮度以突出文字
          }}
        />

        {/* 动态遮罩层 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: '#000', 
            opacity: overlayOpacity 
          }} 
        />

        {/* 顶部导航模拟 - 已移除，使用全局导航栏 */}

        {/* 初始标题层 (随滚动淡出) */}
        <motion.div 
          style={{ 
            position: 'absolute',
            inset: 0,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexDirection: 'column',
            color: '#fff',
            zIndex: 10,
            y: textY,
            opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0])
          }}
        >
          <h2 style={{ 
            fontSize: 'clamp(3rem, 8vw, 8rem)', 
            fontWeight: '900', 
            letterSpacing: '-2px',
            margin: 0,
            lineHeight: 1.1,
            textAlign: 'center',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
          }}>
            FLUID<br />DYNAMICS
          </h2>
          <p style={{ marginTop: '20px', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', opacity: 0.8 }}>
            Scroll to Control Time
          </p>
        </motion.div>

        {/* 过程中的文案层 (随滚动出现) */}
        <motion.div 
          style={{ 
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            x: '-50%',
            textAlign: 'center',
            color: '#fff',
            zIndex: 10,
            opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])
          }}
        >
          <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0', fontWeight: '300' }}>Precision Control</h3>
          <p style={{ opacity: 0.7, maxWidth: '400px' }}>
            Every frame is a masterpiece. Control the flow of time with your scroll.
          </p>
        </motion.div>

        {/* 结束时的文案层 */}
        <motion.div 
          style={{ 
            position: 'absolute',
            inset: 0,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff',
            zIndex: 10,
            opacity: useTransform(scrollYProgress, [0.85, 1], [0, 1]),
            background: 'rgba(0,0,0,0.8)' // 结束时加深背景
          }}
        >
          <h2 style={{ fontSize: '4rem', fontWeight: 'bold' }}>THE END</h2>
        </motion.div>

        {/* 进度指示器 */}
        <div style={{ 
          position: 'absolute', 
          bottom: '30px', 
          left: '50px', 
          right: '50px', 
          height: '2px', 
          background: 'rgba(255,255,255,0.2)',
          zIndex: 20
        }}>
          <motion.div 
            style={{ 
              height: '100%', 
              background: '#fff', 
              width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) 
            }} 
          />
        </div>

      </div>
    </div>
  );
};

// 2. Product Sequence Showcase - 品牌官网序列帧展示 (Canvas Simulation)
const ImageSequenceFrame = () => {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 模拟序列帧总数
  const totalFrames = 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 绘制函数：模拟一个高科技芯片/核心的旋转
    const drawFrame = (progress) => {
      // 清空画布
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      const frame = Math.floor(progress * totalFrames);
      const angle = (frame / totalFrames) * Math.PI * 2; // 旋转角度
      
      ctx.save();
      ctx.translate(width / 2, height / 2);
      
      // 1. 绘制核心光晕
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
      gradient.addColorStop(0, `rgba(0, 120, 255, ${0.2 + Math.sin(angle * 2) * 0.1})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 400, 0, Math.PI * 2);
      ctx.fill();

      // 2. 绘制旋转的几何体 (模拟 3D 投影)
      ctx.strokeStyle = '#00aaff';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      // 模拟一个立方体的顶点
      const size = 150;
      const points = [
        { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
      ];

      // 3D 旋转矩阵
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const cos2 = Math.cos(angle * 0.5);
      const sin2 = Math.sin(angle * 0.5);

      const projectedPoints = points.map(p => {
        // 绕 Y 轴旋转
        let x = p.x * cos - p.z * sin;
        let z = p.z * cos + p.x * sin;
        // 绕 X 轴旋转
        let y = p.y * cos2 - z * sin2;
        z = z * cos2 + p.y * sin2;

        // 透视投影
        const scale = 400 / (400 + z * size);
        return {
          x: x * size * scale,
          y: y * size * scale
        };
      });

      // 绘制连线
      ctx.beginPath();
      const edges = [
        [0,1], [1,2], [2,3], [3,0], // Back face
        [4,5], [5,6], [6,7], [7,4], // Front face
        [0,4], [1,5], [2,6], [3,7]  // Connecting edges
      ];

      edges.forEach(([i, j]) => {
        ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
        ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
      });
      ctx.stroke();

      // 3. 绘制装饰性圆环 (模拟扫描线)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.cos(angle * 4) * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 250, 250 * Math.abs(Math.sin(angle)), 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    // 监听滚动更新画面
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      requestAnimationFrame(() => drawFrame(latest));
    });

    // 初始绘制
    drawFrame(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [scrollYProgress]);

  // 文字动画
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.6, 0.8], [0, 1, 1, 0]);
  const titleScale = useTransform(scrollYProgress, [0.1, 0.8], [0.8, 1.2]);
  const specOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.7, 0.9], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ height: '400vh', position: 'relative', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* 序列帧画布 */}
        <canvas 
          ref={canvasRef} 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 1
          }} 
        />

        {/* 顶部导航 - 已移除，使用全局导航栏 */}
        <div style={{ 
          position: 'absolute', 
          top: '80px', // 调整位置以避开全局导航
          left: 0, 
          right: 0, 
          padding: '30px 50px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          zIndex: 20,
          color: '#fff',
          mixBlendMode: 'screen'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>CORE™</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>SEQUENCE_02</div>
        </div>

        {/* 核心标题 */}
        <motion.div 
          style={{ 
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            opacity: titleOpacity,
            scale: titleScale
          }}
        >
          <h2 style={{ 
            fontSize: 'clamp(4rem, 10vw, 10rem)', 
            fontWeight: '900', 
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255,255,255,0.5)',
            margin: 0,
            textAlign: 'center',
            fontFamily: 'monospace',
            letterSpacing: '-5px'
          }}>
            SYSTEM<br />CORE
          </h2>
        </motion.div>

        {/* 规格参数 (随滚动出现) */}
        <motion.div 
          style={{ 
            position: 'absolute',
            bottom: '100px',
            left: '50px',
            zIndex: 10,
            color: '#00aaff',
            fontFamily: 'monospace',
            opacity: specOpacity
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>PROCESSING...</div>
          <div style={{ display: 'flex', gap: '40px', fontSize: '0.9rem' }}>
            <div>
              <div style={{ opacity: 0.6 }}>CLOCK SPEED</div>
              <div>5.0 GHz</div>
            </div>
            <div>
              <div style={{ opacity: 0.6 }}>ARCHITECTURE</div>
              <div>64-BIT</div>
            </div>
            <div>
              <div style={{ opacity: 0.6 }}>THERMAL</div>
              <div>OPTIMIZED</div>
            </div>
          </div>
        </motion.div>

        {/* 滚动进度条 */}
        <div style={{ 
          position: 'absolute', 
          right: '50px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          height: '200px', 
          width: '2px', 
          background: 'rgba(255,255,255,0.1)',
          zIndex: 20
        }}>
          <motion.div 
            style={{ 
              width: '100%', 
              background: '#00aaff', 
              height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) 
            }} 
          />
        </div>

      </div>
    </div>
  );
};

// 3. Engineering Blueprint Reveal - 品牌官网蓝图绘制 (SVG Path Animation)
const LottieAnimationControl = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 优化：缩短动画行程，使其更紧凑
  // 路径绘制进度 (0 -> 0.5 完成绘制)
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  
  // 标注显现 (0.2 -> 0.6 依次出现)
  const labelOpacity1 = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const labelOpacity2 = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const labelOpacity3 = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  // 最终成型动画 (0.6 -> 0.9 完成)
  const fillOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 0.1]);
  const glowOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 0.5]);

  return (
    // 优化：高度从 300vh 减少到 180vh，减少空白期
    <div ref={ref} style={{ height: '140vh', position: 'relative', background: '#050a14', overflow: 'hidden' }}>
      {/* 背景网格 */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'linear-gradient(rgba(50, 100, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 100, 255, 0.05) 1px, transparent 1px)', 
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      {/* 
        修复遮挡问题：
        Layout 组件中有一个 80px 高的 sticky 导航栏。
        直接将 sticky 容器的 top 设置为 80px，并减去相应高度，
        这样容器就完全位于导航栏下方，不会有任何重叠风险。
      */}
      <div style={{ 
        position: 'sticky', 
        top: '80px', // 直接让出导航栏高度
        height: 'calc(100vh - 80px)', // 减去导航栏高度
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxSizing: 'border-box',
        paddingTop: '100px' // 额外下移内容，避免视觉重心过高
      }}>
        
        {/* 顶部标题 - 相对位置 */}
        <div style={{ position: 'absolute', top: '40px', left: '50px', color: '#3264ff' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px' }}>PHASE 03</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>SCHEMATIC DESIGN</div>
        </div>

        {/* 蓝图 SVG */}
        <div style={{ position: 'relative', width: '800px', height: '600px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3264ff" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>

            {/* 主体结构路径 */}
            <motion.g style={{ opacity }}>
              {/* 外框 */}
              <motion.path
                d="M 200 150 L 600 150 L 650 200 L 650 400 L 600 450 L 200 450 L 150 400 L 150 200 Z"
                fill="rgba(50, 100, 255, 0)"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                style={{ pathLength, fillOpacity }}
              />
              {/* 内部细节 */}
              <motion.path
                d="M 250 250 L 550 250 M 250 350 L 550 350 M 400 200 L 400 400"
                stroke="rgba(50, 100, 255, 0.5)"
                strokeWidth="1"
                strokeDasharray="5,5"
                style={{ pathLength }}
              />
              {/* 核心圆 */}
              <motion.circle
                cx="400" cy="300" r="80"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="2"
                style={{ pathLength }}
              />
              <motion.circle
                cx="400" cy="300" r="40"
                fill="rgba(0, 212, 255, 0)"
                stroke="#00d4ff"
                strokeWidth="1"
                style={{ pathLength, fillOpacity: glowOpacity }}
                filter="url(#glow)"
              />
            </motion.g>

            {/* 标注线与文字 */}
            <motion.g style={{ opacity: labelOpacity1 }}>
              <line x1="150" y1="200" x2="100" y2="150" stroke="#3264ff" strokeWidth="1" />
              <circle cx="100" cy="150" r="3" fill="#3264ff" />
              <text x="90" y="140" fill="#3264ff" fontSize="12" textAnchor="end" fontFamily="monospace">STRUCTURAL FRAME</text>
            </motion.g>

            <motion.g style={{ opacity: labelOpacity2 }}>
              <line x1="400" y1="300" x2="550" y2="100" stroke="#00d4ff" strokeWidth="1" />
              <circle cx="550" cy="100" r="3" fill="#00d4ff" />
              <text x="560" y="100" fill="#00d4ff" fontSize="12" textAnchor="start" fontFamily="monospace">FUSION CORE</text>
            </motion.g>

            <motion.g style={{ opacity: labelOpacity3 }}>
              <line x1="600" y1="450" x2="700" y2="500" stroke="#3264ff" strokeWidth="1" />
              <circle cx="700" cy="500" r="3" fill="#3264ff" />
              <text x="710" y="500" fill="#3264ff" fontSize="12" textAnchor="start" fontFamily="monospace">THERMAL VENT</text>
            </motion.g>
          </svg>
        </div>

        {/* 底部说明 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '50px', 
            width: '100%', 
            textAlign: 'center',
            color: '#3264ff',
            opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1])
          }}
        >
          <div style={{ fontSize: '1.2rem', letterSpacing: '4px', marginBottom: '10px' }}>BLUEPRINT COMPLETE</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>READY FOR PRODUCTION</div>
        </motion.div>

      </div>
    </div>
  );
};

// 4. Sonic Visualization - 品牌官网声波可视化 (Canvas Waveform)
const ScrollTriggeredAudio = () => {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画状态
  const chaosOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const clarityOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.1, 0]); // 背景噪点透明度

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let animationFrameId;
    let time = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const draw = () => {
      // 获取当前滚动进度 (0: 混乱/噪音 -> 1: 纯净/正弦波)
      const progress = scrollYProgress.get();
      
      // 背景清空 (带拖尾效果)
      ctx.fillStyle = `rgba(5, 10, 20, ${0.2 + progress * 0.1})`;
      ctx.fillRect(0, 0, width, height);

      // 绘制参数
      const centerY = height / 2;
      const amplitude = 100 + progress * 50; // 振幅随进度增加
      const frequency = 0.01 + progress * 0.01; // 频率变化
      const noiseLevel = 1 - progress; // 噪音水平 (1 -> 0)
      
      ctx.lineWidth = 2 + progress * 2;
      ctx.strokeStyle = progress > 0.5 
        ? `hsl(${200 + progress * 40}, 100%, 70%)` // 纯净蓝/紫
        : `hsl(0, 0%, ${50 + Math.random() * 50}%)`; // 灰色噪点

      ctx.beginPath();
      for (let x = 0; x < width; x += 5) {
        // 基础正弦波
        let y = Math.sin(x * frequency + time) * amplitude;
        
        // 叠加噪音
        if (noiseLevel > 0.01) {
          y += (Math.random() - 0.5) * 200 * noiseLevel;
          y += Math.sin(x * 0.05 + time * 2) * 50 * noiseLevel;
        }

        // 叠加高次谐波 (增加细节)
        y += Math.sin(x * frequency * 2 + time * 1.5) * (amplitude * 0.3);

        ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();

      // 绘制纯净模式下的光晕
      if (progress > 0.6) {
        ctx.shadowBlur = 20 * progress;
        ctx.shadowColor = '#00d4ff';
      } else {
        ctx.shadowBlur = 0;
      }

      time += 0.05 + progress * 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollYProgress]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#050a14' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* Canvas 层 */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

        {/* 噪点纹理层 (随滚动消失) */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
            opacity: bgOpacity,
            pointerEvents: 'none'
          }} 
        />

        {/* 文字层：CHAOS (混乱) */}
        <motion.div 
          style={{ 
            position: 'absolute',
            color: '#666',
            opacity: chaosOpacity,
            textAlign: 'center',
            zIndex: 10
          }}
        >
          <h2 style={{ fontSize: '8rem', fontWeight: '900', letterSpacing: '10px', filter: 'blur(2px)' }}>NOISE</h2>
          <p style={{ letterSpacing: '5px', textTransform: 'uppercase' }}>Unfiltered Reality</p>
        </motion.div>

        {/* 文字层：CLARITY (纯净) */}
        <motion.div 
          style={{ 
            position: 'absolute',
            color: '#fff',
            opacity: clarityOpacity,
            textAlign: 'center',
            zIndex: 10,
            textShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
          }}
        >
          <h2 style={{ fontSize: '8rem', fontWeight: '900', letterSpacing: '10px' }}>PURITY</h2>
          <p style={{ letterSpacing: '5px', textTransform: 'uppercase', color: '#00d4ff' }}>Active Noise Cancellation</p>
        </motion.div>

        {/* 滚动提示 */}
        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          color: 'rgba(255,255,255,0.3)', 
          fontSize: '0.8rem', 
          letterSpacing: '2px' 
        }}>
          SCROLL TO TUNE FREQUENCY
        </div>

      </div>
    </div>
  );
};

// ============================================
// Phase 2: SVG与绘制类 (SVG & Drawing)
// ============================================

// 5. Global Connectivity - 品牌官网全球连接 (SVG Network)
const SVGPathDrawing = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  const pathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const nodeOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  // 模拟世界地图节点
  const nodes = [
    { x: 400, y: 300, label: 'HQ' }, // 中心
    { x: 250, y: 200, label: 'New York' },
    { x: 550, y: 200, label: 'London' },
    { x: 650, y: 350, label: 'Tokyo' },
    { x: 150, y: 350, label: 'San Francisco' },
    { x: 300, y: 450, label: 'Sao Paulo' },
    { x: 500, y: 450, label: 'Cape Town' },
    { x: 600, y: 500, label: 'Sydney' }
  ];

  // 生成连接线路径
  const generatePaths = () => {
    return nodes.slice(1).map((node, i) => (
      <motion.path
        key={i}
        d={`M 400 300 Q ${400 + (node.x - 400) * 0.5} ${300 + (node.y - 300) * 0.5 - 50} ${node.x} ${node.y}`}
        fill="none"
        stroke="url(#netGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength }}
      />
    ));
  };

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 背景世界地图轮廓 (简化版) */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        <motion.div style={{ position: 'relative', width: '800px', height: '600px', scale }}>
          <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="netGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#00aaff" />
              </linearGradient>
              <filter id="glow-net" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 连接线 */}
            <g filter="url(#glow-net)">
              {generatePaths()}
            </g>

            {/* 节点 */}
            {nodes.map((node, i) => (
              <motion.g key={i} style={{ opacity: i === 0 ? 1 : nodeOpacity }}>
                <circle cx={node.x} cy={node.y} r={i === 0 ? 8 : 5} fill={i === 0 ? "#fff" : "#00aaff"} />
                <circle cx={node.x} cy={node.y} r={i === 0 ? 15 : 10} fill="none" stroke={i === 0 ? "#fff" : "#00aaff"} strokeWidth="1" opacity="0.5">
                  <animate attributeName="r" from={i === 0 ? 15 : 10} to={i === 0 ? 25 : 15} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                <text 
                  x={node.x} 
                  y={node.y + 25} 
                  fill="#fff" 
                  fontSize="12" 
                  textAnchor="middle" 
                  fontFamily="monospace"
                  style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
                >
                  {node.label}
                </text>
              </motion.g>
            ))}
          </svg>
        </motion.div>

        {/* 顶部标题 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '10%', 
            textAlign: 'center',
            color: '#fff',
            zIndex: 10
          }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>GLOBAL CONNECTIVITY</h2>
          <p style={{ color: '#00ff88', letterSpacing: '1px', marginTop: '10px' }}>Seamless Integration Across Borders</p>
        </motion.div>

        {/* 底部数据 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '10%', 
            display: 'flex',
            gap: '50px',
            color: '#fff',
            opacity: textOpacity
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>150+</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>COUNTRIES</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>99.9%</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>UPTIME</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>24/7</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>SUPPORT</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// 6. Organic Adaptability - 品牌官网有机形态衍变 (SVG Morphing)
const SVGMorphing = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, 0]);

  // 复杂有机形状路径
  const shapes = [
    "M 400 200 Q 550 150 600 300 T 400 500 T 200 300 T 400 200", // 初始：类圆形
    "M 400 150 Q 600 100 650 300 T 450 550 T 150 350 T 400 150", // 中间：不规则扩张
    "M 400 250 Q 500 200 550 300 T 400 450 T 250 300 T 400 250"  // 结束：紧凑核心
  ];

  const [pathIndex, setPathIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 确保索引在 0 到 shapes.length - 1 之间
      if (latest < 0.33) setPathIndex(0);
      else if (latest < 0.66) setPathIndex(1);
      else setPathIndex(2);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 确保 pathIndex 有效，防止 undefined 导致的 SVG 渲染错误
  const currentShape = shapes[pathIndex] || shapes[0];

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 背景光晕 */}
        <motion.div 
          style={{ 
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(100,50,255,0.2) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(50px)',
            scale: useTransform(scrollYProgress, [0, 1], [0.5, 1.5])
          }} 
        />

        {/* 有机形态 SVG */}
        <div style={{ position: 'relative', width: '800px', height: '600px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="organicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff00cc" />
                <stop offset="50%" stopColor="#3333ff" />
                <stop offset="100%" stopColor="#00ccff" />
              </linearGradient>
              <filter id="glass">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
              </filter>
            </defs>

            <motion.g 
              style={{ 
                scale, 
                rotate,
                transformOrigin: '400px 300px'
              }}
            >
              {/* 磨砂玻璃层 */}
              <motion.path
                d={currentShape}
                fill="rgba(255, 255, 255, 0.1)"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
                style={{ filter: `blur(${blur}px)` }}
                animate={{ d: currentShape }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              
              {/* 核心渐变层 */}
              <motion.path
                d={currentShape}
                fill="url(#organicGradient)"
                opacity="0.8"
                style={{ mixBlendMode: 'screen' }}
                animate={{ d: currentShape }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.g>
          </svg>
        </div>

        {/* 顶部标题 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '10%', 
            textAlign: 'center',
            color: '#fff',
            zIndex: 10
          }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>ORGANIC ADAPTABILITY</h2>
          <p style={{ color: '#aaddff', letterSpacing: '1px', marginTop: '10px' }}>Form Follows Function</p>
        </motion.div>

        {/* 核心文案 (随形态变化出现) */}
        <motion.div 
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#fff',
            opacity: textOpacity,
            pointerEvents: 'none',
            mixBlendMode: 'overlay'
          }}
        >
          <h3 style={{ fontSize: '4rem', fontWeight: '900', margin: 0 }}>FLUID</h3>
          <div style={{ fontSize: '1.5rem', letterSpacing: '5px' }}>INTERFACE</div>
        </motion.div>

        {/* 底部说明 */}
        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          color: 'rgba(255,255,255,0.4)', 
          fontSize: '0.9rem', 
          maxWidth: '400px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          Our design system adapts organically to any device, context, or user need.
        </div>

      </div>
    </div>
  );
};

// 7. Signature Identity - 品牌官网签名演绎 (SVG Handwriting)
const HandwritingReveal = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#f5f5f7' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 纸张纹理背景 */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.5,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
          mixBlendMode: 'multiply'
        }} />

        <motion.div style={{ position: 'relative', width: '800px', height: '400px', scale }}>
          {/* 签名 SVG */}
          <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="inkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000" />
                <stop offset="100%" stopColor="#333" />
              </linearGradient>
              <filter id="ink-bleed">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
              </filter>
            </defs>

            {/* 优雅的签名路径 (模拟 "Signature") */}
            <motion.path
              d="M 150 250 C 150 250 100 350 200 200 C 250 120 180 150 180 250 C 180 350 300 150 300 150 
                 M 320 250 L 320 200 M 320 250 C 320 250 350 250 350 200 
                 M 370 250 C 370 250 370 200 400 200 C 430 200 430 250 430 250 
                 M 450 250 C 450 250 450 200 480 200 C 510 200 510 250 510 250
                 M 530 220 C 530 220 510 250 550 250 C 590 250 590 200 550 200
                 M 600 150 L 600 250 M 580 200 L 620 200
                 M 640 250 C 640 250 640 200 670 200 C 700 200 700 250 700 250
                 M 720 250 C 720 250 750 250 750 220"
              fill="none"
              stroke="url(#inkGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ink-bleed)"
              style={{ pathLength }}
            />
          </svg>
        </motion.div>

        {/* 顶部标题 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '10%', 
            textAlign: 'center',
            color: '#333',
            zIndex: 10
          }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0, fontFamily: 'serif' }}>SIGNATURE IDENTITY</h2>
          <p style={{ color: '#666', letterSpacing: '1px', marginTop: '10px', fontStyle: 'italic' }}>Personalized. Authentic. Yours.</p>
        </motion.div>

        {/* 底部印章 (随签名完成出现) */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '15%', 
            right: '15%',
            width: '120px',
            height: '120px',
            border: '4px solid #c00',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c00',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            transform: 'rotate(-15deg)',
            opacity,
            // maskImage: 'url("https://www.transparenttextures.com/patterns/grunge-wall.png")', // CORS issue
            // 使用 CSS 渐变模拟磨损效果，避免 CORS 问题
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 150%), linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black)',
            maskSize: '100% 100%, 4px 4px'
          }}
        >
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div>OFFICIAL</div>
            <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>APPROVED</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// ============================================
// Phase 3: 数据可视化类 (Data Visualization)
// ============================================

// 8. Impact Metrics - 品牌官网核心影响力指标 (Typography & Data)
const CounterAnimation = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const targets = [1234, 567, 89, 42];
  const labels = ['Active Users', 'Projects Delivered', 'Global Partners', 'Industry Awards'];
  
  // 动画映射
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [10, 0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 使用缓动函数使数字增长更自然
      const eased = latest < 0.5 ? 2 * latest * latest : -1 + (4 - 2 * latest) * latest;
      setCounts(targets.map(t => Math.floor(t * Math.min(eased * 1.5, 1)))); // *1.5 确保在滚动结束前完成
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={ref} style={{ height: '250vh', position: 'relative', background: '#000', color: '#fff' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 动态背景流 */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.2,
          background: 'linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111)',
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }} />

        <motion.div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '80px',
            scale,
            opacity,
            filter: useTransform(blur, b => `blur(${Math.max(0, b)}px)`)
          }}
        >
          {counts.map((count, i) => (
            <div key={i} style={{ textAlign: 'left', position: 'relative' }}>
              {/* 装饰性线条 */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: i * 0.2 }}
                style={{ height: '2px', background: '#333', marginBottom: '20px' }}
              />
              
              <div style={{ 
                fontSize: 'clamp(4rem, 8vw, 8rem)', 
                fontWeight: '900', 
                lineHeight: 1,
                fontFamily: '"Helvetica Neue", sans-serif',
                background: 'linear-gradient(to right, #fff, #666)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {count.toLocaleString()}
                <span style={{ fontSize: '0.5em', color: '#00aaff', WebkitTextFillColor: '#00aaff' }}>+</span>
              </div>
              
              <div style={{ 
                fontSize: '1.2rem', 
                color: '#888', 
                marginTop: '10px', 
                letterSpacing: '2px', 
                textTransform: 'uppercase' 
              }}>
                {labels[i]}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '1rem', letterSpacing: '4px', color: '#00aaff', margin: 0 }}>IMPACT METRICS</h2>
        </div>

      </div>
    </div>
  );
};

// 9. Market Trends - 品牌官网市场趋势分析 (SVG Area Chart)
const ChartAnimation = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 模拟数据点
  const dataPoints = [
    { x: 0, y: 100 }, { x: 100, y: 80 }, { x: 200, y: 120 }, 
    { x: 300, y: 90 }, { x: 400, y: 150 }, { x: 500, y: 130 }, 
    { x: 600, y: 180 }, { x: 700, y: 160 }, { x: 800, y: 220 }
  ];

  // 生成平滑曲线路径
  const generatePath = (points) => {
    let d = `M ${points[0].x} ${300 - points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = 300 - p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = 300 - p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${300 - p1.y}`;
    }
    return d;
  };

  const linePath = generatePath(dataPoints);
  const areaPath = `${linePath} L 800 300 L 0 300 Z`;

  // 动画映射
  const pathLength = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const cursorX = useTransform(scrollYProgress, [0, 1], [0, 800]);
  
  // 动态数值显示
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 简单估算当前值
      const index = Math.floor(latest * (dataPoints.length - 1));
      const p0 = dataPoints[index];
      const p1 = dataPoints[Math.min(index + 1, dataPoints.length - 1)];
      const ratio = (latest * (dataPoints.length - 1)) - index;
      const val = p0.y + (p1.y - p0.y) * ratio;
      setCurrentValue(Math.round(val));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#050a14' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 背景网格 */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />

        <motion.div style={{ position: 'relative', width: '800px', height: '400px', opacity }}>
          <svg width="100%" height="100%" viewBox="0 0 800 400" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 212, 255, 0.5)" />
                <stop offset="100%" stopColor="rgba(0, 212, 255, 0)" />
              </linearGradient>
              <linearGradient id="lineColor" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>

            {/* 面积图 */}
            <motion.path
              d={areaPath}
              fill="url(#chartGradient)"
              stroke="none"
              initial={{ opacity: 0 }}
              style={{ opacity: useTransform(scrollYProgress, [0.5, 0.8], [0, 1]) }}
            />

            {/* 曲线图 */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="url(#lineColor)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength }}
            />

            {/* 动态光标线 */}
            <motion.line
              x1={cursorX} y1="0"
              x2={cursorX} y2="300"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            
            {/* 动态数据点 */}
            <motion.circle
              cx={cursorX}
              cy={useTransform(cursorX, (x) => {
                // 重新计算 Y 坐标以匹配光标位置 (简化版，实际应使用 getPointAtLength)
                // 这里为了性能直接使用线性插值近似
                const idx = Math.min(Math.floor(x / 100), dataPoints.length - 2);
                const p0 = dataPoints[idx];
                const p1 = dataPoints[idx + 1];
                const r = (x - p0.x) / 100;
                return 300 - (p0.y + (p1.y - p0.y) * r);
              })}
              r="6"
              fill="#fff"
              stroke="#00d4ff"
              strokeWidth="2"
            />
          </svg>

          {/* 悬浮数值面板 */}
          <motion.div
            style={{
              position: 'absolute',
              top: '20px',
              left: cursorX,
              transform: 'translateX(-50%)',
              background: 'rgba(0, 20, 40, 0.8)',
              border: '1px solid #00d4ff',
              padding: '10px 20px',
              borderRadius: '8px',
              color: '#fff',
              backdropFilter: 'blur(5px)',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#888' }}>GROWTH INDEX</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff88' }}>+{currentValue}%</div>
          </motion.div>
        </motion.div>

        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>MARKET TRENDS</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Real-time Financial Analytics</p>
        </div>

      </div>
    </div>
  );
};

// 10. Ecosystem Cycle - 品牌官网生态系统闭环 (Multi-layer Rings)
const ProgressRing = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // 各层级进度
  const p1 = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const p2 = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const p3 = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
  const p4 = useTransform(scrollYProgress, [0.6, 1], [0, 1]);

  // 辅助函数：计算圆环路径
  const getCirclePath = (r) => {
    const c = 2 * Math.PI * r;
    return {
      r,
      c,
      d: `M 300 300 m 0 -${r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 -${2 * r}`
    };
  };

  const rings = [
    { r: 100, color: '#00ff88', label: 'CORE', progress: p1 },
    { r: 160, color: '#00d4ff', label: 'PLATFORM', progress: p2 },
    { r: 220, color: '#3264ff', label: 'SERVICES', progress: p3 },
    { r: 280, color: '#7000ff', label: 'COMMUNITY', progress: p4 },
  ];

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        <motion.div style={{ position: 'relative', width: '600px', height: '600px', scale, opacity }}>
          <svg width="100%" height="100%" viewBox="0 0 600 600" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="glow-ring">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <motion.g style={{ rotate, transformOrigin: '300px 300px' }}>
              {rings.map((ring, i) => {
                const { r, c, d } = getCirclePath(ring.r);
                return (
                  <g key={i}>
                    {/* 背景轨道 */}
                    <path d={d} fill="none" stroke="#1a1a1a" strokeWidth="2" />
                    
                    {/* 进度条 */}
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={c}
                      style={{ 
                        strokeDashoffset: useTransform(ring.progress, p => c * (1 - p)),
                        filter: 'url(#glow-ring)'
                      }}
                    />

                    {/* 装饰性节点 */}
                    <motion.circle
                      r="4"
                      fill="#fff"
                      style={{
                        offsetPath: `path('${d}')`,
                        // 使用 CSS 变量或直接在 style 中设置，但 framer-motion 应该能处理
                        // 如果 React 报错，可能是因为 framer-motion 将其透传给了 DOM
                        // 尝试使用小写 offsetdistance 规避 React 警告，或者确认是否为 framer-motion 版本问题
                        // 这里我们暂时保留 style 写法，但确保它是作为 CSS 属性传递
                        offsetDistance: useTransform(ring.progress, p => `${p * 100}%`)
                      }}
                    />
                  </g>
                );
              })}
            </motion.g>

            {/* 中心 Logo */}
            <circle cx="300" cy="300" r="60" fill="#111" stroke="#333" strokeWidth="2" />
            <text x="300" y="305" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" letterSpacing="2">ECOSYSTEM</text>
          </svg>

          {/* 标签说明 (随进度点亮) */}
          {rings.map((ring, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translateY(-${ring.r + 20}px)`,
                color: ring.color,
                fontSize: '0.8rem',
                fontWeight: 'bold',
                letterSpacing: '1px',
                opacity: ring.progress,
                textShadow: `0 0 10px ${ring.color}`
              }}
            >
              {ring.label}
            </motion.div>
          ))}
        </motion.div>

        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>ECOSYSTEM CYCLE</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Integrated Product Suite</p>
        </div>

      </div>
    </div>
  );
};

// ============================================
// Phase 4: 3D与WebGL类 (3D & WebGL) - 简化版
// ============================================

// 11. Spatial Architecture - 品牌官网空间架构 (CSS 3D)
const Scene3DControl = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // 空间层级数据
  const layers = [
    { z: 150, color: 'rgba(0, 255, 136, 0.1)', border: '#00ff88', title: 'INTERFACE' },
    { z: 50, color: 'rgba(0, 212, 255, 0.1)', border: '#00d4ff', title: 'LOGIC' },
    { z: -50, color: 'rgba(50, 100, 255, 0.1)', border: '#3264ff', title: 'DATA' },
    { z: -150, color: 'rgba(112, 0, 255, 0.1)', border: '#7000ff', title: 'INFRASTRUCTURE' },
  ];

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#050a14' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        perspective: '1200px',
        overflow: 'hidden'
      }}>
        
        {/* 背景网格 */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
          backgroundSize: '60px 60px',
          pointerEvents: 'none'
        }} />

        <motion.div 
          style={{ 
            width: '400px', 
            height: '300px',
            transformStyle: 'preserve-3d',
            rotateY,
            rotateX,
            scale,
            opacity
          }}
        >
          {/* 渲染层级 */}
          {layers.map((layer, i) => (
            <div 
              key={i}
              style={{ 
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: layer.color,
                border: `1px solid ${layer.border}`,
                transform: `translateZ(${layer.z}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 30px ${layer.color}`,
                backdropFilter: 'blur(2px)'
              }}
            >
              <div style={{ 
                color: '#fff', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                letterSpacing: '4px',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}>
                {layer.title}
              </div>
              
              {/* 装饰性角标 */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: `2px solid ${layer.border}`, borderLeft: `2px solid ${layer.border}` }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: `2px solid ${layer.border}`, borderRight: `2px solid ${layer.border}` }} />
            </div>
          ))}

          {/* 连接线 (贯穿所有层级) */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2px',
            height: '300px',
            background: 'linear-gradient(to bottom, #00ff88, #7000ff)',
            transform: 'translate(-50%, -50%) rotateX(90deg) rotateY(90deg)',
            transformOrigin: 'center'
          }} />
        </motion.div>

        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>SPATIAL ARCHITECTURE</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Multi-dimensional System Design</p>
        </div>

      </div>
    </div>
  );
};

// 12. Product 360 Showcase - 品牌官网产品360度展示 (CSS 3D)
const Model3DRotation = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        perspective: '1500px',
        overflow: 'hidden'
      }}>
        
        {/* 背景光效 */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '600px', 
          height: '600px', 
          background: 'radial-gradient(circle, rgba(50, 100, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        {/* 3D 手机模型容器 */}
        <motion.div 
          style={{ 
            width: '300px', 
            height: '600px',
            transformStyle: 'preserve-3d',
            rotateY,
            scale,
            opacity
          }}
        >
          {/* 正面 (屏幕) */}
          <div style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#111',
            borderRadius: '40px',
            border: '2px solid #333',
            transform: 'translateZ(15px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}>
            {/* 屏幕内容 */}
            <div style={{ 
              flex: 1, 
              background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundImage: 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80")',
                backgroundSize: 'cover',
                opacity: 0.8
              }} />
              <div style={{ position: 'absolute', bottom: '40px', left: '0', width: '100%', textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12:45</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Wednesday, July 12</div>
              </div>
            </div>
            {/* 顶部刘海 */}
            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '25px', background: '#000', borderRadius: '12px', zIndex: 10 }} />
          </div>

          {/* 背面 */}
          <div style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #222 0%, #111 100%)',
            borderRadius: '40px',
            border: '2px solid #333',
            transform: 'translateZ(-15px) rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#444', transform: 'rotateY(180deg)' }}>LOGO</div>
            {/* 摄像头模块 */}
            <div style={{ position: 'absolute', top: '30px', left: '30px', width: '80px', height: '80px', background: '#000', borderRadius: '20px', border: '1px solid #333' }} />
          </div>

          {/* 侧面 (构建厚度) */}
          <div style={{ position: 'absolute', width: '30px', height: '100%', background: '#333', transform: 'rotateY(90deg) translateZ(150px)', left: '135px' }} />
          <div style={{ position: 'absolute', width: '30px', height: '100%', background: '#333', transform: 'rotateY(-90deg) translateZ(150px)', left: '135px' }} />
          <div style={{ position: 'absolute', width: '100%', height: '30px', background: '#333', transform: 'rotateX(90deg) translateZ(15px)', top: '-15px', borderRadius: '10px' }} />
          <div style={{ position: 'absolute', width: '100%', height: '30px', background: '#333', transform: 'rotateX(-90deg) translateZ(585px)', top: '-15px', borderRadius: '10px' }} />

        </motion.div>

        {/* 浮动文案 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '100px', 
            textAlign: 'center',
            color: '#fff',
            y: textY,
            opacity
          }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>ULTRA SLIM</h2>
          <p style={{ color: '#888', marginTop: '10px' }}>Precision Engineered. 360° View.</p>
        </motion.div>

        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>PRODUCT SHOWCASE</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Interactive 3D Experience</p>
        </div>

      </div>
    </div>
  );
};

// 13. Data Constellation - 品牌官网数据星座 (Particle Network)
const ParticleSystem = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 生成球体表面的点
  const particles = Array.from({ length: 100 }, (_, i) => {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 200;
    return {
      id: i,
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      size: Math.random() * 3 + 1,
    };
  });

  // 动画映射
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const dispersion = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, 2]); // 0: 聚合成球, 2: 散开
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const lineOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 0.5]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        perspective: '1000px'
      }}>
        
        {/* 粒子容器 */}
        <motion.div 
          style={{ 
            position: 'relative', 
            width: '400px', 
            height: '400px',
            transformStyle: 'preserve-3d',
            rotateY,
            rotateX,
            opacity
          }}
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 0 10px #00aaff',
                x: useTransform(dispersion, d => p.x * (1 + d)),
                y: useTransform(dispersion, d => p.y * (1 + d)),
                z: useTransform(dispersion, d => p.z * (1 + d)),
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* 核心连接线 (仅在聚拢时显示) */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              border: '1px solid rgba(0, 170, 255, 0.3)', 
              borderRadius: '50%',
              transform: 'rotateX(90deg)',
              opacity: lineOpacity
            }} 
          />
          <motion.div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              border: '1px solid rgba(0, 170, 255, 0.3)', 
              borderRadius: '50%',
              opacity: lineOpacity
            }} 
          />
        </motion.div>

        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>DATA CONSTELLATION</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Organizing Chaos into Value</p>
        </div>

        {/* 底部文案 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '100px', 
            textAlign: 'center',
            color: '#fff',
            opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
          }}
        >
          <h3 style={{ fontSize: '1.5rem', letterSpacing: '4px', fontWeight: '300' }}>GLOBAL INTELLIGENCE</h3>
        </motion.div>

      </div>
    </div>
  );
};

// ============================================
// Phase 5: 交互增强类 (Interaction Enhancement)
// ============================================

// 14. Immersive Chapter Narrative - 品牌官网沉浸式章节叙事 (Scroll Snap)
const ScrollSnapSections = () => {
  const sections = [
    { 
      id: '01', 
      title: 'VISION', 
      subtitle: 'The Future of Design', 
      desc: 'We envision a world where technology and humanity coexist in perfect harmony.',
      bg: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      accent: '#fff'
    },
    { 
      id: '02', 
      title: 'CRAFT', 
      subtitle: 'Precision Engineering', 
      desc: 'Every pixel, every interaction, meticulously crafted for the ultimate experience.',
      bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      accent: '#00aaff'
    },
    { 
      id: '03', 
      title: 'IMPACT', 
      subtitle: 'Global Reach', 
      desc: 'Empowering millions of users worldwide to achieve more with less.',
      bg: 'linear-gradient(135deg, #2d2d2d 0%, #000000 100%)',
      accent: '#00ff88'
    },
  ];

  return (
    <div style={{ 
      height: '300vh',
      scrollSnapType: 'y mandatory',
      overflowY: 'scroll',
      position: 'relative',
      background: '#000'
    }}>
      {/* 固定进度指示器 */}
      <div style={{ 
        position: 'sticky', 
        top: '50%', 
        left: '40px', 
        transform: 'translateY(-50%)', 
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {sections.map((_, i) => (
          <div key={i} style={{ width: '4px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
            <motion.div 
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              viewport={{ margin: "-50% 0px -50% 0px" }} // 当章节进入视口中心时激活
              transition={{ duration: 0.5 }}
              style={{ width: '100%', background: '#fff', borderRadius: '2px' }}
            />
          </div>
        ))}
      </div>

      {sections.map((section, i) => (
        <div 
          key={i}
          style={{ 
            height: '100vh',
            scrollSnapAlign: 'start',
            background: section.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* 装饰性大字背景 */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.2 }}
            whileInView={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ 
              position: 'absolute', 
              fontSize: '30vw', 
              fontWeight: '900', 
              color: '#fff', 
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}
          >
            {section.title}
          </motion.div>

          <div style={{ textAlign: 'center', zIndex: 10, maxWidth: '800px', padding: '0 20px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: section.accent, letterSpacing: '4px', marginBottom: '20px', fontWeight: 'bold' }}
            >
              CHAPTER {section.id} — {section.subtitle}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', margin: '0 0 30px 0', color: '#fff', lineHeight: 1.1 }}
            >
              {section.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: '1.2rem', color: '#fff', lineHeight: 1.6 }}
            >
              {section.desc}
            </motion.p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 15. Focus Lens - 品牌官网焦点透镜 (Magnification Effect)
const MagneticScroll = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const items = [
    { id: 1, title: 'Strategy', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Develop', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Launch', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80' },
    { id: 5, title: 'Grow', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80' }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.round(latest * (items.length - 1));
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, items.length]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>FOCUS LENS</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Highlighting Key Processes</p>
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {items.map((item, i) => {
            const isActive = activeIndex === i;
            const distance = Math.abs(activeIndex - i);
            
            return (
              <motion.div
                key={i}
                animate={{
                  scale: isActive ? 1.5 : 1 - distance * 0.1,
                  opacity: isActive ? 1 : 0.3 - distance * 0.1,
                  filter: isActive ? 'blur(0px)' : 'blur(4px)',
                  zIndex: isActive ? 10 : 1
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  width: '200px',
                  height: '300px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundImage: `url(${item.img})`,
                  backgroundSize: 'cover',
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

// 16. Smart Navigation Response - 品牌官网智能导航响应 (Dynamic Island)
const ScrollDirectionAnimation = () => {
  const [scrollDir, setScrollDir] = useState('none');
  const [lastScrollY, setLastScrollY] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 5; // 滚动阈值
      
      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        if (currentScrollY > lastScrollY) {
          setScrollDir('down');
        } else {
          setScrollDir('up');
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div ref={ref} style={{ height: '200vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>SMART NAVIGATION</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Context-Aware UI Elements</p>
        </div>

        {/* 模拟页面内容 */}
        <div style={{ width: '60%', textAlign: 'center', color: '#444', marginBottom: '100px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Scroll Up or Down to Interact</div>
          <div style={{ height: '2px', background: '#222', width: '100%' }} />
        </div>

        {/* 智能动态岛 */}
        <motion.div
          animate={{
            width: scrollDir === 'up' ? '400px' : '120px',
            height: scrollDir === 'up' ? '80px' : '40px',
            y: scrollDir === 'up' ? 0 : 20,
            backgroundColor: scrollDir === 'up' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            borderRadius: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          {/* 紧凑状态 (向下滚动) */}
          <motion.div
            animate={{ opacity: scrollDir === 'up' ? 0 : 1, scale: scrollDir === 'up' ? 0.8 : 1 }}
            style={{ position: 'absolute', left: '50%', x: '-50%', display: 'flex', gap: '5px', alignItems: 'center' }}
          >
            <div style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%' }} />
            <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>Reading</span>
          </motion.div>

          {/* 展开状态 (向上滚动) */}
          <motion.div
            animate={{ opacity: scrollDir === 'up' ? 1 : 0, y: scrollDir === 'up' ? 0 : 20 }}
            style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                👤
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>Welcome Back</div>
                <div style={{ color: '#888', fontSize: '0.7rem' }}>Premium Member</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', background: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Menu</button>
              <button style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer' }}>Share</button>
            </div>
          </motion.div>
        </motion.div>

        <p style={{ color: '#666', marginTop: '60px', fontSize: '0.9rem' }}>
          {scrollDir === 'up' ? 'Expanded Controls (Scroll Up)' : 'Minimal Indicator (Scroll Down)'}
        </p>

      </div>
    </div>
  );
};

// 17. Velocity Typography - 品牌官网极速排版 (Scroll Velocity)
const ScrollVelocityEffects = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  
  const [velocity, setVelocity] = useState(0);
  const prevProgress = useRef(0);
  const prevTime = useRef(Date.now());

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const now = Date.now();
      const dt = now - prevTime.current;
      if (dt > 0) {
        const dp = latest - prevProgress.current; // 保留方向
        const v = (dp / dt) * 100000; // 放大系数
        setVelocity(v);
      }
      prevProgress.current = latest;
      prevTime.current = now;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 动态样式
  const skewX = velocity * 0.5; // 倾斜
  const blur = Math.abs(velocity) * 0.05; // 模糊
  const rgbOffset = Math.abs(velocity) * 0.5; // 色散偏移

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000', overflow: 'hidden' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>VELOCITY TYPOGRAPHY</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Scroll Fast to See Effect</p>
        </div>

        {/* 极速排版容器 */}
        <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
          {['SPEED', 'PRECISION', 'MOMENTUM'].map((text, i) => (
            <motion.div
              key={i}
              animate={{ 
                skewX: i % 2 === 0 ? -skewX : skewX, // 交错倾斜
                x: i % 2 === 0 ? velocity * 2 : -velocity * 2 // 交错位移
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              style={{
                fontSize: 'clamp(4rem, 12vw, 12rem)',
                fontWeight: '900',
                lineHeight: 0.9,
                color: 'transparent',
                WebkitTextStroke: '2px #fff',
                position: 'relative',
                filter: `blur(${blur}px)`,
                marginBottom: '20px'
              }}
            >
              {/* RGB 色散层 (红色) */}
              <motion.span 
                animate={{ x: -rgbOffset, opacity: Math.min(Math.abs(velocity) * 0.01, 0.8) }}
                style={{ position: 'absolute', left: 0, top: 0, color: '#ff0000', mixBlendMode: 'screen', WebkitTextStroke: '0' }}
              >
                {text}
              </motion.span>
              
              {/* RGB 色散层 (青色) */}
              <motion.span 
                animate={{ x: rgbOffset, opacity: Math.min(Math.abs(velocity) * 0.01, 0.8) }}
                style={{ position: 'absolute', left: 0, top: 0, color: '#00ffff', mixBlendMode: 'screen', WebkitTextStroke: '0' }}
              >
                {text}
              </motion.span>

              {/* 主文字 */}
              <span style={{ position: 'relative', zIndex: 10 }}>{text}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          width: '200px', 
          height: '4px', 
          background: '#333', 
          borderRadius: '2px', 
          overflow: 'hidden' 
        }}>
          <motion.div 
            animate={{ 
              width: `${Math.min(Math.abs(velocity), 100)}%`,
              x: velocity > 0 ? 0 : '100%' // 根据方向改变起始点 (简化处理)
            }}
            style={{ 
              height: '100%', 
              background: '#fff', 
              borderRadius: '2px',
              transformOrigin: velocity > 0 ? 'left' : 'right'
            }}
          />
        </div>

      </div>
    </div>
  );
};

// ============================================
// Phase 6: 图片处理类 (Image Processing)
// ============================================

// 18. Cinematic Storytelling - 品牌官网电影级叙事 (Ken Burns)
const KenBurnsEffect = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 镜头运动
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.4]); // 缓慢推进
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']); // 缓慢下移
  
  // 文字淡入淡出
  const textOpacity1 = useTransform(scrollYProgress, [0.1, 0.3, 0.4], [0, 1, 0]);
  const textOpacity2 = useTransform(scrollYProgress, [0.4, 0.6, 0.7], [0, 1, 0]);
  const textOpacity3 = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  return (
    <div ref={ref} style={{ height: '400vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        overflow: 'hidden' 
      }}>
        
        {/* 电影级背景图 */}
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")', // 宇宙/地球高质量图
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            scale,
            y,
            filter: 'brightness(0.6) contrast(1.2)'
          }}
        />

        {/* 叙事字幕层 */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          
          {/* 第一幕 */}
          <motion.div style={{ position: 'absolute', opacity: textOpacity1, textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#fff', letterSpacing: '5px', marginBottom: '20px' }}>THE BEGINNING</h2>
            <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>It started with a single idea.</p>
          </motion.div>

          {/* 第二幕 */}
          <motion.div style={{ position: 'absolute', opacity: textOpacity2, textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#fff', letterSpacing: '5px', marginBottom: '20px' }}>THE JOURNEY</h2>
            <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>Across galaxies and time.</p>
          </motion.div>

          {/* 第三幕 */}
          <motion.div style={{ position: 'absolute', opacity: textOpacity3, textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#fff', letterSpacing: '5px', marginBottom: '20px' }}>THE FUTURE</h2>
            <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>Is now in your hands.</p>
            <button style={{ 
              marginTop: '40px', 
              padding: '15px 40px', 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              borderRadius: '30px', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              cursor: 'pointer',
              pointerEvents: 'auto'
            }}>
              EXPLORE
            </button>
          </motion.div>

        </div>

        {/* 电影遮幅 (Letterbox) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10vh', background: '#000', zIndex: 10 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '10vh', background: '#000', zIndex: 10 }} />

      </div>
    </div>
  );
};

// 19. Evolution Slider - 品牌官网产品迭代对比 (Before/After)
const BeforeAfterSlider = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const sliderPos = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px', zIndex: 20 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>EVOLUTION</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>From Concept to Reality</p>
        </div>

        <motion.div style={{ position: 'relative', width: '800px', height: '500px', borderRadius: '20px', overflow: 'hidden', scale }}>
          
          {/* Before: 线框图/概念图 */}
          <div style={{ 
            position: 'absolute',
            inset: 0,
            background: '#111',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: '300px', 
              height: '300px', 
              border: '2px dashed #444', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#444',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>
              WIREFRAME
            </div>
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#666', fontWeight: 'bold' }}>PHASE 1: CONCEPT</div>
          </div>

          {/* After: 渲染图/实物图 */}
          <motion.div 
            style={{ 
              position: 'absolute',
              inset: 0,
              background: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")', // 抽象流体艺术图
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ 
              width: '300px', 
              height: '300px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.5)'
            }}>
              REALITY
            </div>
            <div style={{ position: 'absolute', bottom: '30px', right: '30px', color: '#fff', fontWeight: 'bold' }}>PHASE 2: FINAL</div>
          </motion.div>

          {/* 分割线手柄 */}
          <motion.div 
            style={{ 
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '4px',
              background: '#fff',
              left: sliderPos,
              boxShadow: '0 0 20px rgba(255,255,255,0.5)',
              zIndex: 10
            }}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              background: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8L22 12L18 16" />
                <path d="M6 8L2 12L6 16" />
              </svg>
            </div>
          </motion.div>

        </motion.div>

        <p style={{ position: 'absolute', bottom: '50px', color: '#666', fontSize: '0.9rem' }}>Scroll to Compare</p>

      </div>
    </div>
  );
};

// 20. Day/Night Cycle - 品牌官网日夜交替 (Theme Transition)
const ImageComparisonMorph = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 动画映射
  const sunY = useTransform(scrollYProgress, [0, 0.5], ['20%', '150%']); // 太阳落下
  const moonY = useTransform(scrollYProgress, [0.5, 1], ['150%', '20%']); // 月亮升起
  const skyColor = useTransform(scrollYProgress, [0, 0.5, 1], ['#87CEEB', '#FF7F50', '#0f0c29']); // 天空颜色：蓝 -> 橙 -> 黑
  const starOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]); // 星星显现
  const uiColor = useTransform(scrollYProgress, [0, 0.5, 1], ['#333', '#fff', '#fff']); // UI 文字颜色

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative' }}>
      <motion.div 
        style={{ 
          position: 'sticky', 
          top: '80px', 
          height: 'calc(100vh - 80px)', 
          background: skyColor,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        
        {/* 天体层 */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* 太阳 */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              left: '50%', 
              top: sunY, 
              x: '-50%',
              width: '150px', 
              height: '150px', 
              background: '#FFD700', 
              borderRadius: '50%',
              boxShadow: '0 0 60px #FFD700'
            }} 
          />
          {/* 月亮 */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              left: '50%', 
              top: moonY, 
              x: '-50%',
              width: '120px', 
              height: '120px', 
              background: '#F4F6F0', 
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(255,255,255,0.5)'
            }} 
          />
          {/* 星星 */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              opacity: starOpacity,
              backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} 
          />
        </div>

        {/* UI 内容层 */}
        <motion.div style={{ zIndex: 10, textAlign: 'center', color: uiColor }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 'bold', margin: 0 }}>24/7 MONITORING</h2>
          <p style={{ fontSize: '1.5rem', marginTop: '20px', opacity: 0.8 }}>
            Day or Night, We've Got You Covered.
          </p>
          
          {/* 模拟时钟/状态卡片 */}
          <div style={{ 
            marginTop: '60px', 
            background: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)', 
            padding: '30px 60px', 
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            gap: '40px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>STATUS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00ff88' }}>ACTIVE</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>UPTIME</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>100%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>THREATS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>0</div>
            </div>
          </div>
        </motion.div>

        {/* 顶部标题 */}
        <motion.div style={{ position: 'absolute', top: '50px', left: '50px', color: uiColor }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>DAY/NIGHT CYCLE</h2>
          <p style={{ marginTop: '5px', opacity: 0.7 }}>Dynamic Theme Adaptation</p>
        </motion.div>

      </motion.div>
    </div>
  );
};

// ============================================
// Phase 7: 页面结构类 (Page Structure)
// ============================================

// 21. Immersive Storybook - 品牌官网沉浸式故事书 (3D Flip)
const PageTurning = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const pages = [
    { 
      id: 1, 
      title: 'Chapter I', 
      subtitle: 'The Origin', 
      text: 'In the beginning, there was only a vision. A spark of creativity that ignited a revolution in design thinking.',
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 2, 
      title: 'Chapter II', 
      subtitle: 'The Process', 
      text: 'Through tireless iteration and refinement, we sculpted raw ideas into tangible reality, pixel by pixel.',
      img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 3, 
      title: 'Chapter III', 
      subtitle: 'The Result', 
      text: 'A masterpiece of form and function. An experience that transcends the screen and touches the soul.',
      img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=600&q=80'
    },
  ];

  // 计算当前页码 (0, 1, 2)
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const pageIndex = Math.min(Math.floor(latest * pages.length), pages.length - 1);
      setCurrentPage(pageIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress, pages.length]);

  return (
    <div ref={ref} style={{ height: '400vh', position: 'relative', background: '#1a1a1a' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        perspective: '2000px',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px', color: '#fff' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>IMMERSIVE STORYBOOK</h2>
          <p style={{ marginTop: '5px', opacity: 0.7 }}>Scroll to Read</p>
        </div>

        {/* 书籍容器 */}
        <div style={{ position: 'relative', width: '800px', height: '500px', transformStyle: 'preserve-3d' }}>
          {pages.map((page, i) => {
            // 计算每一页的翻转角度
            // 0: 未翻 (0deg), 1: 翻过 (-180deg)
            // 使用 useTransform 动态计算，实现平滑跟随
            const pageStart = i / pages.length;
            const pageEnd = (i + 1) / pages.length;
            const rotateY = useTransform(
              scrollYProgress,
              [pageStart, pageEnd],
              [0, -180]
            );

            // 阴影变化
            const shadowOpacity = useTransform(
              scrollYProgress,
              [pageStart, pageStart + 0.1],
              [0, 0.5]
            );

            return (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0, // 锚点在右侧 (书脊)
                  width: '50%',
                  height: '100%',
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  rotateY: i < pages.length - 1 ? rotateY : 0, // 最后一页不翻转
                  zIndex: pages.length - i
                }}
              >
                {/* 正面 (内容页) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#fff',
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '40px',
                  boxSizing: 'border-box',
                  borderRight: '1px solid #eee',
                  boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.05)' // 书脊阴影
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    {page.title}
                  </div>
                  <h3 style={{ fontSize: '2.5rem', fontFamily: 'serif', margin: '0 0 20px 0', color: '#111' }}>
                    {page.subtitle}
                  </h3>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    backgroundImage: `url(${page.img})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    marginBottom: '30px',
                    filter: 'grayscale(100%) contrast(1.2)'
                  }} />
                  <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#444', fontFamily: 'serif' }}>
                    {page.text}
                  </p>
                  <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.9rem', color: '#ccc' }}>
                    {i + 1}
                  </div>
                </div>

                {/* 背面 (下一页的左侧/背面) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#f8f8f8',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderLeft: '1px solid #ddd',
                  boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* 简单的背面纹理 */}
                  <div style={{ width: '80%', height: '80%', border: '1px solid #eee' }} />
                </div>

                {/* 动态阴影层 (翻页时加深) */}
                <motion.div 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: '#000', 
                    opacity: shadowOpacity, 
                    pointerEvents: 'none',
                    backfaceVisibility: 'hidden'
                  }} 
                />
              </motion.div>
            );
          })}

          {/* 封底 (固定在左侧) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            background: '#fff',
            zIndex: 0,
            boxShadow: '-10px 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#eee',
            fontSize: '3rem',
            fontWeight: 'bold'
          }}>
            <div style={{ transform: 'rotate(-90deg)', opacity: 0.1 }}>STORY</div>
          </div>

        </div>

      </div>
    </div>
  );
};

// 22. Infinite Brand Gallery - 品牌官网无限品牌长廊 (Parallax Loop)
const InfiniteLoopScroll = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const [offset, setOffset] = useState(0);

  // 模拟高质量品牌图片
  const images = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', // Red Shoe
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', // Headphones
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80', // Watch
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80', // Camera
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80', // Plant
  ];

  // 复制多份以实现无缝循环
  const tripleImages = [...images, ...images, ...images, ...images];

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 映射滚动进度到水平位移
      setOffset(latest * -1000); // 调整速度
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px', zIndex: 10 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>INFINITE GALLERY</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Curated Collection</p>
        </div>

        {/* 无限滚动容器 */}
        <div style={{ 
          display: 'flex', 
          gap: '40px',
          transform: `translateX(${offset}px)`,
          willChange: 'transform'
        }}>
          {tripleImages.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '300px',
                height: '400px',
                borderRadius: '20px',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(20%) contrast(1.1)'
              }} />
              
              {/* 悬停遮罩 */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                opacity: 0.6
              }} />
              
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#fff' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px' }}>Collection</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Item {i % images.length + 1}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部进度条 */}
        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          width: '300px', 
          height: '2px', 
          background: '#333',
          borderRadius: '1px',
          overflow: 'hidden'
        }}>
          <motion.div 
            style={{ 
              height: '100%', 
              background: '#fff', 
              width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) 
            }} 
          />
        </div>

      </div>
    </div>
  );
};

// 23. Vertical Storytelling - 品牌官网全屏纵向叙事 (Apple Style)
const ScrollHijacking = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const steps = [
    { 
      id: '01', 
      title: 'Design', 
      desc: 'Crafted with precision.', 
      img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80' 
    },
    { 
      id: '02', 
      title: 'Performance', 
      desc: 'Unleash the power within.', 
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80' 
    },
    { 
      id: '03', 
      title: 'Connectivity', 
      desc: 'Stay connected, everywhere.', 
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80' 
    },
    { 
      id: '04', 
      title: 'Sustainability', 
      desc: 'Designed for the planet.', 
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80' 
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const step = Math.min(Math.floor(latest * steps.length), steps.length - 1);
      setActiveStep(step);
    });
    return () => unsubscribe();
  }, [scrollYProgress, steps.length]);

  return (
    <div ref={ref} style={{ height: '400vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 背景图片切换 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${steps[activeStep].img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(50%)'
            }}
          />
        </AnimatePresence>

        {/* 内容切换 */}
        <div style={{ zIndex: 10, textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div style={{ color: '#00aaff', fontSize: '1rem', letterSpacing: '4px', marginBottom: '20px', fontWeight: 'bold' }}>
                {steps[activeStep].id}
              </div>
              <h2 style={{ 
                fontSize: 'clamp(3rem, 8vw, 6rem)', 
                fontWeight: '900', 
                color: '#fff', 
                margin: '0 0 20px 0',
                lineHeight: 1.1
              }}>
                {steps[activeStep].title}
              </h2>
              <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)', fontWeight: '300' }}>
                {steps[activeStep].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 侧边进度条 */}
        <div style={{ 
          position: 'absolute', 
          right: '50px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }}>
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: i === activeStep ? '40px' : '10px',
                background: i === activeStep ? '#fff' : 'rgba(255,255,255,0.2)'
              }}
              style={{ width: '4px', borderRadius: '2px' }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

// ============================================
// Phase 8: 特效类 (Special Effects)
// ============================================

// 24. Milestone Celebration - 品牌官网里程碑时刻 (3D Badge & Particles)
const ConfettiCelebration = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const [triggered, setTriggered] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.5 && !triggered) {
        setTriggered(true);
        // 生成金色粒子
        const newParticles = Array.from({ length: 100 }, (_, i) => ({
          id: i,
          x: 50, // 从中心出发
          y: 50,
          angle: Math.random() * 360,
          velocity: Math.random() * 20 + 10,
          size: Math.random() * 6 + 2,
          color: Math.random() > 0.5 ? '#FFD700' : '#FFF', // 金色和白色
        }));
        setParticles(newParticles);
      } else if (latest < 0.3) {
        setTriggered(false);
        setParticles([]);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, triggered]);

  return (
    <div ref={ref} style={{ height: '200vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        perspective: '1000px'
      }}>
        
        {/* 粒子爆炸 */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: '0vw', y: '0vh', opacity: 1, scale: 0 }}
            animate={{ 
              x: `${Math.cos(p.angle * Math.PI / 180) * p.velocity}vw`, 
              y: `${Math.sin(p.angle * Math.PI / 180) * p.velocity}vh`, 
              opacity: 0,
              scale: 1
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              boxShadow: `0 0 10px ${p.color}`
            }}
          />
        ))}

        {/* 3D 徽章 */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ 
            rotateY: triggered ? 0 : 90, 
            opacity: triggered ? 1 : 0,
            scale: triggered ? 1 : 0.8
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255,255,255,0.5)',
            border: '4px solid #FFF',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '10px' }}>🏆</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            1 MILLION
          </div>
          <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', letterSpacing: '2px' }}>
            USERS
          </div>
          
          {/* 光泽扫过动画 */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              transform: 'skewX(-20deg)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>
        
        {/* 底部文案 */}
        <motion.div 
          animate={{ opacity: triggered ? 1 : 0, y: triggered ? 0 : 20 }}
          transition={{ delay: 0.5 }}
          style={{ position: 'absolute', bottom: '100px', color: '#FFD700', fontSize: '1.2rem', letterSpacing: '4px' }}
        >
          MILESTONE ACHIEVED
        </motion.div>

      </div>
    </div>
  );
};

// 25. Cyber Glitch Art - 品牌官网赛博故障艺术 (RGB Split & Slice)
const GlitchEffect = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const [intensity, setIntensity] = useState(0);
  const [sliceOffset, setSliceOffset] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 滚动越快或越接近中心，故障越强
      const val = latest < 0.5 ? latest * 2 : (1 - latest) * 2;
      setIntensity(val);
      
      // 随机切片位移
      if (Math.random() > 0.5) {
        setSliceOffset((Math.random() - 0.5) * 20 * val);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 动态样式
  const skew = intensity * 20;
  const rgbShift = intensity * 10;

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        flexDirection: 'column'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px', zIndex: 10 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>CYBER GLITCH</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Digital Distortion Art</p>
        </div>

        <div style={{ position: 'relative', mixBlendMode: 'lighten' }}>
          
          {/* 红色通道 (左移) */}
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: -rgbShift,
              color: '#ff0000',
              fontSize: '8rem',
              fontWeight: '900',
              letterSpacing: '10px',
              opacity: 0.8,
              mixBlendMode: 'screen',
              clipPath: `inset(${10 + sliceOffset}% 0 ${40 - sliceOffset}% 0)`
            }}
          >
            SYSTEM_ERROR
          </motion.div>

          {/* 蓝色通道 (右移) */}
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: rgbShift,
              color: '#00ffff',
              fontSize: '8rem',
              fontWeight: '900',
              letterSpacing: '10px',
              opacity: 0.8,
              mixBlendMode: 'screen',
              clipPath: `inset(${40 - sliceOffset}% 0 ${10 + sliceOffset}% 0)`
            }}
          >
            SYSTEM_ERROR
          </motion.div>

          {/* 绿色通道 (微调) */}
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#00ff00',
              fontSize: '8rem',
              fontWeight: '900',
              letterSpacing: '10px',
              opacity: 0.5,
              mixBlendMode: 'screen',
              transform: `skewX(${skew}deg)`
            }}
          >
            SYSTEM_ERROR
          </motion.div>

          {/* 主体文字 (白色) */}
          <div style={{
            color: '#fff',
            fontSize: '8rem',
            fontWeight: '900',
            letterSpacing: '10px',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 0 20px rgba(255,255,255,0.5)'
          }}>
            SYSTEM_ERROR
          </div>

          {/* 随机横线干扰 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '-10%',
            width: '120%',
            height: '2px',
            background: '#fff',
            transform: `translateY(${sliceOffset * 5}px)`,
            opacity: intensity > 0.5 ? 1 : 0
          }} />

        </div>

        {/* 底部警告 */}
        <div style={{ 
          marginTop: '50px', 
          background: '#ff0000', 
          color: '#000', 
          padding: '5px 15px', 
          fontWeight: 'bold',
          fontSize: '1.2rem',
          opacity: intensity
        }}>
          CRITICAL FAILURE DETECTED
        </div>

      </div>
    </div>
  );
};

// 26. Vintage Film Grain - 品牌官网复古胶片质感 (SVG Filter)
const NoiseGrainOverlay = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setIntensity(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 动态样式
  const sepia = intensity * 0.8;
  const contrast = 1 + intensity * 0.4;
  const vignette = intensity * 0.8;

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        height: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        
        {/* 顶部标题 */}
        <div style={{ position: 'absolute', top: '50px', left: '50px', zIndex: 10 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>VINTAGE FILM</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>Cinematic Grain & Texture</p>
        </div>

        {/* 胶片内容容器 */}
        <div style={{
          width: '800px',
          height: '500px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          {/* 原始图片 */}
          <div style={{
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop")', // 复古街道
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `sepia(${sepia}) contrast(${contrast})`
          }} />
          
          {/* 动态噪点层 (SVG 滤镜) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: intensity * 0.6,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            mixBlendMode: 'overlay'
          }} />
          
          {/* 动态划痕 (模拟) */}
          <motion.div 
            animate={{ x: ['0%', '100%'], opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'rgba(255,255,255,0.3)',
              left: '20%',
              opacity: intensity > 0.5 ? 1 : 0
            }}
          />

          {/* 暗角效果 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle, transparent 50%, rgba(0,0,0,${vignette}) 100%)`,
            pointerEvents: 'none'
          }} />

          {/* 胶片边框 */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '40px',
            background: '#111',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px 0'
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width: '20px', height: '30px', background: '#fff', borderRadius: '2px' }} />
            ))}
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '40px',
            background: '#111',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px 0'
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width: '20px', height: '30px', background: '#fff', borderRadius: '2px' }} />
            ))}
          </div>

        </div>
        
        {/* 底部说明 */}
        <div style={{ position: 'absolute', bottom: '50px', color: '#666', fontSize: '0.9rem', letterSpacing: '2px' }}>
          FILM STOCK: KODAK PORTRA 400
        </div>

      </div>
    </div>
  );
};

// ============================================
// 章节分隔组件
// ============================================
const SectionDivider = ({ title, phaseNumber, description }) => (
  <div style={{ 
    height: '60vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'column',
    background: `linear-gradient(135deg, hsl(${phaseNumber * 40}, 60%, 15%) 0%, #0a0a0a 100%)`,
    borderTop: '1px solid #333',
    borderBottom: '1px solid #333'
  }}>
    <span style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>PHASE {phaseNumber}</span>
    <h2 style={{ fontSize: '3rem', margin: 0, color: '#fff' }}>{title}</h2>
    <p style={{ color: '#666', marginTop: '15px', maxWidth: '500px', textAlign: 'center' }}>{description}</p>
  </div>
);

// ============================================
// 主页面组件
// ============================================
const ScrollytellingAdvanced = () => {
  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)'
      }}>
        <Link to="/showcase-demos" style={{ position: 'absolute', top: '30px', left: '30px', color: '#666', textDecoration: 'none' }}>
          ← 返回目录
        </Link>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', margin: 0, textAlign: 'center' }}
        >
          Scrollytelling
          <br />
          <span style={{ color: '#667eea' }}>Advanced</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ color: '#666', fontSize: '1.2rem', marginTop: '20px' }}
        >
          26 种进阶滚动叙事技术
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ position: 'absolute', bottom: '50px', color: '#444' }}
        >
          ↓ 向下滚动开始探索
        </motion.div>
      </div>

      {/* Phase 1: 媒体控制类 */}
      <SectionDivider 
        phaseNumber={1} 
        title="媒体控制类" 
        description="滚动控制视频、图片序列、动画和音效"
      />
      <ScrollDrivenVideo />
      <ImageSequenceFrame />
      <LottieAnimationControl />
      <ScrollTriggeredAudio />

      {/* Phase 2: SVG与绘制类 */}
      <SectionDivider 
        phaseNumber={2} 
        title="SVG与绘制类" 
        description="路径绘制、形状变形、手写效果"
      />
      <SVGPathDrawing />
      <SVGMorphing />
      <HandwritingReveal />

      {/* Phase 3: 数据可视化类 */}
      <SectionDivider 
        phaseNumber={3} 
        title="数据可视化类" 
        description="计数器、图表、进度环"
      />
      <CounterAnimation />
      <ChartAnimation />
      <ProgressRing />
      
      {/* Phase 4: 3D与WebGL类 */}
      <SectionDivider 
        phaseNumber={4} 
        title="3D与WebGL类" 
        description="3D场景、模型旋转、粒子系统"
      />
      <Scene3DControl />
      <Model3DRotation />
      <ParticleSystem />
      
      {/* Phase 5: 交互增强类 */}
      <SectionDivider 
        phaseNumber={5} 
        title="交互增强类" 
        description="滚动吸附、磁性滚动、方向检测、速度效果"
      />
      <ScrollSnapSections />
      <MagneticScroll />
      <ScrollDirectionAnimation />
      <ScrollVelocityEffects />
      
      {/* Phase 6: 图片处理类 */}
      <SectionDivider 
        phaseNumber={6} 
        title="图片处理类" 
        description="肯伯恩斯效果、前后对比、图片融合"
      />
      <KenBurnsEffect />
      <BeforeAfterSlider />
      <ImageComparisonMorph />
      
      {/* Phase 7: 页面结构类 */}
      <SectionDivider 
        phaseNumber={7} 
        title="页面结构类" 
        description="翻页效果、无限循环、滚动劫持"
      />
      <PageTurning />
      <InfiniteLoopScroll />
      <ScrollHijacking />
      
      {/* Phase 8: 特效类 */}
      <SectionDivider 
        phaseNumber={8} 
        title="特效类" 
        description="庆祝彩带、故障效果、噪点覆盖"
      />
      <ConfettiCelebration />
      <GlitchEffect />
      <NoiseGrainOverlay />

      {/* Footer */}
      <div style={{ 
        height: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)'
      }}>
        <p style={{ color: '#667eea', fontSize: '1.5rem' }}>🎉 全部 26 种效果已完成!</p>
        <p style={{ color: '#555' }}>— Scrollytelling Advanced —</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <Link 
            to="/scrollytelling-demo" 
            style={{ 
              color: '#888', 
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid #444',
              borderRadius: '6px'
            }}
          >
            ← 基础版 (29种)
          </Link>
          <Link 
            to="/showcase-demos" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid #667eea',
              borderRadius: '6px'
            }}
          >
            返回目录
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScrollytellingAdvanced;
