import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PerspectiveTunnel, ExplodingComponents, MotionPath, CinematicPan, OrigamiFold } from '../components/Scrollytelling/Phase1_Space';
import { SliceTransition, PixelationMorph, GridShuffle, SpreadOut, CurtainReveal } from '../components/Scrollytelling/Phase2_Fragment';
import { ColorBloom, FocusShift, LiquidDistortion, VelocitySkew, CircularCarousel } from '../components/Scrollytelling/Phase3_Color';
import { CardStack, ScaleDownToGrid, PinZoom, TypographyMask, SplitScreenReveal } from '../components/Scrollytelling/Phase4_Layout';

// 1. Parallax Hero
const ParallaxHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div ref={ref} style={{ height: '100vh', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)', 
          zIndex: 0,
          y: backgroundY
        }} 
      />
      <motion.div 
        style={{ 
          zIndex: 1, 
          position: 'relative',
          textAlign: 'center',
          y: textY
        }}
      >
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', margin: 0, textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>Scrollytelling</h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>Immersive Storytelling Techniques</p>
      </motion.div>
    </div>
  );
};

// 2. Horizontal Scroll
const HorizontalScroll = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} style={{ height: "300vh", position: "relative", background: '#111' }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <motion.div style={{ x, display: "flex", gap: "40px", paddingLeft: "50px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div 
              key={item} 
              style={{ 
                width: "400px", 
                height: "60vh", 
                background: `hsl(${item * 40}, 70%, 50%)`, 
                borderRadius: "20px", 
                flexShrink: 0, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <span>Card {item}</span>
              <span style={{ fontSize: '1rem', opacity: 0.7, marginTop: '10px' }}>Horizontal Scroll Item</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// 3. Zoom Reveal
const ZoomReveal = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

  return (
    <div ref={ref} style={{ height: '200vh', position: 'relative', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          style={{ 
            width: '100%', 
            height: '100%', 
            scale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '80%', height: '80%', background: 'linear-gradient(to bottom right, #4facfe 0%, #00f2fe 100%)', borderRadius: '20px' }} />
        </motion.div>
        
        <motion.div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            x: '-50%', 
            y: '-50%', 
            opacity,
            textAlign: 'center',
            background: 'rgba(0,0,0,0.6)',
            padding: '40px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            color: '#fff'
          }}
        >
          <h2 style={{ fontSize: '3rem', margin: 0 }}>Zoom Reveal</h2>
          <p>Content revealed after zoom</p>
        </motion.div>
      </div>
    </div>
  );
};

// 4. Layered Parallax (Extreme Depth)
const LayeredParallax = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 1. 远景 (Background): 几乎不动，营造极远距离感
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // 2. 后景 (Back): 慢速移动
  const yBack = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  // 3. 中景 (Middle): 正常速度，作为视觉基准
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // 4. 前景 (Front): 快速移动
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  // 5. 特写前景 (Extreme Front): 极速移动，模拟镜头前遮挡物
  const yExtreme = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);

  return (
    <div ref={ref} style={{ height: '150vh', position: 'relative', overflow: 'hidden', background: '#050505' }}>
      
      {/* Layer 1: Background (Stars/Grid) */}
      <motion.div 
        style={{ 
          position: 'absolute', inset: '-10%', zIndex: 0,
          background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)',
          y: yBg, scale: scaleBg
        }} 
      >
        <div style={{ width: '100%', height: '100%', opacity: 0.3, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </motion.div>

      {/* Layer 2: Back Elements (Slow) */}
      <motion.div 
        style={{ 
          position: 'absolute', top: '20%', left: '10%', zIndex: 1,
          y: yBack
        }}
      >
        <div style={{ width: '30vw', height: '30vw', background: '#222', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.5 }} />
      </motion.div>

      {/* Layer 3: Middle Elements (Subject) */}
      <motion.div 
        style={{ 
          position: 'absolute', top: '30%', left: 0, right: 0, zIndex: 2,
          display: 'flex', justifyContent: 'center',
          y: yMid
        }}
      >
        <div style={{ 
          width: '60vw', height: '40vw', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '4vw', fontWeight: 'bold'
        }}>
          Middle Layer
        </div>
      </motion.div>

      {/* Layer 4: Front Elements (Fast) */}
      <motion.div 
        style={{ 
          position: 'absolute', top: '60%', right: '10%', zIndex: 3,
          y: yFront
        }}
      >
        <div style={{ 
          width: '25vw', height: '25vw', 
          background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }} />
      </motion.div>

      {/* Layer 5: Extreme Front (Very Fast & Blurred) */}
      <motion.div 
        style={{ 
          position: 'absolute', bottom: '-20%', left: '-10%', zIndex: 4,
          y: yExtreme
        }}
      >
        <div style={{ 
          width: '40vw', height: '40vw', 
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          filter: 'blur(10px)'
        }} />
      </motion.div>

      <div style={{ position: 'absolute', bottom: '50px', width: '100%', textAlign: 'center', zIndex: 5, color: '#fff', opacity: 0.5 }}>
        Scroll to see depth
      </div>
    </div>
  );
};

// 5. Sequence Playback
const SequencePlayback = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "50%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);
  const background = useTransform(
    scrollYProgress, 
    [0, 0.33, 0.66, 1], 
    ["#ff0080", "#7928ca", "#0070f3", "#ff0080"]
  );

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '50px', fontSize: '3rem' }}>State Sequence</h2>
        <motion.div 
          style={{ 
            width: '300px', 
            height: '300px', 
            background,
            borderRadius,
            rotate,
            scale
          }} 
        />
        <p style={{ marginTop: '30px', opacity: 0.7 }}>Scroll to morph shape and color</p>
      </div>
    </div>
  );
};

