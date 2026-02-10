import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  ScrollTextBar, // 滚动驱动的横向文字过渡组件
  TwoColumnShowcase, // 两列图片展示组件
  AutoSequencePopup, // 自动顺序弹出组件
  TransitionProvider,
  LayoutDebugPanel, // 布局调试面板
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
  
  // 开发环境启用调试模式
  const isDev = import.meta.env.DEV;
  
  // 调试参数状态 - 用于实时预览
  const [debugParams, setDebugParams] = useState({});
  
  const phase = phasesConfig[phaseId];
  const nextPhaseConfig = getNextPhase(phaseId);
  
  // 产品切换状态（仅在phase-06中启用）
  const hasProductFilter = phase?.products && phase.products.length > 0;
  const [currentProduct, setCurrentProduct] = useState(
    hasProductFilter ? phase.products[0] : null
  );
  
  // 根据当前产品过滤screens
  const filteredScreens = useMemo(() => {
    if (!phase) return [];
    
    let screens = phase.screens || [];
    
    // 产品过滤：保留intro(product=null) + 当前产品的screens
    if (hasProductFilter) {
      screens = screens.filter(screen => 
        screen.product === null || screen.product === currentProduct
      );
    }
    
    // 移动端优化：将相邻的 auto-sequence-popup 屏幕两两合并
    if (isMobile && phaseId === 'phase-06') {
      const mergedScreens = [];
      let i = 0;
      
      while (i < screens.length) {
        const current = screens[i];
        const next = screens[i + 1];
        
        // 检查当前和下一个是否都是 auto-sequence-popup 类型
        if (current.type === 'auto-sequence-popup' && 
            next && next.type === 'auto-sequence-popup') {
          // 合并两个屏幕：添加 dualMode 和 images2 属性
          mergedScreens.push({
            ...current,
            dualMode: true,
            images2: next.images || [],
            // 合并后的 ID 包含两个屏幕
            mergedId: `${current.id}-${next.id}`
          });
          i += 2; // 跳过下一个屏幕
        } else {
          // 不合并，正常添加
          mergedScreens.push(current);
          i += 1;
        }
      }
      
      return mergedScreens;
    }
    
    return screens;
  }, [phase, currentProduct, hasProductFilter, isMobile, phaseId]);
  
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
        // 使用瞬时滚动（instant），避免在平滑滚动期间触发途经屏幕的动画
        firstProductScreen.scrollIntoView({ 
          behavior: 'instant', 
          block: 'start' 
        });
      }
    }, 150);
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
    
    return uniqueUrls;
  }, [phase]);

  // Phase 06 专属：产品封面图映射
  const productImages = useMemo(() => {
    if (phaseId !== 'phase-06') return {};
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalize = (path) => path.startsWith('/') ? path.substring(1) : path;
    const fullPath = (path) => `${baseUrl}${normalize(path)}`;

    return {
      'cube': fullPath('images/phase-06/covers/cube.png'), // 本地图片路径：public/images/phase-06/covers/cube.png
      'nicotine-sugar': fullPath('images/phase-06/covers/nicotine-sugar.png'), // 本地图片路径：public/images/phase-06/covers/nicotine-sugar.png
      'motor': fullPath('images/phase-06/covers/motor.png') // 本地图片路径：public/images/phase-06/covers/motor.png
    };
  }, [phaseId]);
  
  // 添加标志位，确保每个 Phase 只加载一次
  const [hasPreloaded, setHasPreloaded] = useState(false);
  // 添加 canEnter 状态，由动画完成回调控制
  const [canEnter, setCanEnter] = useState(false);
  
  // 使用图片预加载 Hook（50% 阈值策略）
  const { isLoading, progress, loadedCount, totalCount, fromCache } = useImagePreloader(imageUrls, {
    enabled: !hasPreloaded, // 如果已经预加载过，则禁用
    threshold: 50, // 加载 50% 后即可进入页面
    pageId: `phase-${phaseId}`, // 每个 Phase 独立缓存标识
    onComplete: (stats) => {
      setHasPreloaded(true); // 标记为已加载
    },
  });
  
  // 动画完成回调：只有动画播放完毕且真实加载 >= 50% 时才允许进入
  const handleAnimationComplete = useCallback(() => {
    if (progress >= 50) {
      setCanEnter(true);
    }
  }, [progress]);
  
  // 🚀 缓存命中时直接跳过加载页（不等待动画）
  useEffect(() => {
    if (fromCache && !canEnter) {
      console.log(`[PhaseDetail] 🚀 Cache hit for phase-${phaseId}! Skipping loading screen.`);
      setCanEnter(true);
    }
  }, [fromCache, canEnter, phaseId]);
  
  // 当 phaseId 变化时，重置预加载标志和进入状态
  useEffect(() => {
    setHasPreloaded(false);
    setCanEnter(false);
  }, [phaseId]);
  
  // 滚动监听更新当前屏幕（仅桌面端需要，移动端使用按钮控制）
  useEffect(() => {
    // 移动端使用按钮式翻页，不需要滚动监听
    if (isMobile) return;
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('.phase-screen-wrapper');
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
  }, [isMobile]);

  // 页面切换时重置状态
  useEffect(() => {
    // 移动端使用按钮式翻页，只需重置屏幕索引
    // 桌面端需要滚动到顶部
    if (!isMobile) {
      window.scrollTo(0, 0);
    }
    setCurrentScreen(1);
  }, [phaseId, isMobile]);
  
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

  // 合并调试参数到屏幕配置（用于实时预览）
  const mergeDebugParams = useCallback((config) => {
    if (!isDev || !debugParams || Object.keys(debugParams).length === 0) {
      return config;
    }
    // 只有当前屏幕才应用调试参数
    const currentConfig = filteredScreens[currentScreen - 1];
    if (currentConfig && currentConfig.id === config.id) {
      return { ...config, ...debugParams };
    }
    return config;
  }, [isDev, debugParams, currentScreen, filteredScreens]);

  // 渲染单个屏幕
  const renderScreen = (screenConfig, index) => {
    // 合并调试参数（实时预览）
    const config = mergeDebugParams(screenConfig);
    // 顶部屏幕标识已移至胶囊导航，组件内不再显示
    const screenNumber = null;
    const screenLabel = null;
    const screenData = t(`case.phases.${phase.id}.screens.${config.id}`, { returnObjects: true });
    
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

    switch (config.type) {
      case 'intro':
        return (
          <IntroScreen
            key={config.id}
            phaseNumber={phase.number}
            titleEn={phase.titleEn}
            titleZh={t(`case.phases.${phase.id}.title`)}
            content={screenData?.content || ''}
            imageHint={config.imageHint}
            bgImage={config.bgImage}
            flashlightInitialPosition={config.flashlightInitialPosition}
          />
        );

      case 'phase-toc':
        // 检查是否需要 sticky 效果
        const isTocSticky = screenConfig.sticky === true;
        const tocStickyHeight = screenConfig.stickyHeight || 200;
        
        if (isTocSticky) {
          return (
            <div
              key={screenConfig.id}
              style={{
                height: `${tocStickyHeight}vh`,
                position: 'relative',
                background: phase.bgColor || '#000',
              }}
            >
              <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <PhaseTocScreen
                  screenNumber={screenNumber}
                  screenLabel={screenLabel}
                  images={screenConfig.images || []}
                  bgColor={phase.bgColor}
                />
              </div>
            </div>
          );
        }
        
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
        // 检查是否需要滚动驱动视差效果（类似幻灯片展示）
        const isPackagingStickyParallax = screenConfig.stickyParallax === true;
        const packagingStickyHeight = screenConfig.stickyHeight || 280;
        
        if (isPackagingStickyParallax) {
          // 滚动驱动视差效果 - 直接传递参数给组件
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
              stickyParallax={true}
              stickyHeight={packagingStickyHeight}
            />
          );
        }
        
        // 普通 sticky 效果
        const isPackagingSticky = screenConfig.scrollBehavior?.sticky === true;
        if (isPackagingSticky) {
          return (
            <div
              key={screenConfig.id}
              style={{
                height: `${packagingStickyHeight}vh`,
                position: 'relative',
                background: '#000',
              }}
            >
              <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
              }}>
                <PackagingGalleryScreen
                  screenNumber={screenNumber}
                  screenLabel={screenLabel}
                  title={screenData?.title || ''}
                  content={screenData?.content || ''}
                  emphasis={screenData?.emphasis || ''}
                  images={screenConfig.images || []}
                  bgAlt={screenConfig.bgAlt}
                />
              </div>
            </div>
          );
        }
        
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
            contentKey={screenConfig.contentKey}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'panorama-marquee':
        // 检查是否需要 sticky 效果
        const isPanoramaSticky = screenConfig.scrollBehavior?.sticky === true;
        const panoramaStickyHeight = screenConfig.stickyHeight || 180;
        
        if (isPanoramaSticky) {
          return (
            <div
              key={screenConfig.id}
              style={{
                height: `${panoramaStickyHeight}vh`,
                position: 'relative',
                background: '#000',
              }}
            >
              <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <PanoramaMarqueeScreen
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
              </div>
            </div>
          );
        }
        
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
        // 检查是否需要 sticky 效果
        const isSticky = screenConfig.scrollBehavior?.sticky === true;
        const stickyHeight = screenConfig.stickyHeight || 150; // 默认 150vh 滚动高度
        
        if (isSticky) {
          // Sticky 模式：跑马灯固定在屏幕，用户需要滚动一段距离才能离开
          return (
            <div
              key={screenConfig.id}
              style={{
                height: `${stickyHeight}vh`, // 滚动高度
                position: 'relative',
                background: '#000',
              }}
            >
              {/* Sticky 容器 */}
              <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: 'var(--space-4xl) 0',
              }}>
                <ThreeRowMarquee
                  images={screenConfig.images || []}
                  bgColor="#000"
                  showGradient={screenConfig.showGradient !== false}
                  content={screenData?.content || ''}
                  contentKey={screenConfig.contentKey}
                />
              </div>
            </div>
          );
        }
        
        // 非 Sticky 模式：普通渲染
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
              content={screenData?.content || ''}
              contentKey={screenConfig.contentKey}
            />
          </section>
        );

      case 'scroll-text-bar':
        return (
          <ScrollTextBar
            key={screenConfig.id}
            contentKey={screenConfig.contentKey}
            content={screenData?.content || ''}
            bgColor={screenConfig.bgColor || '#000'}
            borderColor={screenConfig.borderColor}
            fontSize={screenConfig.fontSize}
            padding={screenConfig.padding}
          />
        );

      case 'square-grid':
        return (
          <SquareGridScreen
            key={screenConfig.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            content={screenData?.content || ''}
            contentKey={screenConfig.contentKey}
            images={screenConfig.images || []}
            columns={screenConfig.columns || 4}
            accessoryImages={screenConfig.accessoryImages || []}
            accessoryBackImages={screenConfig.accessoryBackImages || []}
            noBorder={screenConfig.noBorder || false}
            imageScale={screenConfig.imageScale}
            gap={screenConfig.gap}
            topPadding={screenConfig.topPadding}
            parallaxOffset={screenConfig.parallaxOffset || 0}  // 视差起始偏移量
            bgColor="#000"
          />
        );

      case 'natural-parallax-grid':
        return (
          <NaturalParallaxGrid
            key={config.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={config.title || ''}
            content={config.hideContent ? '' : (screenData?.content || '')}
            contentKey={config.contentKey}
            groups={config.groups || []}
            images={config.images || []}
            columns={config.columns || 3}
            gap={config.gap || '24px'}
            rowGap={config.rowGap}
            paddingTop={config.paddingTop || 60}
            bgColor={config.bgColor || '#000'}
            parallaxIntensity={config.parallaxIntensity || 0.3}
            compactMode={config.compactMode || false}
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
        // 检查是否需要 sticky 效果
        const isAssemblySticky = screenConfig.scrollBehavior?.sticky === true;
        const assemblyStickyHeight = screenConfig.stickyHeight || 200;
        
        if (isAssemblySticky) {
          return (
            <div
              key={screenConfig.id}
              style={{
                height: `${assemblyStickyHeight}vh`,
                position: 'relative',
                background: '#0a0a0a',
              }}
            >
              <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
              }}>
                <ComponentAssemblyScreen
                  screenNumber={screenNumber}
                  screenLabel={screenLabel}
                  title={screenData?.title || ''}
                  content={screenData?.content || ''}
                />
              </div>
            </div>
          );
        }
        
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
        // 检查是否需要 sticky 效果
        const isFlyInSticky = screenConfig.scrollBehavior?.sticky === true;
        const flyInStickyHeight = screenConfig.stickyHeight || 180;
        
        if (isFlyInSticky) {
          return (
            <div
              key={screenConfig.id}
              style={{
                height: `${flyInStickyHeight}vh`,
                position: 'relative',
                background: '#000',
              }}
            >
              <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <FlyInGalleryScreen
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
              </div>
            </div>
          );
        }
        
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
            key={config.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={screenData?.title || ''}
            content={screenData?.content || ''}
            contentKey={config.contentKey}
            groups={config.groups || []}
            bgColor="#000"
            rowGap={config.rowGap || '24px'}
            showGroupLabel={config.showGroupLabel !== false}
            showItemCount={config.showItemCount !== false}
            aspectRatio={config.aspectRatio || '1 / 1'}
            imageScale={config.imageScale || 1}
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
            showLabel={screenConfig.showLabel !== false} // 默认显示标签，配置为 false 时隐藏
          />
        );

      case 'two-row-static':
        return (
          <TwoRowStaticScreen
            key={config.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            title={config.title || screenData?.title || ''}
            content={screenData?.content || ''}
            contentKey={config.contentKey}
            layout={config.layout}
            images={config.images || []}
            bgColor="#000"
            sticky={config.sticky || false}
            stickyHeight={config.stickyHeight || 150}
            showItemCount={config.showItemCount !== false}
            sequentialPopup={config.sequentialPopup || false}
          />
        );

      case 'two-column-showcase':
        return (
          <TwoColumnShowcase
            key={config.id}
            screenNumber={screenNumber}
            screenLabel={screenLabel}
            content={screenData?.content || ''}
            contentKey={config.contentKey}
            images={config.images || []}
            bgColor={config.bgColor || '#000'}
            gap={config.gap}
            imageScale={config.imageScale}
            topPadding={config.topPadding}
            imagePadding={config.imagePadding}
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
            content={screenData?.content || ''}
            contentKey={screenConfig.contentKey}
            images={screenConfig.images || []}
            bgColor="#000"
          />
        );

      case 'auto-sequence-popup':
        return (
          <AutoSequencePopup
            key={screenConfig.mergedId || screenConfig.id}
            images={screenConfig.images || []}
            images2={screenConfig.images2 || []} // 第二组图片（移动端双区域）
            interval={screenConfig.interval || 300}
            duration={screenConfig.duration || 0.6}
            bgColor={screenConfig.bgColor || phaseBgColor || '#000'}
            dualMode={screenConfig.dualMode || false} // 双区域模式
            caption={screenData?.content || ''}
            categoryLabel={screenConfig.categoryLabel}
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
            key={config.id}
            phaseId={phase.id}
            bgImage={config.bgImage}
            nextPhase={nextPhaseConfig ? {
              id: nextPhaseConfig.id,
              titleZh: t(`case.phases.${nextPhaseConfig.id}.title`)
            } : null}
            backLabel={t('case.backToIndex')}
            nextLabel={t('case.nextPhase')}
            onNavigate={navigate}
            sticky={config.sticky || false}
            stickyHeight={config.stickyHeight || 150}
            enableBlinds={config.enableBlinds !== false}
            blindsHeight={config.blindsHeight || 100}
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
      
      <div 
        className={isMobile ? 'phase-detail-mobile-snap' : ''}
        style={{ 
          position: 'relative', 
          background: phaseBgColor,
          '--phase-bg-color': phaseBgColor,
          // 移动端启用 Snap Scroll（proximity 模式更灵活，适配复杂屏幕）
          ...(isMobile ? {
            height: '100vh',
            overflowY: 'scroll',
            overflowX: 'hidden',
            scrollSnapType: 'y proximity', // proximity 比 mandatory 更灵活，适配混合高度屏幕
            WebkitOverflowScrolling: 'touch', // iOS 平滑滚动
          } : {})
        }}
      >
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
              <span style={{ opacity: 0.8 }}>阶段 {phase.number}</span>
              {/* 当前屏幕标题（斜线前高亮，斜线后不高亮） */}
              {(() => {
                const currentScreenConfig = filteredScreens?.[currentScreen - 1];
                const screenTitle = currentScreenConfig?.categoryLabel;
                if (screenTitle) {
                  // 检查是否包含斜线（支持 " / " 和 "/" 两种格式）
                  const slashMatch = screenTitle.match(/\s*\/\s*/);
                  if (slashMatch) {
                    const slashIndex = screenTitle.indexOf(slashMatch[0]);
                    const prefix = screenTitle.substring(0, slashIndex);
                    const suffix = screenTitle.substring(slashIndex);
                    
                    return (
                      <>
                        <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span>
                        <span style={{ opacity: 0.9 }}>
                          {/* 斜线前：高亮显示 */}
                          <span style={{ color: '#FF5722', fontWeight: 600 }}>{prefix}</span>
                          {/* 斜线及后续：正常显示 */}
                          <span style={{ opacity: 0.7 }}>{suffix}</span>
                        </span>
                      </>
                    );
                  }
                  
                  // 无斜线时，正常显示
                  return (
                    <>
                      <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span>
                      <span style={{ opacity: 0.9 }}>{screenTitle}</span>
                    </>
                  );
                }
                return null;
              })()}
            </Link>
          </motion.div>
        )}

        {/* 移动端：底部固定导航栏（纯按钮式翻页） */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              zIndex: 200,
            }}
          >
            {/* 左侧：返回按钮 */}
            <Link 
              to="/work/the-case" 
              style={{ 
                textDecoration: 'none', 
                color: '#fff', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                flexShrink: 0,
                fontSize: '1rem',
              }}
            >
              ←
            </Link>

            {/* 中间：上一屏 + Phase 信息 + 下一屏 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '16px',
              flex: 1,
              justifyContent: 'center'
            }}>
              {/* 上一屏按钮 */}
              <button
                onClick={() => {
                  if (currentScreen > 1) {
                    setCurrentScreen(currentScreen - 1);
                  }
                }}
                disabled={currentScreen <= 1}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentScreen > 1 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: currentScreen > 1 ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                  fontSize: '1.2rem',
                  cursor: currentScreen > 1 ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                ↑
              </button>

              {/* Phase 信息和进度 */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '4px',
                minWidth: '100px'
              }}>
                <span style={{ 
                  color: '#fff', 
                  fontSize: '0.75rem',
                  opacity: 0.9,
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  {currentScreen} / {filteredScreens.length}
                </span>
                {/* 进度条 */}
                <div style={{
                  width: '80px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.15)',
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

              {/* 下一屏按钮 */}
              <button
                onClick={() => {
                  if (currentScreen < filteredScreens.length) {
                    setCurrentScreen(currentScreen + 1);
                  }
                }}
                disabled={currentScreen >= filteredScreens.length}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentScreen < filteredScreens.length ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: currentScreen < filteredScreens.length ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                  fontSize: '1.2rem',
                  cursor: currentScreen < filteredScreens.length ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                ↓
              </button>
            </div>

            {/* 右侧：Phase 编号 */}
            <div style={{
              color: '#fff',
              fontSize: '0.7rem',
              opacity: 0.6,
              width: '40px',
              textAlign: 'center',
              flexShrink: 0,
            }}>
              P{phase.number}
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

        {/* 布局调试面板 - 已禁用 */}
        {/* 如需重新启用，将 false 改回 isDev && !isMobile */}
        {false && (
          <LayoutDebugPanel
            currentScreenConfig={filteredScreens[currentScreen - 1]}
            phaseId={phase.id}
            visible={currentScreen > 0}
            onParamsChange={setDebugParams}
          />
        )}

        {/* Process Anchor Navigation */}
        {phase.processFlow && (
          <ProcessAnchor 
            screens={phase.processFlow.screens}
            labels={phase.processFlow.labels}
            allScreens={phase.processFlow.allScreens}
            phaseId={phase.id}
          />
        )}
        
        {/* 渲染屏幕：移动端使用按钮式翻页，桌面端正常滚动 */}
        {isMobile ? (
          // ========== 移动端：纯按钮式翻页模式 ==========
          // 只渲染当前屏幕，通过动画切换
          <motion.div
            key={`mobile-screen-${currentScreen}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 60, // 为底部导航栏留空间
              overflow: 'auto', // 允许单屏内部滚动
              WebkitOverflowScrolling: 'touch',
              background: phaseBgColor,
            }}
          >
            <div 
              id={filteredScreens[currentScreen - 1]?.id}
              className="phase-screen-wrapper mobile-pager-screen"
              data-product={filteredScreens[currentScreen - 1]?.product || 'common'}
              data-screen-type={filteredScreens[currentScreen - 1]?.type}
              style={{ 
                width: '100%', 
                minHeight: '100%',
                position: 'relative',
                background: phaseBgColor,
              }}
            >
              {renderScreen(filteredScreens[currentScreen - 1], currentScreen - 1)}
            </div>
          </motion.div>
        ) : (
          // ========== 桌面端：正常滚动模式 ==========
          filteredScreens.map((screenConfig, index) => {
            // 检测是否为当前产品的最后一屏
            const isLastOfProduct = hasProductFilter && 
              screenConfig.product === currentProduct && 
              index === filteredScreens.length - 1;
            
            // key 包含 currentProduct，确保切换产品时组件重新挂载，动画状态重置
            const screenKey = hasProductFilter 
              ? `${screenConfig.id}-${currentProduct}` 
              : screenConfig.id;
            
            return (
              <React.Fragment key={screenKey}>
                <div 
                  id={screenConfig.id} 
                  className="phase-screen-wrapper"
                  data-product={screenConfig.product || 'common'}
                  data-screen-type={screenConfig.type}
                  style={{ 
                    width: '100%', 
                    position: 'relative',
                    background: phaseBgColor,
                  }}
                >
                  {renderScreen(screenConfig, index)}
                </div>
                
                {/* 在每个产品的最后一屏后插入提示 */}
                {isLastOfProduct && (
                  <ProductEndHint 
                    currentProduct={currentProduct}
                    availableProducts={phase.products}
                    productImages={{
                      cube: '/covers/products/cube.png',
                      'nicotine-sugar': '/covers/products/oi.png',
                      motor: '/covers/products/motor.png'
                    }}
                    onSwitchProduct={handleProductChange}
                  />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </TransitionProvider>
    </>
  );
};

export default PhaseDetail;
