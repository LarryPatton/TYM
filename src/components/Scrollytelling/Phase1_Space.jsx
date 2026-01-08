import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 1. Perspective Tunnel
export const PerspectiveTunnel = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const layers = [
    { scale: [0.2, 1.5], opacity: [0, 1, 0], zIndex: 1, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop' },
    { scale: [0.4, 2.0], opacity: [0, 1, 0], zIndex: 2, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop' },
    { scale: [0.6, 2.5], opacity: [0, 1, 0], zIndex: 3, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop' },
  ];

  return (
    <div ref={ref} style={{ height: '200vh', background: '#000', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
        <h2 style={{ position: 'absolute', zIndex: 10, color: '#fff', fontSize: '3rem', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>Perspective Tunnel</h2>
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '60vw',
              height: '40vw',
              backgroundImage: `url(${layer.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: layer.zIndex,
              scale: useTransform(scrollYProgress, [0, 1], layer.scale),
              opacity: useTransform(scrollYProgress, [0, 0.5, 1], layer.opacity),
              borderRadius: '20px',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// 2. Exploding Components
export const ExplodingComponents = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <div ref={ref} style={{ height: '200vh', background: '#111', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <h2 style={{ position: 'absolute', top: '10%', color: '#fff', fontSize: '3rem' }}>Exploded View</h2>
        <div style={{ position: 'relative', width: '300px', height: '400px' }}>
          {/* Layers representing components */}
          <motion.div style={{ position: 'absolute', inset: 0, background: '#333', borderRadius: '20px', y: y4, rotateX: 45, rotateZ: rotate, zIndex: 1, border: '1px solid #555' }} />
          <motion.div style={{ position: 'absolute', inset: '10px', background: '#444', borderRadius: '15px', y: y3, rotateX: 45, rotateZ: rotate, zIndex: 2, border: '1px solid #666' }} />
          <motion.div style={{ position: 'absolute', inset: '20px', background: '#555', borderRadius: '10px', y: y2, rotateX: 45, rotateZ: rotate, zIndex: 3, border: '1px solid #777' }} />
          <motion.div style={{ position: 'absolute', inset: '30px', background: '#ff5f6d', borderRadius: '5px', y: y1, rotateX: 45, rotateZ: rotate, zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>CORE</motion.div>
        </div>
      </div>
    </div>
  );
};

// 3. Motion Path
export const MotionPath = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  // Simulating motion path with x/y coordinates
  const x = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], ["-50%", "50%", "-50%", "50%", "-50%"]);
  const y = useTransform(scrollYProgress, [0, 1], ["-40vh", "40vh"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div ref={ref} style={{ height: '200vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}>
        {/* Path Line (Visual Guide) */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2 }}>
          <path d="M 0 100 Q 500 100 500 500 T 1000 900" stroke="white" strokeWidth="2" fill="none" />
        </svg>
        
        <motion.div 
          style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            x, 
            y, 
            rotate,
            width: '100px', 
            height: '100px', 
            background: 'linear-gradient(45deg, #00f260, #0575e6)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 0 30px #0575e6'
          }}
        >
          Path
        </motion.div>
      </div>
      <h2 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', opacity: 0.1, fontSize: '10vw' }}>MOTION</h2>
    </div>
  );
};

// 4. Cinematic Pan
export const CinematicPan = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div ref={ref} style={{ height: '200vh', background: '#000', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <motion.div 
          style={{ 
            width: '200vw', 
            height: '100vh', 
            x,
            backgroundImage: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=3000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
        <div style={{ position: 'absolute', bottom: '50px', left: '50px', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
          <h2 style={{ fontSize: '4rem', margin: 0 }}>Cinematic Pan</h2>
          <p style={{ fontSize: '1.5rem' }}>Revealing the landscape</p>
        </div>
      </div>
    </div>
  );
};

// 5. 3D Fold / Origami
export const OrigamiFold = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, -180]);
  const opacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);
  
  return (
    <div ref={ref} style={{ height: '200vh', background: '#111', position: 'relative', perspective: '1000px' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ color: '#fff', marginBottom: '50px' }}>Origami Reveal</h2>
        
        <div style={{ position: 'relative', width: '600px', height: '400px' }}>
          {/* Bottom Half (Static) */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            width: '100%', 
            height: '50%', 
            background: 'url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000&auto=format&fit=crop) bottom/cover no-repeat',
            borderRadius: '0 0 20px 20px'
          }} />

          {/* Top Half (Folding) */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              width: '100%', 
              height: '50%', 
              background: 'url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000&auto=format&fit=crop) top/cover no-repeat',
              borderRadius: '20px 20px 0 0',
              transformOrigin: 'bottom',
              rotateX,
              opacity,
              backfaceVisibility: 'hidden',
              zIndex: 2
            }} 
          />
          
          {/* Hidden Message Behind */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            width: '100%', 
            height: '50%', 
            background: '#222',
            borderRadius: '20px 20px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2rem',
            zIndex: 1
          }}>
            Secret Revealed
          </div>
        </div>
      </div>
    </div>
  );
};
