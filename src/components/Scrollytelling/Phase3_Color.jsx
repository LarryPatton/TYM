import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 11. Color Bloom
export const ColorBloom = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const clipPath = useTransform(scrollYProgress, [0.3, 0.7], ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"]);

  return (
    <div ref={ref} style={{ height: '150vh', position: 'relative', background: '#fff' }}>
      {/* BW Layer */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
        <h2 style={{ position: 'absolute', color: '#000', fontSize: '4rem', background: '#fff', padding: '10px 30px' }}>Color Bloom</h2>
      </div>

      {/* Color Layer (Revealed) */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          clipPath,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <h2 style={{ position: 'absolute', color: '#fff', fontSize: '4rem', background: '#000', padding: '10px 30px' }}>Color Bloom</h2>
        </div>
      </motion.div>
    </div>
  );
};

// 12. Focus Shift
export const FocusShift = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const blurFg = useTransform(scrollYProgress, [0, 0.5, 1], ["0px", "10px", "20px"]);
  const blurBg = useTransform(scrollYProgress, [0, 0.5, 1], ["20px", "0px", "20px"]);
  const scaleFg = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div ref={ref} style={{ height: '200vh', background: '#000', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Background */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundImage: 'url(https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=1000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            filter: useTransform(blurBg, v => `blur(${v})`),
            scale: 1.1
          }} 
        />
        
        {/* Foreground */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '10%', 
            right: '10%', 
            width: '400px', 
            height: '500px', 
            backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            filter: useTransform(blurFg, v => `blur(${v})`),
            scale: scaleFg
          }} 
        />
        
        <div style={{ position: 'absolute', top: '50%', left: '10%', color: '#fff', maxWidth: '400px' }}>
          <h2>Focus Shift</h2>
          <p>Scroll to change depth of field.</p>
        </div>
      </div>
    </div>
  );
};

// 13. Liquid Distortion (CSS Approx)
export const LiquidDistortion = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Using SVG filter for liquid effect
  return (
    <div ref={ref} style={{ height: '150vh', background: '#111', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="liquid">
          <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="2" result="turbulence">
            <animate attributeName="baseFrequency" dur="10s" values="0.01 0.02;0.02 0.04;0.01 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="50" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <motion.div 
        style={{ 
          width: '600px', 
          height: '400px', 
          overflow: 'hidden',
          borderRadius: '20px',
          filter: 'url(#liquid)', // Apply SVG filter
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8])
        }}
      >
        <img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1000&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.div>
      <h2 style={{ position: 'absolute', color: '#fff', mixBlendMode: 'overlay', fontSize: '5rem' }}>LIQUID</h2>
    </div>
  );
};

// 14. Velocity Skew
export const VelocitySkew = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  
  // Calculate velocity manually or use useVelocity (if available in newer framer-motion, or derive it)
  // Simplified: map scroll position to skew, but ideally should be velocity based.
  // Here we simulate velocity effect by mapping scroll progress in a small window
  
  // Note: True velocity skew requires useVelocity hook.
  // Let's try a simple approximation: skew based on position relative to center
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const skew = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <div ref={ref} style={{ height: '150vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <motion.div 
        style={{ 
          width: '500px', 
          height: '600px', 
          skewY: skew,
          scale,
          backgroundImage: 'url(https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop)',
          backgroundSize: 'cover',
          borderRadius: '20px'
        }} 
      />
      <h2 style={{ position: 'absolute', color: '#fff', fontSize: '3rem', zIndex: 1 }}>Velocity Skew</h2>
    </div>
  );
};

// 15. Circular Carousel
export const CircularCarousel = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div ref={ref} style={{ height: '250vh', background: '#111', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Carousel Container */}
        <motion.div 
          style={{ 
            width: '800px', 
            height: '800px', 
            position: 'relative', 
            rotate 
          }}
        >
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * 360;
            return (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '200px',
                  height: '150px',
                  background: `url(https://images.unsplash.com/photo-${1550000000000 + i * 10}?q=80&w=400&auto=format&fit=crop) center/cover`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translate(350px) rotate(-90deg)`, // Push out and correct orientation
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
                }}
              />
            );
          })}
        </motion.div>
        <div style={{ position: 'absolute', width: '100px', height: '100px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          SPIN
        </div>
      </div>
    </div>
  );
};
