import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        position: 'fixed',
        left: 0,
        top: 0,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid #fff',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference'
      }}
    />
  );
};

// --- Magnetic Button Component ---
const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const x = (clientX - centerX) * 0.3; // Magnetic strength
    const y = (clientY - centerY) * 0.3;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      style={{
        padding: '20px 40px',
        fontSize: '1.2rem',
        background: '#fff',
        color: '#000',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      {children}
    </motion.button>
  );
};

// --- Spotlight Effect Component ---
const SpotlightEffect = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '400px', 
        background: '#000', 
        overflow: 'hidden',
        borderRadius: '20px',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Hidden Content */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop) center/cover no-repeat',
        opacity: 0.1 // Dim background
      }} />

      <h2 style={{ zIndex: 1, fontSize: '3rem', color: '#333' }}>Hidden Mystery</h2>

      {/* Spotlight Mask */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`,
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
      
      {/* Revealed Content (Only visible under spotlight) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop) center/cover no-repeat',
          maskImage: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, black 0%, transparent 100%)`,
          zIndex: 3,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
         <h2 style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>Hidden Mystery</h2>
      </div>
    </div>
  );
};

// --- SVG Distortion Component ---
const SvgDistortion = () => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <svg width="0" height="0">
        <filter id="distortionFilter">
          <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="2" result="turbulence">
            <animate attributeName="baseFrequency" dur="10s" values="0.01 0.02;0.02 0.04;0.01 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      <div style={{ overflow: 'hidden', borderRadius: '20px' }}>
        <motion.img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
          style={{ width: '100%', display: 'block' }}
          whileHover={{ filter: 'url(#distortionFilter)', scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p style={{ textAlign: 'center', marginTop: '15px', color: '#888' }}>Hover to see SVG Distortion</p>
    </div>
  );
};

const MouseCursorDemo = () => {
  return (
    <div style={{ padding: '100px 20px', minHeight: '100vh', background: '#111', color: '#fff', cursor: 'none' }}>
      <CustomCursor />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Mouse & Cursor</h1>
        <p style={{ fontSize: '1.5rem', color: '#888', marginBottom: '80px' }}>
          Move your mouse around to see the custom cursor. Hover over the buttons below to feel the magnetic effect.
        </p>

        <section style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>01. Magnetic Buttons</h2>
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
            <MagneticButton>Hover Me</MagneticButton>
            <MagneticButton>Magnetic</MagneticButton>
          </div>
        </section>

        <section style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>02. Spotlight Effect</h2>
          <SpotlightEffect />
        </section>

        <section style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>03. Image Distortion (SVG)</h2>
          <SvgDistortion />
        </section>

        <div style={{ padding: '50px', border: '1px solid #333', borderRadius: '20px' }}>
          <h2>Interactive Area</h2>
          <p>The cursor uses `mix-blend-mode: difference`, so it changes color based on the background.</p>
          <div style={{ height: '200px', background: '#fff', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            White Background
          </div>
        </div>
      </div>
    </div>
  );
};

export default MouseCursorDemo;