// 6. Sticky Sections
const StickySections = () => {
  const content = [
    { title: "Section 1", text: "Description for section 1", color: "#ff5f6d" },
    { title: "Section 2", text: "Description for section 2", color: "#ffc371" },
    { title: "Section 3", text: "Description for section 3", color: "#11998e" },
  ];

  return (
    <div style={{ display: 'flex', background: '#111', position: 'relative' }}>
      <div style={{ width: '50%', height: '100vh', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
        <div>
          <h2 style={{ fontSize: '4rem', marginBottom: '20px' }}>Sticky Story</h2>
          <p style={{ fontSize: '1.2rem', color: '#aaa' }}>
            As you scroll through the images on the right, this text remains fixed, providing context and narrative continuity.
          </p>
        </div>
      </div>
      <div style={{ width: '50%' }}>
        {content.map((item, index) => (
          <div key={index} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
            <div style={{ width: '100%', height: '80%', background: item.color, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '3rem' }}>
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Mask Reveal
const MaskReveal = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // 遮罩尺寸从 0% 扩大到 150% (确保覆盖全屏)
  const maskSize = useTransform(scrollYProgress, [0, 0.6], ["0%", "150%"]);
  
  return (
    <div ref={ref} style={{ height: '200vh', position: 'relative', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* 底层内容 (被遮罩揭示) */}
        <motion.div 
          style={{ 
            position: 'absolute',
            inset: 0,
            background: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop) center/cover no-repeat',
            clipPath: useTransform(maskSize, (val) => `circle(${val} at 50% 50%)`),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h2 style={{ fontSize: '5rem', color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>Revealed</h2>
        </motion.div>

        {/* 顶层内容 (初始可见) */}
        <div style={{ zIndex: -1, color: '#fff', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Scroll to Reveal</h2>
          <p style={{ opacity: 0.7 }}>A circular mask expands to show the image below</p>
        </div>
      </div>
    </div>
  );
};

// 8. Text Highlight
const TextHighlight = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const text = "In the realm of digital storytelling, the way we present information is just as important as the information itself. By guiding the user's attention through motion and interaction, we transform passive reading into an active journey of discovery.";
  const words = text.split(" ");

  return (
    <div ref={ref} style={{ minHeight: '150vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
      <div style={{ maxWidth: '800px', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.4, fontWeight: 'bold', flexWrap: 'wrap', display: 'flex', gap: '12px' }}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + (1 / words.length);
          const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
          
          return (
            <motion.span key={i} style={{ opacity, color: '#fff' }}>
              {word}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

// 9. 3D Flip
const FlipCard = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 180]);
  
  return (
    <div ref={ref} style={{ height: '200vh', background: '#000', perspective: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'sticky', top: 'calc(50% - 200px)', height: '400px' }}>
        <motion.div 
          style={{ 
            width: '300px', 
            height: '400px', 
            position: 'relative',
            transformStyle: 'preserve-3d',
            rotateX
          }}
        >
          {/* Front Side */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(to bottom right, #ff512f, #dd2476)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Front
          </div>

          {/* Back Side */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(to bottom right, #1fa2ff, #12d8fa, #a6ffcb)',
            borderRadius: '20px',
            transform: 'rotateX(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000'
          }}>
            Back
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 占位符组件，后续会替换为具体的实现
const SectionPlaceholder = ({ title, color }) => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color }}>
    <h1>{title}</h1>
  </div>
);

const ScrollytellingDemo = () => {
  return (
    <div style={{ background: '#111', color: '#fff', minHeight: '100vh' }}>
      <ParallaxHero />
      <HorizontalScroll />
      <ZoomReveal />
      <LayeredParallax />
      <SequencePlayback />
      <StickySections />
      <MaskReveal />
      <TextHighlight />
      <FlipCard />
      
      {/* Phase 1: Space & Perspective */}
      <SectionPlaceholder title="Phase 1: Space & Perspective" color="#222" />
      <PerspectiveTunnel />
      <ExplodingComponents />
      <MotionPath />
      <CinematicPan />
      <OrigamiFold />

      {/* Phase 2: Fragmentation & Assembly */}
      <SectionPlaceholder title="Phase 2: Fragmentation & Assembly" color="#333" />
      <SliceTransition />
      <PixelationMorph />
      <GridShuffle />
      <SpreadOut />
      <CurtainReveal />

      {/* Phase 3: Color & State */}
      <SectionPlaceholder title="Phase 3: Color & State" color="#444" />
      <ColorBloom />
      <FocusShift />
      <LiquidDistortion />
      <VelocitySkew />
      <CircularCarousel />

      {/* Phase 4: Layout & Structure */}
      <SectionPlaceholder title="Phase 4: Layout & Structure" color="#555" />
      <CardStack />
      <ScaleDownToGrid />
      <PinZoom />
      <TypographyMask />
      <SplitScreenReveal />

      <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#555' }}>
        End of Demo
      </div>
    </div>
  );
};

export default ScrollytellingDemo;