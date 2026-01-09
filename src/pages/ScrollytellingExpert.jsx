import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import Matter from 'matter-js';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, Text, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';

// ============================================
// Phase 1: Foundation & Lightweight
// ============================================

// 1. Variable Font Breathing (可变字体呼吸)
const VariableFontBreathing = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 映射滚动进度到字体粗细 (100-900) 和 宽度 (75-100)
  const weight = useTransform(scrollYProgress, [0, 0.5, 1], [100, 900, 100]);
  const width = useTransform(scrollYProgress, [0, 0.5, 1], [75, 100, 75]);
  const slant = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);

  return (
    <div ref={ref} style={{ height: '150vh', position: 'relative', background: '#fff', color: '#000', overflow: 'hidden' }}>
      {/* 引入 Roboto Flex 可变字体 */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:slnt,wdth,wght@-10..0,25..151,100..1000&display=swap');
        `}
      </style>
      
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h2 style={{ position: 'absolute', top: '30px', fontSize: '1.5rem', color: '#333' }}>1. Variable Font Breathing</h2>
        
        <motion.div 
          style={{ 
            fontFamily: '"Roboto Flex", sans-serif',
            fontSize: 'clamp(4rem, 10vw, 12rem)',
            lineHeight: 1,
            textAlign: 'center',
            // 直接使用 fontVariationSettings
            fontVariationSettings: useTransform(
              [weight, width, slant], 
              ([w, wd, s]) => `'wght' ${w}, 'wdth' ${wd}, 'slnt' ${s}`
            )
          }}
        >
          BREATHE
        </motion.div>
        
        <p style={{ marginTop: '40px', color: '#666', maxWidth: '500px', textAlign: 'center' }}>
          Scroll to see the font weight, width, and slant change organically.
        </p>
      </div>
    </div>
  );
};

// 2. Kinetic Typography on Path (路径动态排版)
const KineticTypography = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const startOffset = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} style={{ height: '200vh', position: 'relative', background: '#111', color: '#fff', overflow: 'hidden' }}>
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <h2 style={{ position: 'absolute', top: '30px', fontSize: '1.5rem', color: '#fff' }}>2. Kinetic Typography on Path</h2>
        
        <svg width="100%" height="100%" viewBox="0 0 1000 600" style={{ overflow: 'visible' }}>
          <path 
            id="curvePath" 
            d="M 50 300 Q 250 100 500 300 T 950 300" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="2"
          />
          <text fill="#fff" fontSize="60" fontWeight="bold" style={{ textTransform: 'uppercase' }}>
            <motion.textPath 
              href="#curvePath" 
              startOffset={startOffset}
              style={{ fill: '#fff' }}
            >
              Flowing text along a curved path • Scrollytelling • Interaction • 
            </motion.textPath>
          </text>
        </svg>
      </div>
    </div>
  );
};

// 3. Dynamic Navbar Morphing (导航栏形态衍变)
const DynamicNavbar = () => {
  const ref = useRef(null);
  const [variant, setVariant] = useState('full'); // full, capsule, side
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.2) setVariant('full');
    else if (latest < 0.7) setVariant('capsule');
    else setVariant('side');
  });

  const variants = {
    full: {
      top: 40,
      left: '50%',
      x: '-50%',
      width: '90%',
      height: '80px',
      borderRadius: '12px',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '0 40px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)'
    },
    capsule: {
      top: 40,
      left: '50%',
      x: '-50%',
      width: '400px',
      height: '60px',
      borderRadius: '30px',
      flexDirection: 'row',
      justifyContent: 'center',
      padding: '0 20px',
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(15px)'
    },
    side: {
      top: '50%',
      left: '40px',
      x: '0%',
      y: '-50%',
      width: '60px',
      height: '300px',
      borderRadius: '30px',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '20px 0',
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)'
    }
  };

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#0a0a0a' }}>
      {/* 模拟页面内容 */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <h2 style={{ position: 'absolute', top: '150px', width: '100%', textAlign: 'center', fontSize: '1.5rem', color: '#fff' }}>3. Dynamic Navbar Morphing</h2>
        
        {/* 动态导航栏 */}
        <motion.nav
          initial="full"
          animate={variant}
          variants={variants}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            zIndex: 100,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>LOGO</div>
          
          <motion.div 
            style={{ 
              display: 'flex', 
              gap: '20px',
              flexDirection: variant === 'side' ? 'column' : 'row'
            }}
          >
            {['Home', 'Work', 'About', 'Contact'].map((item) => (
              <span key={item} style={{ color: '#fff', opacity: 0.8, cursor: 'pointer', fontSize: '0.9rem' }}>
                {variant === 'side' ? item[0] : item}
              </span>
            ))}
          </motion.div>
          
          {variant !== 'side' && (
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fff' }}></div>
          )}
        </motion.nav>

        <div style={{ position: 'absolute', bottom: '100px', width: '100%', textAlign: 'center', color: '#666' }}>
          Current State: <span style={{ color: '#fff', textTransform: 'uppercase' }}>{variant}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Phase 2: Physics Interaction
// ============================================

// 4. Physics Gravity Fall (物理重力堆积)
const PhysicsGravityFall = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.3 && !hasTriggered) {
        setHasTriggered(true);
        initPhysics();
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, hasTriggered]);

  const initPhysics = () => {
    if (!sceneRef.current || engineRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create renderer
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // Create boundaries
    const ground = Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true, render: { fillStyle: '#333' } });
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Create falling items
    const items = [];
    const colors = ['#ff5f6d', '#ffc371', '#11998e', '#38ef7d', '#667eea', '#764ba2'];
    const labels = ['React', 'Vue', 'Angular', 'Svelte', 'Node', 'Deno', 'Next', 'Nuxt', 'Remix', 'Astro'];

    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = -Math.random() * 1000 - 100; // Start above screen
      const size = 30 + Math.random() * 40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Randomly choose between circle and rectangle
      let body;
      if (Math.random() > 0.5) {
        body = Bodies.circle(x, y, size / 2, {
          restitution: 0.8,
          render: { fillStyle: color }
        });
      } else {
        body = Bodies.rectangle(x, y, size, size, {
          restitution: 0.6,
          render: { fillStyle: color }
        });
      }
      items.push(body);
    }

    Composite.add(engine.world, items);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Run the engine
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        Matter.Composite.clear(engineRef.current.world);
      }
      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '200vh', position: 'relative', background: '#111' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ 
          position: 'absolute', 
          top: '30px', 
          width: '100%', 
          textAlign: 'center', 
          fontSize: '1.5rem', 
          color: '#fff',
          zIndex: 10
        }}>
          4. Physics Gravity Fall
        </h2>
        
        <div 
          ref={sceneRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            cursor: 'grab' 
          }} 
        />
        
        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          width: '100%', 
          textAlign: 'center', 
          color: '#666',
          pointerEvents: 'none'
        }}>
          {hasTriggered ? 'Drag the shapes with your mouse!' : 'Scroll down to trigger gravity...'}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Phase 3: WebGL Visuals
// ============================================

// 5. Dolly Zoom (希区柯克变焦)
const DollyZoomScene = ({ scrollYProgress }) => {
  const cameraRef = useRef();
  const subjectRef = useRef();
  
  useFrame(() => {
    if (!cameraRef.current) return;
    
    // Get current scroll progress (0 to 1)
    const progress = scrollYProgress.get();
    
    // Calculate FOV: 10 (telephoto) -> 120 (wide)
    const fov = 10 + progress * 110;
    cameraRef.current.fov = fov;
    
    // Calculate Distance to keep subject size constant
    // distance = (height / 2) / tan(fov / 2)
    // We want the text to appear roughly the same size
    // Let's assume a reference distance of 20 at 10 degrees FOV
    // tan(5deg) ~= 0.087
    // constant = 20 * 0.087 = 1.74
    
    const rad = (fov * Math.PI) / 180;
    const distance = 1.74 / Math.tan(rad / 2);
    
    cameraRef.current.position.z = distance;
    cameraRef.current.updateProjectionMatrix();
    
    // Optional: Rotate subject slightly based on scroll
    if (subjectRef.current) {
      subjectRef.current.rotation.y = progress * Math.PI * 0.2;
      subjectRef.current.rotation.x = progress * Math.PI * 0.1;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} ref={cameraRef} />
      
      {/* Replace Environment with basic lights to avoid CDN loading issues */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0000" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Replace Text with a geometric shape to avoid Font loading issues */}
        <mesh ref={subjectRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fff" roughness={0.2} metalness={0.8} />
        </mesh>
        
        {/* Background elements to emphasize the perspective shift */}
        {[...Array(20)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 10, 
              (Math.random() - 0.5) * 10, 
              -5 - Math.random() * 20
            ]}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#ff5f6d" : "#4facfe"} />
          </mesh>
        ))}
      </Float>
      <ContactShadows opacity={0.5} scale={10} blur={2.5} far={10} resolution={256} color="#000000" />
    </>
  );
};

const DollyZoom = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <Canvas>
          <Suspense fallback={null}>
            <DollyZoomScene scrollYProgress={scrollYProgress} />
          </Suspense>
        </Canvas>
        
        <div style={{ 
          position: 'absolute', 
          bottom: '50px', 
          width: '100%', 
          textAlign: 'center', 
          color: '#fff',
          pointerEvents: 'none',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>5. Dolly Zoom</h2>
          <p style={{ opacity: 0.7 }}>Subject size stays constant while background perspective shifts</p>
        </div>
      </div>
    </div>
  );
};

// 主页面组件
const ScrollytellingExpert = () => {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      {/* Hero */}
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #000 0%, #111 100%)'
      }}>
        <Link to="/showcase-demos" style={{ position: 'absolute', top: '30px', left: '30px', color: '#666', textDecoration: 'none' }}>
          ← Back to Demos
        </Link>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', margin: 0, textAlign: 'center', background: 'linear-gradient(to right, #fff, #666)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Scrollytelling<br/>Expert
        </h1>
        <p style={{ color: '#666', fontSize: '1.2rem', marginTop: '20px' }}>
          Phase 3: WebGL Visuals
        </p>
        <div style={{ marginTop: '50px', color: '#444' }}>↓ Scroll to Explore</div>
      </div>

      <VariableFontBreathing />
      <KineticTypography />
      <DynamicNavbar />
      <PhysicsGravityFall />
      <DollyZoom />

      <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#444' }}>
        More phases coming soon...
      </div>
    </div>
  );
};

export default ScrollytellingExpert;