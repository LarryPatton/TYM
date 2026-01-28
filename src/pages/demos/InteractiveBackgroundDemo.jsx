import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InteractiveBackgroundDemo = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    // 配置参数
    const spacing = 30; // 点间距
    const radius = 2; // 点半径
    const influenceRadius = 150; // 鼠标影响范围
    const forceFactor = 0.5; // 斥力强度
    const returnSpeed = 0.1; // 回弹速度

    // 初始化粒子
    const init = () => {
      particles = [];
      const width = canvas.width;
      const height = canvas.height;
      
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          particles.push({
            x: x, // 原始位置 X
            y: y, // 原始位置 Y
            cx: x, // 当前位置 X
            cy: y, // 当前位置 Y
            vx: 0, // 速度 X
            vy: 0, // 速度 Y
            color: '#ffffff'
          });
        }
      }
    };

    // 调整画布大小
    const handleResize = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        init();
      }
    };

    // 鼠标移动处理
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // 动画循环
    const animate = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // 计算鼠标与粒子的距离
        const dx = mouse.x - p.cx;
        const dy = mouse.y - p.cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 物理计算
        if (distance < influenceRadius) {
          const force = (influenceRadius - distance) / influenceRadius;
          const angle = Math.atan2(dy, dx);
          const fx = Math.cos(angle) * force * influenceRadius * forceFactor;
          const fy = Math.sin(angle) * force * influenceRadius * forceFactor;

          // 施加斥力 (向相反方向移动)
          p.vx -= fx * 0.05;
          p.vy -= fy * 0.05;
          
          // 变色效果
          p.color = `hsl(${200 + force * 100}, 100%, 70%)`;
        } else {
          p.color = '#333333';
        }

        // 弹性回归原位
        const homeDx = p.x - p.cx;
        const homeDy = p.y - p.cy;
        
        p.vx += homeDx * returnSpeed;
        p.vy += homeDy * returnSpeed;

        // 阻尼
        p.vx *= 0.8;
        p.vy *= 0.8;

        // 更新位置
        p.cx += p.vx;
        p.cy += p.vy;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.cx, p.cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // 初始化
    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0a0a0a' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      
      {/* 叠加内容 */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', // 让鼠标事件穿透到 Canvas
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '20px', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
          Interactive Field
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', textAlign: 'center' }}>
          Move your mouse to disturb the magnetic particle field.
        </p>
      </div>

      {/* 返回按钮 */}
      <div style={{ position: 'absolute', top: 30, left: 30, pointerEvents: 'auto' }}>
        <Link to="/showcase-demos" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>
          ← Back
        </Link>
      </div>
    </div>
  );
};

export default InteractiveBackgroundDemo;
