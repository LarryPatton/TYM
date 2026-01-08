import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Sticky Navigation Component ---
const StickyNav = () => {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '20px 40px',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        borderBottom: '1px solid #333'
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>BRAND</div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <span>Work</span>
        <span>About</span>
        <span>Contact</span>
      </div>
    </motion.nav>
  );
};

// --- Scroll Progress Component ---
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '5px',
        background: '#fff',
        transformOrigin: '0%',
        zIndex: 101
      }}
    />
  );
};

// --- Smooth Scroll Explanation ---
const SmoothScrollInfo = () => (
  <div style={{ padding: '40px', background: '#222', borderRadius: '20px', margin: '40px 0' }}>
    <h3>Smooth Scrolling</h3>
    <p style={{ color: '#aaa', lineHeight: 1.6 }}>
      This demo uses native scrolling, but for a premium feel, we recommend using libraries like 
      <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', margin: '0 4px' }}>Lenis</code> 
      or 
      <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', margin: '0 4px' }}>Locomotive Scroll</code>.
      These libraries intercept native scroll events to add inertia and damping, making the experience feel more fluid and "weighty".
    </p>
  </div>
);

// --- Marquee Component ---
const Marquee = ({ text, speed = 20, direction = -1 }) => {
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', background: '#222', padding: '20px 0' }}>
      <motion.div
        animate={{ x: direction === -1 ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        style={{ display: 'flex', gap: '50px', fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 'bold', textTransform: 'uppercase', color: 'transparent', WebkitTextStroke: '1px #fff' }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
};

// --- Horizontal Gallery Component ---
const HorizontalGallery = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const images = [
    "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488161628813-99c974fc5bce?q=80&w=1000&auto=format&fit=crop"
  ];

  return (
    <section ref={targetRef} style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: '#111' }}>
        <motion.div style={{ x, display: "flex", gap: "40px", paddingLeft: "5vw" }}>
          {images.map((src, i) => (
            <div 
              key={i} 
              style={{ 
                width: "60vw", 
                height: "70vh", 
                flexShrink: 0, 
                borderRadius: "20px", 
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <img src={src} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: '#fff', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                0{i + 1}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ScrollNavigationDemo = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff' }}>
      <StickyNav />
      <ScrollProgress />
      
      <div style={{ padding: '150px 20px 100px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Scroll & Navigation</h1>
        <p style={{ color: '#888' }}>Infinite Marquee, Horizontal Scroll Gallery & Smart Nav</p>
      </div>

      <section style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>01. Infinite Marquee</h2>
        <Marquee text="Brand Design • UI/UX • Motion • Strategy • " speed={20} />
        <Marquee text="Creative • Innovative • Digital • Future • " speed={25} direction={1} />
      </section>

      <section style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>02. Horizontal Gallery</h2>
        <HorizontalGallery />
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto 100px', padding: '0 20px' }}>
        <h2 style={{ color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>03. Navigation Patterns</h2>
        <p>Scroll down to see the <strong>Sticky Nav</strong> hide, and scroll up to see it reappear. Also notice the <strong>Progress Bar</strong> at the very top.</p>
        <SmoothScrollInfo />
      </div>

      <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
        <h2>Footer Content</h2>
      </div>
    </div>
  );
};

export default ScrollNavigationDemo;