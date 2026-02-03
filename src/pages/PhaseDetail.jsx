import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// import { Leva } from 'leva'; // 已禁用：移除调试面板
import { useTitle } from '../hooks/useTitle';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { phasesConfig, getNextPhase } from '../config/phaseConfig';
import LoadingScreen from '../components/LoadingScreen';
import ProductNavigator from '../components/ProductNavigator';
import ProductEndHint from '../components/ProductEndHint';
import {
  IntroScreen,
  PrinciplesScreen,
  ContentScreen,
  ComparisonScreen,
  GalleryScreen,
  SummaryScreen,
  LogoScrollScreen,
  LogoMarqueeScreen,
  LogoStructureScreen,
  LogoFocusLensScreen,
  BrandIdentityScreen,
  CorePrinciplesScreen,
  StabilityMessageScreen,
  PhaseClosingScreen,
  ValidationStickyScreen,
  TypographyStickyScreen,
  SummaryTextHighlightScreen,
  ColorRevealScreen,
  BoundariesScreen,
  PriorityGridScreen,
  PackagingGalleryScreen,
  ConsistencyMosaicScreen,
  ComponentShowcaseScreen,
  DocumentGalleryScreen,
  DocumentFocusLensScreen,
  PanoramaMarqueeScreen,
  ScrollDrivenCarousel,
  ThreeRowMarquee, // Add this import
  PanoramaFullScreen,
  StripRowScreen,
  SquareGridScreen,
  ComponentAssemblyScreen,
  FullscreenImageScreen,
  FlyInGalleryScreen,
  PairedDocumentGridScreen,
  SlideGridScreen,
  GroupedCarouselScreen,
  ProgressIndicator,
  ProcessAnchor, // Import ProcessAnchor
  responsiveStyles,
  PhaseTocScreen, // Add PhaseTocScreen
  FactoryGalleryScreen, // 工厂图展示组件
  PopupSequenceScreen, // 弹出序列组件
  RowByRowPopupGrid, // 逐行弹出网格组件
  ProductPairScrollScreen, // 配对滚动展示组件
  TwoRowStaticScreen, // 两行静态展示组件
  NaturalParallaxGrid, // 自然滚动视差网格组件
  AutoSequencePopup, // 自动顺序弹出组件
  TransitionProvider,
  // TransitionDebugger, // 已禁用：移除调试工具
} from '../components/PhaseScreens';
// import { ExportConfigButton } from '../components/PhaseScreens/ExportConfigButton'; // 已禁用：移除调试工具

