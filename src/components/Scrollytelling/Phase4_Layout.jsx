import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 16. Card Stack
export const CardStack = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} style={{ height: '300vh', background: '#111', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[...Array(4)].map((_, i) => {
          // Logic: As we scroll, cards fly off one by one
          // Card 0 leaves 0-0.25, Card 1 leaves 0.25-0.5, etc.
          const start = i * 0.25;
          const end = start + 0.25;
          
          const y = useTransform(scrollYProgress, [start, end], [0, -1000]);
          const rotate = useTransform(scrollYProgress, [start, end], [0, Math.random() * 20 - 10]);
          const scale = useTransform(scrollYProgress, [start, end], [1, 0.8]);
          const opacity = useTransform(scrollYProgress, [start, end - 0.05], [1, 0]);

          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '350px',
                height: '500px',
                background: `hsl(${200 + i * 20}, 60%, 60%)`,
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: '#fff',
                zIndex: 4 - i, // Top card has highest z-index
                y,
                rotate,
                scale,
                opacity
              }}
            >
              Card {i + 1}
            </motion.div>
          );
        })}
        <h2 style={{ position: 'absolute', bottom: '50px', color: '#fff' }}>Stack & Swipe</h2>
      </div>
    </div>
  );
};

// 17. Scale-down-to-Grid
export const ScaleDownToGrid = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const x = useTransform(scrollYProgress, [0, 0.5], ["0%", "-35%"]); // Move to top-left grid position
  const y = useTransform(scrollYProgress, [0, 0.5], ["0%", "-35%"]);
  const opacityGrid = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);

  return (
    <div ref={ref} style={{ height: '200vh', background: '#000', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* The Hero Image that scales down */}
        <motion.div 
          style={{ 
            width: '100vw', 
            height: '100vh', 
            backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            zIndex: 2,
            scale,
            x,
            y
          }} 
        />

        {/* The Grid that appears behind */}
        <motion.div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gridTemplateRows: 'repeat(3, 1fr)', 
            width: '100vw', 
            height: '100vh',
            opacity: opacityGrid,
            zIndex: 1
          }}
        >
          {/* Placeholder for the hero image position (0,0) */}
          <div /> 
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ background: `hsl(${i * 30}, 50%, 20%)`, border: '1px solid #333' }} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// 18. Pin & Zoom
export const PinZoom = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <div ref={ref} style={{ height: '300vh', background: '#111', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundImage: 'url(https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            scale,
            opacity
          }} 
        />
        <div style={{ position: 'absolute', color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '10px' }}>
          <h2>Pin & Zoom</h2>
          <p>Exploring the details...</p>
        </div>
      </div>
    </div>
  );
};

// 19. Typography Mask
export const TypographyMask = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref} style={{ height: '100vh', background: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <motion.div 
        style={{ 
          position: 'absolute', 
          width: '120%', 
          height: '120%', 
          backgroundImage: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y
        }} 
      />
      <h1 style={{ 
        fontSize: '25vw', 
        fontWeight: '900', 
        color: '#fff', 
        background: '#fff', 
        mixBlendMode: 'screen', // This creates the mask effect on white background
        margin: 0,
        lineHeight: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        BOLD
      </h1>
    </div>
  );
};

// 20. Split Screen Reveal
export const SplitScreenReveal = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={ref} style={{ height: '200vh', background: '#000', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Hidden Center Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <h2 style={{ fontSize: '4rem' }}>The Core</h2>
            <p>Hidden content revealed</p>
          </div>
        </div>

        {/* Left Panel */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '50%', 
            height: '100%', 
            background: '#fff',
            x: xLeft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          <h2 style={{ fontSize: '3rem' }}>LEFT</h2>
        </motion.div>

        {/* Right Panel */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '50%', 
            height: '100%', 
            background: '#000',
            color: '#fff',
            x: xRight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          <h2 style={{ fontSize: '3rem' }}>RIGHT</h2>
        </motion.div>
      </div>
    </div>
  );
};
