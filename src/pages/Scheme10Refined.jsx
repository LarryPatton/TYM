import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const projects = [
  { id: '01', title: 'Brand Identity', subtitle: 'Chapter 01', desc: 'Defining the visual core.', cover: '#2a2a3e', accent: '#1a1a2e' },
  { id: '02', title: 'UI Guidelines', subtitle: 'Chapter 02', desc: 'Systemizing the interface.', cover: '#1e3a5f', accent: '#0f2a4a' },
  { id: '03', title: 'Product CMF', subtitle: 'Chapter 03', desc: 'Physical materiality.', cover: '#3d2e1e', accent: '#2d1e10' },
  { id: '04', title: 'Motion System', subtitle: 'Chapter 04', desc: 'Choreographing interaction.', cover: '#2e3d2e', accent: '#1e2d1e' },
  { id: '05', title: 'Data Viz', subtitle: 'Chapter 05', desc: 'Simplifying complexity.', cover: '#3e2e3d', accent: '#2e1e2d' },
  { id: '06', title: 'Marketing Assets', subtitle: 'Chapter 06', desc: 'Campaign visual language.', cover: '#1e2e3e', accent: '#0f1a2a' },
  { id: '07', title: 'Packaging', subtitle: 'Chapter 07', desc: 'Unboxing experience.', cover: '#3e1e1e', accent: '#2a0f0f' },
  { id: '08', title: 'Retail Space', subtitle: 'Chapter 08', desc: 'Spatial brand expression.', cover: '#2e3e3e', accent: '#1a2a2a' },
  { id: '09', title: 'Sound Design', subtitle: 'Chapter 09', desc: 'Sonic branding identity.', cover: '#3e2e1e', accent: '#2a1a0f' },
  { id: '10', title: 'Photography', subtitle: 'Chapter 10', desc: 'Art direction & style.', cover: '#1e1e3e', accent: '#0f0f2a' },
  { id: '11', title: 'Typography', subtitle: 'Chapter 11', desc: 'Custom type design.', cover: '#3e3e3e', accent: '#2a2a2a' },
  { id: '12', title: 'Iconography', subtitle: 'Chapter 12', desc: 'Symbolic communication.', cover: '#2e2e2e', accent: '#1a1a1a' },
];

