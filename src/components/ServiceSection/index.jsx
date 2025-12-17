import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

/**
 * 单个服务项组件
 */
const ServiceItem = ({ service, index, isLight }) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { 
    margin: "-40% 0px -40% 0px",
    once: false 
  });

  const numberStr = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      style={{
        padding: '60px 0',
        borderBottom: isLight ? '1px solid #e5e5e5' : '1px solid #333',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        background: isLight ? '#f5f5f5' : '#111',
      }}
    >
      {/* 编号 */}
      <motion.span
        animate={{
          color: isInView ? '#c4e02a' : (isLight ? '#ddd' : '#444'),
        }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '300',
          lineHeight: 1,
          minWidth: '120px',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.02em',
        }}
      >
        {numberStr}
      </motion.span>

      {/* 内容 */}
      <div style={{ flex: 1 }}>
        <motion.h3
          animate={{
            color: isInView 
              ? (isLight ? '#000' : '#fff') 
              : (isLight ? '#666' : '#888'),
          }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: '600',
            margin: '0 0 12px 0',
            lineHeight: 1.2,
          }}
        >
          {service.title}
        </motion.h3>
        <motion.p
          animate={{
            color: isInView 
              ? (isLight ? '#444' : '#aaa') 
              : (isLight ? '#999' : '#666'),
          }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '600px',
          }}
        >
          {service.desc}
        </motion.p>
      </div>
    </motion.div>
  );
};

/**
 * 背景大字组件 - 从描边到填充的动画
 */
const BigBackgroundText = ({ text }) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 描边到填充的渐变
  const fillProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const strokeOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0.3]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'sticky',
        top: '10vh',
        height: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* 描边文字层 */}
      <motion.div
        style={{
          position: 'absolute',
          fontSize: 'clamp(4rem, 18vw, 16rem)',
          fontWeight: '900',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          color: 'transparent',
          WebkitTextStroke: '2px #c4e02a',
          opacity: strokeOpacity,
          y: yOffset,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {text}
      </motion.div>

      {/* 填充文字层 */}
      <motion.div
        style={{
          position: 'absolute',
          fontSize: 'clamp(4rem, 18vw, 16rem)',
          fontWeight: '900',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          color: '#111',
          opacity: fillProgress,
          y: yOffset,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {text}
      </motion.div>
    </div>
  );
};

/**
 * 服务区域主组件
 */
const ServiceSection = ({ 
  services, 
  title = "SERVICE",
  sectionLabel = "专业能力",
}) => {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#f5f5f5',
      }}
    >
      {/* 顶部无需过渡 - ScrollParallaxShowcase 已处理 */}

      {/* 区域标签 */}
      <div style={{ 
        textAlign: 'center', 
        padding: 'clamp(60px, 10vh, 100px) clamp(40px, 8vw, 120px) 40px',
        position: 'relative',
      }}>
        {/* 装饰线 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '50px',
          background: 'linear-gradient(to bottom, #ccc, transparent)',
        }} />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            fontSize: '0.85rem',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            margin: 0,
            marginTop: '30px',
          }}
        >
          {sectionLabel}
        </motion.p>
      </div>

      {/* 背景大字 */}
      <BigBackgroundText text={title} />

      {/* 服务列表 - 浅色区域 */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        background: '#f5f5f5',
        padding: '0 clamp(40px, 8vw, 120px)',
      }}>
        {services.slice(0, 2).map((service, index) => (
          <ServiceItem
            key={service.id || index}
            service={service}
            index={index}
            isLight={true}
          />
        ))}
      </div>

      {/* 浅色到深色过渡 */}
      {services.length > 2 && (
        <div style={{
          height: '15vh',
          background: 'linear-gradient(to bottom, #f5f5f5 0%, #111 100%)',
          position: 'relative',
        }}>
          {/* 过渡装饰线 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, #ddd, #333)',
          }} />
        </div>
      )}

      {/* 深色区域 */}
      {services.length > 2 && (
        <div style={{ 
          background: '#111',
          padding: '0 clamp(40px, 8vw, 120px)',
        }}>
          {services.slice(2).map((service, index) => (
            <ServiceItem
              key={service.id || index + 2}
              service={service}
              index={index + 2}
              isLight={false}
            />
          ))}
        </div>
      )}

      {/* 底部无需额外过渡 - 与合作品牌区域同为深色 */}
    </section>
  );
};

export default ServiceSection;