// 主组件
const PhaseDetail = () => {
  const { phaseId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(1);
  const isMobile = useIsMobile();
  
  const phase = phasesConfig[phaseId];
  const nextPhaseConfig = getNextPhase(phaseId);
  
  // 产品切换状态（仅在phase-06中启用）
  const hasProductFilter = phase?.products && phase.products.length > 0;
  const [currentProduct, setCurrentProduct] = useState(
    hasProductFilter ? phase.products[0] : null
  );
  
  // 根据当前产品过滤screens
  const filteredScreens = useMemo(() => {
    if (!phase || !hasProductFilter) {
      return phase?.screens || [];
    }
    
    // 过滤：保留intro(product=null) + 当前产品的screens
    return phase.screens.filter(screen => 
      screen.product === null || screen.product === currentProduct
    );
  }, [phase, currentProduct, hasProductFilter]);
  
  // 产品切换处理：切换产品并滚动到该产品的第一屏
  const handleProductChange = useCallback((newProduct) => {
    setCurrentProduct(newProduct);
    
    // 延迟执行滚动，等待DOM更新
    setTimeout(() => {
      // 找到第一个属于新产品的screen的wrapper
      const firstProductScreen = document.querySelector(
        `.phase-screen-wrapper[data-product="${newProduct}"]`
      );
      
      if (firstProductScreen) {
        firstProductScreen.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  }, []);
  
  useTitle(t(`case.phases.${phaseId}.title`) + ' | ' + t('case.pageTitle'));
  
  // 收集所有需要预加载的图片 URL
  const imageUrls = useMemo(() => {
    if (!phase) return [];
    
    const urls = [];
    // 修复 BASE_URL 路径拼接：确保正确处理前导斜杠
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizeUrl = (path) => {
      // 严格类型检查：确保 path 是字符串
      if (!path || typeof path !== 'string') {
        console.warn('[PhaseDetail] Invalid path type:', typeof path, path);
        return null;
      }
      // 移除路径开头的斜杠，因为 baseUrl 已包含
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      return baseUrl + cleanPath;
    };
    
    phase.screens.forEach(screenConfig => {
      // 收集 bgImage
      if (screenConfig.bgImage) {
        urls.push(normalizeUrl(screenConfig.bgImage));
      }
      
      // 收集 image（单图）
      if (screenConfig.image) {
        urls.push(normalizeUrl(screenConfig.image));
      }
      
      // 收集 images 数组
      if (screenConfig.images && Array.isArray(screenConfig.images)) {
        screenConfig.images.forEach(img => {
          if (typeof img === 'string') {
            urls.push(normalizeUrl(img));
          } else if (img && img.src) {
            urls.push(normalizeUrl(img.src));
          }
        });
      }
      
      // 收集 marqueeImages, sceneImages, carouselImages
      ['marqueeImages', 'sceneImages', 'carouselImages'].forEach(key => {
        if (screenConfig[key] && Array.isArray(screenConfig[key])) {
          screenConfig[key].forEach(img => {
            if (typeof img === 'string') {
              urls.push(normalizeUrl(img));
            } else if (img && img.src) {
              urls.push(normalizeUrl(img.src));
            }
          });
        }
      });
      
      // 收集 mainImages, subImages
      ['mainImages', 'subImages'].forEach(key => {
        if (screenConfig[key] && Array.isArray(screenConfig[key])) {
          screenConfig[key].forEach(img => {
            if (typeof img === 'string') {
              urls.push(normalizeUrl(img));
            } else if (img && img.src) {
              urls.push(normalizeUrl(img.src));
            }
          });
        }
      });
      
      // 收集 imageGroups（二维数组）
      if (screenConfig.imageGroups && Array.isArray(screenConfig.imageGroups)) {
        screenConfig.imageGroups.forEach(group => {
          if (Array.isArray(group)) {
            group.forEach(img => {
              if (typeof img === 'string') {
                urls.push(normalizeUrl(img));
              } else if (img && img.src) {
                urls.push(normalizeUrl(img.src));
              }
            });
          }
        });
      }
      
      // 收集 groups（分组数据）
      if (screenConfig.groups && Array.isArray(screenConfig.groups)) {
        screenConfig.groups.forEach(group => {
          if (group.images && Array.isArray(group.images)) {
            group.images.forEach(img => {
              if (typeof img === 'string') {
                urls.push(normalizeUrl(img));
              } else if (img && img.src) {
                urls.push(normalizeUrl(img.src));
              }
            });
          }
        });
      }
      
      // 收集 pairs（配对数据）
      if (screenConfig.pairs && Array.isArray(screenConfig.pairs)) {
        screenConfig.pairs.forEach(pair => {
          if (pair.images && Array.isArray(pair.images)) {
            pair.images.forEach(img => {
              if (typeof img === 'string') {
                urls.push(normalizeUrl(img));
              } else if (img && img.src) {
                urls.push(normalizeUrl(img.src));
              }
            });
          }
        });
      }
      
      // 收集 accessoryImages, accessoryBackImages
      ['accessoryImages', 'accessoryBackImages'].forEach(key => {
        if (screenConfig[key] && Array.isArray(screenConfig[key])) {
          screenConfig[key].forEach(img => {
            if (typeof img === 'string') {
              urls.push(normalizeUrl(img));
            } else if (img && img.src) {
              urls.push(normalizeUrl(img.src));
            }
          });
        }
      });
    });
    
    // 去重并过滤空值
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '');
    
    console.log('[PhaseDetail] Collected image URLs:', uniqueUrls.length);
    console.log('[PhaseDetail] Sample URLs:', uniqueUrls.slice(0, 5));
    
    return uniqueUrls;
  }, [phase]);
  
  // 添加标志位，确保每个 Phase 只加载一次
  const [hasPreloaded, setHasPreloaded] = useState(false);
  // 添加 canEnter 状态，由动画完成回调控制
  const [canEnter, setCanEnter] = useState(false);
  
  // 使用图片预加载 Hook（50% 阈值策略）
  const { isLoading, progress, loadedCount, totalCount } = useImagePreloader(imageUrls, {
    enabled: !hasPreloaded, // 如果已经预加载过，则禁用
    threshold: 50, // 加载 50% 后即可进入页面
    onThresholdReached: (info) => {
      console.log('[PhaseDetail] ✅ 50% threshold reached! (真实加载)', info);
    },
    onComplete: (stats) => {
      console.log('[PhaseDetail] ✅ 100% loading complete!', stats);
      setHasPreloaded(true); // 标记为已加载
    },
    onProgress: (info) => {
      console.log('[PhaseDetail] Progress update:', info);
    }
  });
  
  // 动画完成回调：只有动画播放完毕且真实加载 >= 50% 时才允许进入
  const handleAnimationComplete = useCallback(() => {
    if (progress >= 50) {
      console.log('[PhaseDetail] ✅ Animation complete! User can enter page.');
      setCanEnter(true);
    }
  }, [progress]);
  
  // 调试输出
  useEffect(() => {
    console.log('[PhaseDetail] Loading state:', { 
      isLoading, 
      canEnter, 
      progress, 
      loadedCount, 
      totalCount, 
      hasPreloaded,
      displayProgress: `真实 ${progress}% → 显示 ${progress >= 50 ? 100 : Math.round((progress / 50) * 100)}%`
    });
  }, [isLoading, canEnter, progress, loadedCount, totalCount, hasPreloaded]);
  
  // 当 phaseId 变化时，重置预加载标志和进入状态
  useEffect(() => {
    setHasPreloaded(false);
    setCanEnter(false);
  }, [phaseId]);
  
  // 滚动监听更新当前屏幕
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.phase-screen-wrapper'); // Changed selector to target wrapper
      // Fallback to sections if wrappers not found (migration safety)
      const targets = sections.length > 0 ? sections : document.querySelectorAll('section');
      
      const scrollTop = window.scrollY + window.innerHeight / 2;
      
      targets.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
          setCurrentScreen(index + 1);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 页面切换时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentScreen(1);
  }, [phaseId]);
  
  if (!phase) {
    return (
      <div style={{ padding: 'var(--space-4xl)', textAlign: 'center' }}>
        <h1>Phase not found</h1>
        <Link to="/work/the-case">← Back to Index</Link>
      </div>
    );
  }

  // 获取 phase 统一背景色，默认深黑
  const phaseBgColor = phase.bgColor || '#0a0a0a';

  // 渲染单个屏幕
  const renderScreen = (screenConfig, index) => {
    const screenNumber = String(index + 1).padStart(2, '0');
    const screenLabel = t(`case.screenLabels.${screenConfig.id}`, { defaultValue: screenConfig.id });
    const screenData = t(`case.phases.${phase.id}.screens.${screenConfig.id}`, { returnObjects: true });
    
    // 特殊处理 Logo 屏幕 (旧逻辑，现在通过 type 判断)
    if (screenConfig.id === 'logo' && phase.id === 'phase-01') {
      return (
        <LogoScrollScreen
          key={screenConfig.id}
          screenNumber={screenNumber}
          screenLabel={screenLabel}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Validation 屏幕 (Phase 01) - 使用 Sticky 布局
    if (screenConfig.id === 'validation' && phase.id === 'phase-01') {
      return (
        <ValidationStickyScreen
          key={screenConfig.id}
          screenNumber={screenNumber}
          screenLabel={screenLabel}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Typography 屏幕 (Phase 01) - 使用 Sticky 布局
    if (screenConfig.id === 'typography' && phase.id === 'phase-01') {
      return (
        <TypographyStickyScreen
          key={screenConfig.id}
          screenNumber={screenNumber}
          screenLabel={screenLabel}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Summary 屏幕 (Phase 01) - 使用 Text Highlight 布局
    if (screenConfig.id === 'summary' && phase.id === 'phase-01') {
      return (
        <SummaryTextHighlightScreen
          key={screenConfig.id}
          title={screenData?.title || ''}
          content={screenData?.content || ''}
        />
      );
    }

    // 特殊处理 Color Reveal 屏幕 (Phase 01)
    if (screenConfig.type === 'color-reveal') {
      return (
        <ColorRevealScreen key={screenConfig.id} />
      );
    }

    switch (screenConfig.type) {
      case 'intro':
        return (
          <IntroScreen
            key={screenConfig.id}
            phaseNumber={phase.number}
            titleEn={phase.titleEn}
            titleZh={t(`case.phases.${phase.id}.title`)}
            content={screenData?.content || ''}
            imageHint={screenConfig.imageHint}
            bgImage={screenConfig.bgImage}
          />
        );

      case 'phase-toc':
        return (
          <PhaseTocScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            images={screenConfig.images || []}
            bgColor={phase.bgColor}
          />
        );
      
      case 'core-principles':
        return (
          <CorePrinciplesScreen key={screenConfig.id} />
        );

      case 'sticky-scroll':
        return (
          <ValidationStickyScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images} // Pass images from config
          />
        );

      case 'boundaries':
        return (
          <BoundariesScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
          />
        );

      case 'priority-grid':
        return (
          <PriorityGridScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'packaging-gallery':
        return (
          <PackagingGalleryScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'consistency-mosaic':
        return (
          <ConsistencyMosaicScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'component-showcase':
        return (
          <ComponentShowcaseScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            mainImages={screenConfig.mainImages || []}
            subImages={screenConfig.subImages || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'document-gallery':
        return (
          <DocumentGalleryScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'document-focus-lens':
        return (
          <DocumentFocusLensScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'panorama-marquee':
        return (
          <PanoramaMarqueeScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            marqueeImages={screenConfig.marqueeImages || []}
            sceneImages={screenConfig.sceneImages || []}
            carouselImages={screenConfig.carouselImages || []}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'wide-carousel':
        return (
          <ScrollDrivenCarousel
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'three-row-marquee':
        return (
          <section
            key={screenConfig.id}
            style={{
              minHeight: '100vh',
              background: '#000', // 统一纯黑背景
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-4xl) 0',
            }}
          >
            <ThreeRowMarquee
              images={screenConfig.images || []}
              bgColor="#000" // 统一纯黑背景
              showGradient={screenConfig.showGradient !== false} // 默认 true，配置为 false 时关闭
            />
          </section>
        );

      case 'square-grid':
        return (
          <SquareGridScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 4} // 新增：列数配置
            accessoryImages={screenConfig.accessoryImages || []}
            accessoryBackImages={screenConfig.accessoryBackImages || []}
            noBorder={screenConfig.noBorder || false} // 无边框样式
            imageScale={screenConfig.imageScale} // 新增：图片缩放比例
            gap={screenConfig.gap} // 新增：自定义间距
            bgColor="#000"
          />
        );

      case 'natural-parallax-grid':
        return (
          <NaturalParallaxGrid
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenConfig.title || ''}
            groups={screenConfig.groups || []}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 3}
            gap={screenConfig.gap || '24px'}
            paddingTop={screenConfig.paddingTop || 60}
            bgColor={screenConfig.bgColor || '#000'}
            parallaxIntensity={screenConfig.parallaxIntensity || 0.3}
          />
        );

      case 'strip-row':
        return (
          <StripRowScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'panorama-full':
        return (
          <PanoramaFullScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            image={screenConfig.image}
            bgColor="#000"
          />
        );

      case 'component-assembly':
        return (
          <ComponentAssemblyScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
          />
        );

      case 'fullscreen-image':
        return (
          <FullscreenImageScreen
            key={screenConfig.id}
            bgImage={screenConfig.bgImage}
          />
        );

      case 'fly-in-gallery':
        return (
          <FlyInGalleryScreen
            key={screenConfig.id}
            id={screenConfig.id}
            phaseId={phase.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            imageHeight={screenConfig.imageHeight || '50vh'}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'paired-document-grid':
        return (
          <PairedDocumentGridScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            imageGroups={screenConfig.imageGroups || []}
            bgColor="#000"
          />
        );

      case 'slide-grid':
        return (
          <SlideGridScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'grouped-carousel':
        return (
          <GroupedCarouselScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            groups={screenConfig.groups || []}
            bgColor="#000"
          />
        );

      case 'product-pair-scroll':
        return (
          <ProductPairScrollScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            pairs={screenConfig.pairs || []}
            bgColor="#000"
          />
        );

      case 'two-row-static':
        return (
          <TwoRowStaticScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenConfig.title || screenData?.title || ''}
            layout={screenConfig.layout}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'factory-gallery':
        return (
          <FactoryGalleryScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            emphasis={screenData?.emphasis || ''}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 4}
            bgAlt={screenConfig.bgAlt}
          />
        );

      case 'popup-sequence':
        return (
          <PopupSequenceScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'auto-sequence-popup':
        return (
          <AutoSequencePopup
            key={screenConfig.id}
            images={screenConfig.images || []}
            interval={screenConfig.interval || 300}
            duration={screenConfig.duration || 0.6}
            bgColor={screenConfig.bgColor || phaseBgColor || '#000'}
          />
        );

      case 'row-by-row-popup':
        return (
          <RowByRowPopupGrid
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 5}
            bgColor="#000"
            enableFadeIn={screenConfig.id === 'packaging-grid-2'} // 为第二屏启用淡入效果
          />
        );

      case 'stability-message':
        return (
          <StabilityMessageScreen key={screenConfig.id} />
        );

      case 'principles':
        return (
          <PrinciplesScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            principles={screenConfig.items?.map(key => ({
              key,
              title: screenData?.items?.[key]?.title || key,
              desc: screenData?.items?.[key]?.desc || ''
            })) || []}
          />
        );
      
      case 'brand-identity':
        return (
          <BrandIdentityScreen key={screenConfig.id} />
        );
      
      case 'logo-scroll':
        return (
          <LogoScrollScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
          />
        );
      
      case 'logo-marquee':
        return (
          <LogoMarqueeScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
          />
        );
      
      case 'logo-structure':
        return (
          <LogoStructureScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            // 显式传入图片路径，确保正确
            imageSrc={`${import.meta.env.BASE_URL}images/phase-01/logo-structure.png`}
          />
        );
      
      case 'logo-focus-lens':
        return (
          <LogoFocusLensScreen
            key={screenConfig.id}
          />
        );
      
      case 'content':
        return (
          <ContentScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            note={screenData?.note}
            imageHint={screenConfig.imageHint}
            reverse={screenConfig.reverse}
            bgAlt={screenConfig.bgAlt}
            customImage={screenConfig.bgImage} // Pass customImage from config
          />
        );
      
      case 'comparison':
        return (
          <ComparisonScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            note={screenData?.note}
            leftHint={screenConfig.leftHint}
            rightHint={screenConfig.rightHint}
            leftLabel={screenConfig.leftLabel}
            rightLabel={screenConfig.rightLabel}
            images={screenConfig.images || []}
            imageOffsetY={screenConfig.imageOffsetY} // 传递图片 Y 轴偏移量
            bgAlt={screenConfig.bgAlt}
          />
        );
      
      case 'gallery':
        return (
          <GalleryScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 2}
            bgAlt={screenConfig.bgAlt}
          />
        );
      
      case 'phase-closing':
        return (
          <PhaseClosingScreen
            key={screenConfig.id}
            bgImage={screenConfig.bgImage}
            nextPhase={nextPhaseConfig ? {
              id: nextPhaseConfig.id,
              titleZh: t(`case.phases.${nextPhaseConfig.id}.title`)
            } : null}
            backLabel={t('case.backToIndex')}
            nextLabel={t('case.nextPhase')}
            onNavigate={navigate}
          />
        );
      
      case 'summary':
        return (
          <SummaryScreen
            key={screenConfig.id}
            id={screenConfig.id} // Pass ID
            phaseId={phase.id}   // Pass Phase ID
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            imageHint={screenConfig.imageHint}
            nextPhase={nextPhaseConfig ? {
              id: nextPhaseConfig.id,
              titleZh: t(`case.phases.${nextPhaseConfig.id}.title`)
            } : null}
            backLabel={t('case.backToIndex')}
            nextLabel={t('case.nextPhase')}
            onNavigate={navigate}
          />
        );
      
      default:
        return null;
    }
  };

  // 开发环境启用调试模式
  const isDev = import.meta.env.DEV;

  return (
    <>
      {/* 加载屏幕 - 使用 !canEnter 控制显示，动画至少 2.5 秒 */}
      <LoadingScreen 
        isVisible={!canEnter}
        realProgress={progress}
        loadedCount={loadedCount}
        totalCount={totalCount}
        phaseNumber={phase.number}
        threshold={50}
        minDuration={2500}
        onAnimationComplete={handleAnimationComplete}
      />
      
      <TransitionProvider debug={false}>
        <style>{responsiveStyles}</style>
      
      {/* Leva 调试面板 - 已完全禁用（移除右上角参数调节窗口） */}
      {/* 
        如需在开发环境启用 Leva 调试面板，请：
        1. 将上方 debug={false} 改为 debug={isDev}
        2. 取消下方 <Leva> 组件的注释
      */}
      {/* {isDev && (
        <>
          <Leva 
            collapsed={true}
            oneLineLabels={false}
            flat={false}
            theme={{
              colors: {
                accent1: '#FF4600',
                accent2: '#FF7A3D',
                accent3: '#FF4600',
                elevation1: '#1a1a1a',
                elevation2: '#2a2a2a',
                elevation3: '#3a3a3a',
              },
              fontSizes: {
                root: '11px',
              },
            }}
            titleBar={{
              title: '🎛️ Transition Debugger',
              drag: true,
              filter: true,
            }}
          />
          <ExportConfigButton />
        </>
      )} */}
      
      <div style={{ 
        position: 'relative', 
        background: phaseBgColor,
        '--phase-bg-color': phaseBgColor 
      }}>
        {/* 桌面端：左上角悬浮胶囊导航 */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: currentScreen > 1 ? 1 : 0, 
              y: currentScreen > 1 ? 0 : -20,
              pointerEvents: currentScreen > 1 ? 'auto' : 'none'
            }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '24px',
              left: '24px',
              zIndex: 100,
            }}
          >
            <Link 
              to="/work/the-case" 
              style={{ 
                textDecoration: 'none', 
                color: '#fff', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <span>←</span>
              <span style={{ fontWeight: 500 }}>{t('case.backToToc')}</span>
              <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span>
              <span style={{ opacity: 0.8 }}>Phase {phase.number}</span>
            </Link>
          </motion.div>
        )}

        {/* 移动端：底部固定导航栏 */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: currentScreen > 1 ? 1 : 0, 
              y: currentScreen > 1 ? 0 : 20,
              pointerEvents: currentScreen > 1 ? 'auto' : 'none'
            }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '56px',
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              zIndex: 100,
            }}
          >
            {/* 返回按钮 */}
            <Link 
              to="/work/the-case" 
              style={{ 
                textDecoration: 'none', 
                color: '#fff', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                minWidth: '44px',
                minHeight: '44px',
                justifyContent: 'center'
              }}
            >
              <span>←</span>
              <span>{t('case.backToToc')}</span>
            </Link>

            {/* 中间：Phase 信息和进度 */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ 
                color: '#fff', 
                fontSize: '0.75rem',
                opacity: 0.8,
                fontWeight: 500
              }}>
                Phase {phase.number}
              </span>
              {/* 进度条 */}
              <div style={{
                width: '80px',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <motion.div 
                  style={{
                    height: '100%',
                    background: '#fff',
                    borderRadius: '2px'
                  }}
                  animate={{
                    width: `${(currentScreen / filteredScreens.length) * 100}%`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* 右侧：屏幕计数 */}
            <div style={{
              color: '#fff',
              fontSize: '0.75rem',
              opacity: 0.6,
              minWidth: '60px',
              textAlign: 'right'
            }}>
              {currentScreen} / {filteredScreens.length}
            </div>
          </motion.div>
        )}
        
        {/* 产品导航栏 - 仅在有产品分类时显示 */}
        {hasProductFilter && (
          <ProductNavigator
            products={phase.products}
            currentProduct={currentProduct}
            onProductChange={handleProductChange}
            visible={currentScreen > 1}
          />
        )}

        {/* 进度指示器 */}
        <ProgressIndicator 
          currentScreen={currentScreen} 
          totalScreens={filteredScreens.length} 
        />

        {/* Process Anchor Navigation */}
        {phase.processFlow && (
          <ProcessAnchor 
            screens={phase.processFlow.screens}
            labels={phase.processFlow.labels}
            phaseId={phase.id}
          />
        )}
        
        {/* 渲染所有屏幕（使用过滤后的screens） */}
        {filteredScreens.map((screenConfig, index) => {
          // 检测是否为当前产品的最后一屏
          const isLastOfProduct = hasProductFilter && 
            screenConfig.product === currentProduct && 
            index === filteredScreens.length - 1;
          
          return (
            <React.Fragment key={screenConfig.id}>
              <div 
                id={screenConfig.id} 
                className="phase-screen-wrapper"
                data-product={screenConfig.product || 'common'}
                style={{ width: '100%', position: 'relative' }}
              >
                {renderScreen(screenConfig, index)}
              </div>
              
              {/* 在每个产品的最后一屏后插入提示 */}
              {isLastOfProduct && (
                <ProductEndHint 
                  currentProduct={currentProduct}
                  availableProducts={phase.products}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </TransitionProvider>
    </>
  );
};

export default PhaseDetail;
