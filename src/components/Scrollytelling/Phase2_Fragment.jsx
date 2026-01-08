import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 6. Slice Transition
export const SliceTransition = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const yOdd = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yEven = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <div ref={ref} style={{ height: '150vh', background: '#000', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '600px', height: '400px', position: 'relative', display: 'flex' }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              width: '10%',
              height: '100%',
              backgroundImage: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop)',
              backgroundSize: '600px 400px',
              backgroundPosition: `${i * 10}% 0`,
              y: i % 2 === 0 ? yEven : yOdd,
            }}
          />
        ))}
      </div>
      <h2 style={{ position: 'absolute', color: '#fff', fontSize: '3rem', mixBlendMode: 'difference' }}>Slice & Dice</h2>
    </div>
  );
};

// 7. Pixelation Morph
export const PixelationMorph = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Simulating pixelation by scaling down a small container and using nearest-neighbor rendering
  // Note: True pixelation requires Canvas/WebGL, this is a CSS approximation
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.1, 1]);
  const opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [1, 0, 1]);
  const imgIndex = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <div ref={ref} style={{ height: '200vh', background: '#111', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <motion.div 
          style={{ 
            width: '500px', 
            height: '500px', 
            scale,
            imageRendering: 'pixelated', // Key for pixel effect
            overflow: 'hidden'
          }}
        >
          <motion.img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: useTransform(scrollYProgress, [0, 0.49], [1, 0]) }}
          />
          <motion.img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: useTransform(scrollYProgress, [0.51, 1], [0, 1]) }}
          />
        </motion.div>
        <div style={{ position: 'absolute', bottom: '10%', color: '#fff' }}>Pixel Morph (CSS Approx)</div>
      </div>
    </div>
  );
};

// 8. Grid Shuffle
export const GridShuffle = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const positions = [
    { x: [-200, 0], y: [-200, 0] },
    { x: [0, 0], y: [-200, 0] },
    { x: [200, 0], y: [-200, 0] },
    { x: [-200, 0], y: [0, 0] },
    { x: [0, 0], y: [0, 0] }, // Center
    { x: [200, 0], y: [0, 0] },
    { x: [-200, 0], y: [200, 0] },
    { x: [0, 0], y: [200, 0] },
    { x: [200, 0], y: [200, 0] },
  ];

  return (
    <div ref={ref} style={{ height: '200vh', background: '#000', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '300px', height: '300px' }}>
          {positions.map((pos, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                left: '100px',
                top: '100px',
                background: `hsl(${i * 40}, 70%, 50%)`,
                x: useTransform(scrollYProgress, [0.2, 0.8], pos.x),
                y: useTransform(scrollYProgress, [0.2, 0.8], pos.y),
                rotate: useTransform(scrollYProgress, [0.2, 0.8], [Math.random() * 360, 0]),
                scale: useTransform(scrollYProgress, [0.2, 0.8], [0.5, 1]),
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
        <h2 style={{ position: 'absolute', top: '10%', color: '#fff' }}>Order from Chaos</h2>
      </div>
    </div>
  );
};

// 9. Spread Out
export const SpreadOut = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} style={{ height: '200vh', background: '#111', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[...Array(5)].map((_, i) => {
          const angle = (i - 2) * 15; // -30, -15, 0, 15, 30
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '200px',
                height: '300px',
                background: '#fff',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                originY: 1, // Pivot from bottom
                rotate: useTransform(scrollYProgress, [0, 0.5], [0, angle]),
                x: useTransform(scrollYProgress, [0, 0.5], [0, (i - 2) * 50]),
                zIndex: 5 - Math.abs(i - 2),
                backgroundImage: `url(https://images.unsplash.com/photo-${1550000000000 + i}?q=80&w=400&auto=format&fit=crop)`,
                backgroundSize: 'cover'
              }}
            />
          );
        })}
        <h2 style={{ position: 'absolute', bottom: '10%', color: '#fff' }}>Spread the Cards</h2>
      </div>
    </div>
  );
};

// 10. Curtain Reveal
export const CurtainReveal = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const height = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    <div ref={ref} style={{ height: '150vh', position: 'relative', background: '#222' }}>
      {/* Content Behind */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f00' }}>
        <h1 style={{ fontSize: '5rem', color: '#fff' }}>The Grand Reveal</h1>
      </div>

      {/* Curtain (Foreground) */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height, 
          background: '#000',
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <div style={{ paddingBottom: '50px', color: '#fff', fontSize: '2rem' }}>Scroll to Lift Curtain</div>
      </motion.div>
    </div>
  );
};