const Card = ({ project, index, total, scrollYProgress }) => {
  // Calculate the specific range for this card to be "active"
  const step = 1 / (total - 1);
  const center = index * step;
  // Define a range around the center point
  const range = [center - step, center, center + step];
  
  // Animations based on scroll position relative to this card
  const scale = useTransform(scrollYProgress, range, [0.85, 1.1, 0.85]);
  const opacity = useTransform(scrollYProgress, range, [0.4, 1, 0.4]);
  const textY = useTransform(scrollYProgress, range, [60, 0, 60]);
  const textOpacity = useTransform(scrollYProgress, range, [0, 1, 0]);
  
  // Parallax for image: moves slightly opposite to scroll direction
  const imageX = useTransform(scrollYProgress, [center - step, center + step], ['-15%', '15%']);

  return (
    <motion.div 
      style={{ 
        width: '60vw', 
        height: '70vh', 
        flexShrink: 0,
        scale,
        opacity,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 10,
        perspective: '1000px'
      }}
    >
      <div style={{ 
        overflow: 'hidden', 
        borderRadius: '24px', 
        height: '100%', 
        position: 'relative', 
        boxShadow: '0 30px 60px -10px rgba(0,0,0,0.5)',
        background: '#000'
      }}>
        {/* Parallax Image Layer */}
        <motion.div 
          style={{ 
            width: '130%', 
            height: '100%', 
            background: project.cover, 
            x: imageX,
            position: 'absolute',
            left: '-15%',
            top: 0,
            filter: 'brightness(0.8)'
          }} 
        />
        
        {/* Overlay Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
        
        {/* Content Layer */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '60px', 
            left: '60px', 
            right: '60px',
            color: '#fff', 
            y: textY,
            opacity: textOpacity
          }}
        >
          <div style={{ overflow: 'hidden', marginBottom: '10px' }}>
            <motion.h4 style={{ margin: 0, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem' }}>
              {project.subtitle}
            </motion.h4>
          </div>
          <motion.h2 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', margin: '10px 0 20px', fontFamily: 'serif', lineHeight: 1 }}>
            {project.title}
          </motion.h2>
          <p style={{ maxWidth: '500px', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            {project.desc}
          </p>
          
          <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
            <span>View Case Study</span>
            <div style={{ width: '40px', height: '1px', background: '#fff' }} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Scheme10Refined = () => {
  // --- Tuner State ---
  const [snap, setSnap] = useState(true);
  const [snapType, setSnapType] = useState('mandatory'); // 'mandatory' | 'proximity'
  const [snapStop, setSnapStop] = useState('always');    // 'always' | 'normal'
  const [itemHeight, setItemHeight] = useState(800); // Default: 800px per item
  const [stiffness, setStiffness] = useState(50);    // Default: 50
  const [damping, setDamping] = useState(15);        // Default: 15

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const total = projects.length;
  
  // Dynamic Configuration
  const scrollHeight = `calc(100vh + ${(total - 1) * itemHeight}px)`;
  const springConfig = { stiffness, damping };

  // Raw transform
  const rawX = useTransform(scrollYProgress, [0, 1], ['20vw', '-260vw']);
  
  // Smoothed transform
  const x = useSpring(rawX, springConfig);

  // Ambient Background Color
  const bg = useTransform(
    scrollYProgress,
    projects.map((_, i) => i / (total - 1)),
    projects.map(p => p.accent)
  );
  const smoothBg = useSpring(bg, { stiffness: 50, damping: 20 });

  // Snapping Logic
  const snapPoints = Array.from({ length: total }).map((_, i) => i);

  return (
    <div style={{ background: '#000' }}>
      
      {/* --- Advanced Tuner UI --- */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'rgba(20,20,20,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #333',
        color: '#fff',
        width: '320px',
        fontFamily: 'monospace',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          Physics Tuner
        </h3>
        
        {/* Snap Toggle */}
        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888' }}>Snapping</span>
            <button 
              onClick={() => setSnap(!snap)}
              style={{
                background: snap ? '#4caf50' : '#333',
                color: '#fff',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '100px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {snap ? 'ON' : 'OFF'}
            </button>
          </div>
          
          {snap && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: '#666' }}>Type</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['mandatory', 'proximity'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSnapType(t)}
                      style={{
                        background: snapType === t ? '#fff' : '#333',
                        color: snapType === t ? '#000' : '#aaa',
                        border: 'none',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: '#666' }}>Stop (Force)</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['always', 'normal'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSnapStop(t)}
                      style={{
                        background: snapStop === t ? '#fff' : '#333',
                        color: snapStop === t ? '#000' : '#aaa',
                        border: 'none',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Item Height Slider */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#888' }}>Scroll Distance</span>
            <span style={{ color: '#4caf50' }}>{itemHeight}px</span>
          </div>
          <input 
            type="range" 
            min="200" 
            max="2000" 
            step="50" 
            value={itemHeight} 
            onChange={(e) => setItemHeight(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#4caf50' }}
          />
          <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '4px' }}>Larger = More scroll needed to switch</div>
        </div>

        {/* Stiffness Slider */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#888' }}>Stiffness (Speed)</span>
            <span style={{ color: '#2196f3' }}>{stiffness}</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="300" 
            step="5" 
            value={stiffness} 
            onChange={(e) => setStiffness(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#2196f3' }}
          />
        </div>

        {/* Damping Slider */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#888' }}>Damping (Drag)</span>
            <span style={{ color: '#ff9800' }}>{damping}</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="100" 
            step="1" 
            value={damping} 
            onChange={(e) => setDamping(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#ff9800' }}
          />
        </div>

        {/* Result Output */}
        <div style={{ background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>Current Settings</div>
          <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6' }}>
            Height: <span style={{ color: '#fff' }}>{itemHeight}</span><br/>
            Stiffness: <span style={{ color: '#fff' }}>{stiffness}</span><br/>
            Damping: <span style={{ color: '#fff' }}>{damping}</span>
          </div>
        </div>
      </div>

      {/* --- Main Container --- */}
      <div 
        ref={containerRef} 
        style={{ 
          height: scrollHeight,
          // CSS Scroll Snap Implementation
          scrollSnapType: snap ? `y ${snapType}` : 'none',
          position: 'relative'
        }}
      >
        {/* Invisible Snap Points */}
        {snapPoints.map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              top: `${(i / (total - 1)) * 100}%`, // Distribute evenly
              left: 0,
              width: '100%',
              height: '1px',
              scrollSnapAlign: 'start',
              scrollSnapStop: snapStop, // 'always' prevents skipping
              pointerEvents: 'none'
            }}
          />
        ))}

        <motion.div 
          style={{ 
            position: 'sticky', 
            top: 0, 
            height: '100vh', 
            background: smoothBg, 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            willChange: 'background-color'
          }}
        >
          {/* Background Noise/Texture Overlay */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            opacity: 0.05, 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            pointerEvents: 'none'
          }} />

          <motion.div style={{ display: 'flex', gap: '10vw', x, paddingLeft: '0', willChange: 'transform' }}>
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                project={project} 
                index={index} 
                total={total} 
                scrollYProgress={scrollYProgress} 
              />
            ))}
          </motion.div>
          
          {/* Progress Bar */}
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '150px', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
            <motion.div style={{ height: '100%', background: '#fff', scaleX: scrollYProgress, transformOrigin: 'left' }} />
          </div>
          
          {/* Scroll Hint */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              bottom: '40px', 
              right: '40px', 
              color: 'rgba(255,255,255,0.5)', 
              fontSize: '0.8rem', 
              textTransform: 'uppercase', 
              letterSpacing: '1px' 
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to Explore
          </motion.div>

        </motion.div>
      </div>
      
      {/* Footer / Next Section Placeholder */}
      <div style={{ height: '50vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'serif' }}>Next Chapter</h2>
      </div>
    </div>
  );
};

export default Scheme10Refined;