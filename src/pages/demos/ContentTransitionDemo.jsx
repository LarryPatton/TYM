import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Accordion Component ---
const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div style={{ borderBottom: '1px solid #333' }}>
      <button 
        onClick={onClick}
        style={{ 
          width: '100%', 
          padding: '30px 0', 
          background: 'none', 
          border: 'none', 
          color: '#fff', 
          textAlign: 'left', 
          fontSize: '1.5rem', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontWeight: '500' }}>{title}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 45 : 0 }}
          style={{ fontSize: '2rem', fontWeight: '300' }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: '30px', color: '#999', lineHeight: 1.6, fontSize: '1.1rem' }}>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Hover Reveal Component ---
const HoverRevealList = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const items = [
    { title: "Brand Strategy", img: "https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=1000&auto=format&fit=crop" },
    { title: "Visual Identity", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop" },
    { title: "Digital Experience", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" },
    { title: "Art Direction", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop" }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '600px', display: 'flex', alignItems: 'center' }}>
      {/* Floating Image Preview */}
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        right: '10%', 
        transform: 'translateY(-50%)',
        width: '400px', 
        height: '500px', 
        pointerEvents: 'none',
        zIndex: 0
      }}>
         <AnimatePresence mode="wait">
           {activeIndex !== null && (
             <motion.img 
               key={activeIndex}
               src={items[activeIndex].img}
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: -20 }}
               transition={{ duration: 0.4 }}
               style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
             />
           )}
         </AnimatePresence>
      </div>

      {/* List */}
      <div style={{ width: '100%', maxWidth: '600px', position: 'relative', zIndex: 1 }}>
        {items.map((item, i) => (
          <motion.div 
            key={i}
            onMouseEnter={() => setActiveIndex(i)} 
            onMouseLeave={() => setActiveIndex(null)}
            initial={{ opacity: 0.5, x: 0 }}
            whileHover={{ opacity: 1, x: 20 }}
            style={{ 
              padding: '30px 0', 
              borderBottom: '1px solid #333', 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            {item.title}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Preloader Component ---
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}
    >
      <div style={{ fontSize: '10vw', fontWeight: 'bold' }}>
        {progress}%
      </div>
    </motion.div>
  );
};

// --- Infinite Slider Component ---
const InfiniteSlider = () => {
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{ display: 'flex', width: 'fit-content' }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '20px', paddingRight: '20px' }}>
            {[1, 2, 3, 4].map((img) => (
              <div key={img} style={{ width: '300px', height: '200px', background: '#333', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#555' }}>
                Slide {img}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Before/After Slider Component ---
const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '800px', 
        aspectRatio: '16/9', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        cursor: 'ew-resize',
        margin: '0 auto'
      }}
    >
      {/* After Image (Background) */}
      <img 
        src="https://images.unsplash.com/photo-1516937941348-c09645f31e88?q=80&w=1000&auto=format&fit=crop" 
        alt="After" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      />
      
      {/* Before Image (Foreground with Clip) */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)` 
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1516937941348-c09645f31e88?q=80&w=1000&auto=format&fit=crop" 
          alt="Before" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(100%) contrast(1.2)' }} 
        />
        <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#000', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>BEFORE (BW)</div>
      </div>

      <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#fff', color: '#000', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>AFTER (Color)</div>

      {/* Slider Handle */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          bottom: 0, 
          left: `${sliderPos}%`, 
          width: '2px', 
          background: '#fff',
          pointerEvents: 'none'
        }}
      >
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '30px', 
          height: '30px', 
          background: '#fff', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          <div style={{ width: '2px', height: '12px', background: '#000', margin: '0 2px' }} />
          <div style={{ width: '2px', height: '12px', background: '#000', margin: '0 2px' }} />
        </div>
      </div>
    </div>
  );
};

// --- Page Transition Mock ---
const PageTransitionMock = () => {
  const [view, setView] = useState('list');

  return (
    <div style={{ border: '1px solid #333', borderRadius: '20px', padding: '40px', height: '400px', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}
          >
            <h3>Project List</h3>
            <button onClick={() => setView('detail')} style={{ padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              View Project A
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', background: '#222', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}
          >
            <h3>Project Detail A</h3>
            <p>This is the detail view with a smooth transition.</p>
            <button onClick={() => setView('list')} style={{ padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Back to List
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContentTransitionDemo = () => {
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(0);

  const accordionData = [
    { title: "What is your design process?", content: "Our process begins with deep research and strategy, followed by conceptualization, design iteration, and final refinement. We believe in a collaborative approach." },
    { title: "Do you work with startups?", content: "Yes, we love working with ambitious startups. We have special packages tailored for early-stage companies looking to establish a strong brand foundation." },
    { title: "How long does a project take?", content: "Timeline varies depending on the scope. A typical branding project takes 4-8 weeks, while a full website design and development can take 8-12 weeks." },
  ];

  return (
    <div style={{ padding: '100px 20px', minHeight: '100vh', background: '#111', color: '#fff' }}>
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '60px' }}>Content & Transitions</h1>
        
        <section style={{ marginBottom: '150px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>01. Hover Reveal</h2>
          <HoverRevealList />
        </section>

        <section style={{ marginBottom: '150px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>02. Accordion</h2>
          <div>
            {accordionData.map((item, index) => (
              <AccordionItem 
                key={index}
                title={item.title}
                content={item.content}
                isOpen={openAccordion === index}
                onClick={() => setOpenAccordion(index === openAccordion ? null : index)}
              />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '150px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>03. Infinite Slider</h2>
          <InfiniteSlider />
        </section>

        <section style={{ marginBottom: '150px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>04. Before / After Slider</h2>
          <BeforeAfterSlider />
        </section>

        <section style={{ marginBottom: '150px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>05. Page Transition (Mock)</h2>
          <PageTransitionMock />
        </section>
      </div>
    </div>
  );
};

export default ContentTransitionDemo;