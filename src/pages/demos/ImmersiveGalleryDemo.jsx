import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, useScroll, Text, Environment, Float } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

// 单个画作组件
const Frame = ({ url, c = new THREE.Color(), ...props }) => {
  const image = useRef();
  const frame = useRef();
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);

  useFrame((state, dt) => {
    // 悬停时的轻微动画
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    
    // 简单的颜色变化效果
    const targetColor = hovered ? '#fff' : '#333';
    frame.current.material.color.lerp(c.set(targetColor), 0.1);
  });

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, 1.618, 0.05]} // 黄金比例
        position={[0, 0.8, 0]} // 稍微抬高一点
      >
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
    </group>
  );
};

// 场景内容组件
const Gallery = () => {
  const { width } = useThree((state) => state.viewport);
  const data = useScroll();
  const group = useRef();
  const bgGroup = useRef();
  
  useFrame((state, delta) => {
    // 核心逻辑：根据滚动位置移动整个画廊组
    // data.offset 是 0 到 1 之间的值
    
    // 前景图片移动速度 (较快)
    const targetX = -data.offset * width * 2.5; 
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 4, delta);
    
    // 背景文字移动速度 (较慢，产生视差)
    const bgTargetX = -data.offset * width * 1.5;
    bgGroup.current.position.x = THREE.MathUtils.damp(bgGroup.current.position.x, bgTargetX, 4, delta);
  });

  return (
    <>
      {/* 背景巨大文字层 */}
      <group ref={bgGroup} position={[0, 0, -2]}>
        <Text
          position={[-2, 2, 0]}
          fontSize={6}
          color="#ff0033" // 红色
          // font="https://fonts.gstatic.com/s/oswald/v49/TK3iWkUHHAIjg752GT8G.woff" // 暂时移除以修复加载错误
          font={undefined} // 使用默认字体
          characters="WORKGALLERYCREATIVE" // 预加载字符
          // 尝试使用系统字体栈的近似效果
          // 注意：Three.js Text 组件不直接支持 CSS font-family，这里只能依赖默认或加载的字体文件
          // 但我们可以通过加粗和调整间距来模拟
          fontWeight="900" // 最粗
          letterSpacing={-0.05} // 紧凑间距
          anchorX="left"
          anchorY="middle"
          fillOpacity={0.8}
        >
          WORK
        </Text>
        <Text
          position={[12, -2, 0]}
          fontSize={6}
          color="#ff0033"
          fontWeight="900"
          letterSpacing={-0.05}
          anchorX="left"
          anchorY="middle"
          fillOpacity={0.8}
        >
          GALLERY
        </Text>
        <Text
          position={[28, 1, 0]}
          fontSize={6}
          color="#ff0033"
          fontWeight="900"
          letterSpacing={-0.05}
          anchorX="left"
          anchorY="middle"
          fillOpacity={0.8}
        >
          CREATIVE
        </Text>
      </group>

      {/* 前景图片层 */}
      <group ref={group}>
        {/* 线性排列的画作 */}
        <Frame position={[0, 0, 0]} url="https://picsum.photos/id/10/800/1200" />
        <Frame position={[3, 0.5, 0.5]} url="https://picsum.photos/id/11/800/1200" />
        <Frame position={[6, -0.5, 0]} url="https://picsum.photos/id/12/800/1200" />
        
        <Frame position={[9, 0, 0.5]} url="https://picsum.photos/id/13/800/1200" />
        <Frame position={[12, 0.8, 0]} url="https://picsum.photos/id/14/800/1200" />
        <Frame position={[15, -0.2, 0.5]} url="https://picsum.photos/id/15/800/1200" />
        
        <Frame position={[18, 0.3, 0]} url="https://picsum.photos/id/16/800/1200" />
        <Frame position={[21, -0.5, 0.5]} url="https://picsum.photos/id/17/800/1200" />
        <Frame position={[24, 0, 0]} url="https://picsum.photos/id/18/800/1200" />
      </group>
    </>
  );
};

// 辅助函数：从 URL 生成伪随机名称
function getUuid(url) {
  const id = url.split('/id/')[1]?.split('/')[0] || '00';
  return `ARTWORK-${id}`;
}

const ImmersiveGalleryDemo = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      {/* 返回按钮 */}
      <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 1000 }}>
        <Link to="/showcase-demos" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', mixBlendMode: 'difference' }}>
          ← Back
        </Link>
      </div>

      {/* 提示信息 */}
      <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, color: '#666', pointerEvents: 'none' }}>
        Scroll to Explore
      </div>

      <Canvas 
        gl={{ 
          antialias: false, 
          // powerPreference: "high-performance", // 移除高性能模式，可能导致崩溃
          stencil: false,
          depth: true,
          preserveDrawingBuffer: true // 尝试保留缓冲区，有时能解决闪烁
        }} 
        dpr={1} // 强制 dpr 为 1，降低显存压力
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('WebGL Context Lost: Please refresh the page.');
          });
        }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 25]} />
        
        <ambientLight intensity={0.8} /> {/* 稍微调亮环境光 */}
        {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */} {/* 暂时移除聚光灯 */}
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <ScrollControls damping={4} pages={4} horizontal>
          <Gallery />
        </ScrollControls>
        
        {/* 暂时移除粒子效果以排查问题 */}
        {/* <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[5, 2, -5]}>
            <dodecahedronGeometry />
            <meshStandardMaterial color="#333" wireframe />
          </mesh>
        </Float> */}
      </Canvas>
    </div>
  );
};

export default ImmersiveGalleryDemo;