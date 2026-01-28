import React from 'react';
import { motion } from 'framer-motion';

export const PhaseTocScreen = ({ 
  images = [],
  bgColor = '#000',
  screenNumber,
  screenLabel
}) => {
  return (
    <section 
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: bgColor,
        padding: 'var(--space-4xl) var(--space-xl)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--space-2xl)'
      }}
    >
      {/* Screen Label */}
      {(screenNumber || screenLabel) && (
        <div style={{
          position: 'absolute',
          top: 'var(--space-md)',
          left: 'var(--space-md)',
          color: '#fff',
          opacity: 0.5,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-mono)',
          zIndex: 10
        }}>
          {screenNumber && <span>{screenNumber}</span>}
          {screenNumber && screenLabel && <span style={{ margin: '0 8px' }}>/</span>}
          {screenLabel && <span>{screenLabel}</span>}
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '1200px', // Limit width for very large screens
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2xl)'
      }}>
        {images.map((image, index) => {
          let src = typeof image === 'string' ? image : image.src;
          const alt = typeof image === 'string' ? `TOC Item ${index + 1}` : (image.label || image.hint || `TOC Item ${index + 1}`);
          
          // Prepend BASE_URL if path starts with / to ensure correct resolution in production/subdir
          if (src && src.startsWith('/') && !src.startsWith('data:')) {
             src = `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1] 
              }}
              style={{
                width: '100%',
                overflow: 'hidden'
              }}
            >
              <img 
                src={src} 
                alt={alt}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  // Ensure high quality rendering
                  imageRendering: 'high-quality' 
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};