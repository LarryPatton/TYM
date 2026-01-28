import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProcessAnchor = ({ screens, labels, phaseId }) => {
  const [activeStep, setActiveStep] = useState(-1); // -1 means hidden (out of range)
  
  useEffect(() => {
    // 滚动监听
    const handleScroll = () => {
      // 1. 获取所有关联元素的 DOM 节点
      const elements = screens.map(id => document.getElementById(id)); // ID 约定为 phase-screen-{id} ? No, PhaseDetail uses index/sections often, but let's check PhaseDetail. RenderScreen doesn't explicitly setting ID on section.
      // Wait, PhaseDetail.jsx renderScreen doesn't assign specific IDs to sections usually, it iterates.
      // I need to check PhaseDetail.jsx rendering again to ensure targetablity.
      
      // PhaseDetail.jsx renders:
      // {phase.screens.map((screenConfig, index) => renderScreen(screenConfig, index))}
      // Most components in `PhaseScreens` likely return a <section> or <div>. But do they have IDs?
      // I should assume they might NOT have the config.id as DOM id.
      
      // Workaround: In PhaseDetail.jsx, I will need to ensure referenced sections *do* have IDs or I use the implementation that passes refs.
      // But PhaseDetail.jsx is generic.
      // Let's assume for now I will modify PhaseDetail to ensure IDs are applied to screen wrappers, 
      // OR I can search by data attribute or just index if I knew the global index.
      
      // Better strategy: Search by `data-screen-id` which I should add in PhaseDetail.jsx to the wrapper.
      // The wrapper in PhaseDetail is `renderScreen` returning a component.
      
      // Let's implement the logic assuming elements are found by `id={screenConfig.id}` or a predictable manner.
      // I'll update ProcessAnchor to look for `document.getElementById(screens[i])`.
      // NOTE: I will probably need to ensure PhaseDetail adds these IDs.
      
      let newActiveStep = -1;
      let inRange = false;
      
      // Find range start and end
      const firstEl = document.getElementById(screens[0]);
      const lastEl = document.getElementById(screens[screens.length - 1]);
      
      if (firstEl && lastEl) {
        const topBound = firstEl.getBoundingClientRect().top;
        const bottomBound = lastEl.getBoundingClientRect().bottom;
        const viewHeight = window.innerHeight;
        
        // Define "In Range": Top of first element enters viewport area ... Bottom of last element leaves viewport area
        // Adjustment: Show when first element is at least halfway up, or just entering? Usually "Entering".
        // Let's say: show when topBound < viewHeight * 0.8 && bottomBound > viewHeight * 0.2
        if (topBound < viewHeight * 0.8 && bottomBound > viewHeight * 0.2) {
          inRange = true;
          
          // Determine active step
          screens.forEach((id, index) => {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              // Logic: Element is active if its top is above the middle of viewport, OR if it covers the center.
              // Simple: center of viewport is within element rect.
              const center = viewHeight / 2;
              if (rect.top <= center && rect.bottom >= center) {
                newActiveStep = index;
              }
            }
          });
        }
      }
      
      setActiveStep(inRange ? newActiveStep : -1);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [screens]);

  return (
    <AnimatePresence>
      {activeStep !== -1 && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            left: '50%',
            top: '24px', // Aligned with the Back button vertically
            zIndex: 90,
            display: 'flex',
            flexDirection: 'row', // Horizontal
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(10, 10, 10, 0.65)', // Dark glass
            backdropFilter: 'blur(16px)',
            webkitBackdropFilter: 'blur(16px)',
            padding: '6px 6px',
            borderRadius: '100px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          {labels.map((label, index) => {
            const isActive = index === activeStep;
            return (
              <div 
                key={index}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: '32px',
                  padding: '0 16px',
                  borderRadius: '20px',
                  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => {
                   const el = document.getElementById(screens[index]);
                   if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  {/* Number - Only visible when active or hovered? Or always? Always is better for clarity */}
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 600,
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'color 0.3s ease'
                  }}>
                    0{index + 1}
                  </span>
                  
                  {/* Label */}
                  <span style={{
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.3s ease'
                  }}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProcessAnchor;