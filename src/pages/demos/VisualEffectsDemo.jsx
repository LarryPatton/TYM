import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// --- Typography Animation Component ---
const AnimatedText = ({ text }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", maxWidth: '800px' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <motion.span 
          variants={child} 
          style={{ marginRight: "12px", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 'bold', lineHeight: 1.2 }} 
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- Video on Hover Component ---
const VideoCard = ({ src, poster }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      style={{ 
        width: '100%', 
        maxWidth: '500px', 
        aspectRatio: '16/9', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        position: 'relative',
        cursor: 'pointer',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    >
      {/* Image Overlay (Fades out on hover) */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 2, 
          opacity: isHovered ? 0 : 1, 
          transition: 'opacity 0.4s ease',
          background: `url(${poster}) center/cover no-repeat`
        }} 
      />
      
      {/* Video Layer */}
      <video 
        ref={videoRef} 
        src={src} 
        muted 
        loop 
        playsInline 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          position: 'absolute', 
          zIndex: 1 
        }} 
      />
      
      {/* Play Icon Hint */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        opacity: isHovered ? 0 : 1,
        transition: 'opacity 0.3s',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
};

const VisualEffectsDemo = () => {
  return (
    <div style={{ padding: '100px 20px', minHeight: '100vh', background: '#111', color: '#fff' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '60px' }}>Visual Effects & Atmosphere</h1>
        
        <section style={{ marginBottom: '150px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>01. Typography Animation</h2>
          <AnimatedText text="Design is not just what it looks like and feels like. Design is how it works." />
          <div style={{ height: '50px' }} />
          <AnimatedText text="Simplicity is the ultimate sophistication." />
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>02. Video on Hover</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <VideoCard 
              poster="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            />
            <VideoCard 
              poster="https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1000&auto=format&fit=crop"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisualEffectsDemo;