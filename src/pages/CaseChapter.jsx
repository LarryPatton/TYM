import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../hooks/useTitle';

const CaseChapter = () => {
  const { t } = useTranslation();
  const { chapterId } = useParams();
  const navigate = useNavigate();
  
  // Mock Data for Chapters
  const chaptersData = {
    '01-background': {
      number: '01',
      title: '背景与环境',
      subtitle: '一个 0-1 视觉与品牌系统项目：从战略到执行。',
      next: '02-ui-guidelines',
      prev: null,
      bridge: {
        from: '项目启动',
        to: '为什么接下来是 UI 视觉？为了建立整个系统的核心视觉规则。',
        intro: '本章作为项目的起点，确立了核心的战略方向与视觉基调。我们通过深入的背景调研，明确了需要解决的关键视觉问题，并为后续的所有设计决策提供了理论支撑。',
        outro: '战略方向已经明确，我们定义了"克制"与"技术感"作为核心关键词。接下来，我们需要将这些抽象的概念转化为具体的视觉语言，首先从最基础的 UI 系统开始。'
      },
      content: [
        { 
          title: '项目概览', 
          text: '这是一个全面的 0-1 视觉与品牌系统项目，涵盖了从数字界面到实体产品包装的方方面面。',
          type: 'text'
        },
        { 
          title: '视觉问题', 
          text: '当前的视觉识别缺乏一致性，无法支持营销工作。在拥挤的市场中，它的识别度很低。',
          type: 'comparison',
          visual: '[ 对比：旧 vs 新 / 混乱 vs 有序 ]'
        },
        { 
          title: '目标视觉关键词', 
          text: '克制 / 技术感 / 温度 / 高端 / 年轻化',
          type: 'mood',
          visual: '[ 情绪板：3-5 个关键视觉参考 ]'
        },
        { 
          title: '用户与场景', 
          text: '核心用户：Z 世代数字原住民。场景：移动优先的随时随地银行服务。',
          type: 'hero',
          visual: '[ 用户画像与场景图 ]'
        },
        { 
          title: '总体视觉策略', 
          text: '使用系统化的视觉语言，支持产品、包装和传播的一致表达。',
          type: 'process',
          visual: '[ 0-1 流程图：UI -> CMF -> 包装 -> KV -> 营销 -> 线下 ]'
        }
      ],
      deliverables: ['战略方案', '视觉审计']
    },
    '02-ui-guidelines': {
      number: '02',
      title: 'UI 视觉规范',
      subtitle: '所有视觉规则的源头。',
      next: '03-cmf',
      prev: '01-background',
      galleryRef: {
        title: '风格化板绘',
        link: '/gallery/form/stylized-board',
        desc: '本章的图形语言探索，深受我个人艺术创作中"风格化板绘"系列的影响。'
      },
      bridge: {
        from: '战略关键词 (第 01 章)',
        to: '为什么接下来是 CMF？为了将这些数字色彩转化为物理材质。',
        intro: '承接上章确立的战略关键词，本章重点在于构建一套可扩展的 UI 视觉系统。这不仅是屏幕上的像素，更是整个品牌视觉识别（VI）的源头，决定了后续所有物理和数字触点的色彩与图形基因。',
        outro: 'UI 系统确立了核心的色彩与图形规则。然而，品牌体验不仅仅停留在屏幕上。接下来，我们需要解决如何将这些二维的视觉规则，准确地还原到三维的实体产品工艺中。'
      },
      content: [
        { 
          title: '视觉输入', 
          text: '将关键词"技术感"和"温度"转化为视觉元素。',
          type: 'image',
          visual: '[ 视觉方向板 ]'
        },
        { 
          title: '探索', 
          text: '对比方向 A（太冷）与方向 B（平衡）。',
          type: 'comparison',
          visual: '[ 方向 A vs 方向 B 对比 ]'
        },
        { 
          title: '最终系统', 
          text: '定义核心色板、排版和图形语言。',
          type: 'grid',
          visual: '[ 色彩 | 排版 | 图形 | 布局 ]'
        },
        { 
          title: 'UI 应用', 
          text: '将系统应用于关键屏幕和组件以证明可行性。',
          type: 'hero',
          visual: '[ 关键屏幕与组件 ]'
        }
      ],
      deliverables: ['Figma 库', '风格指南 PDF']
    },
    '03-cmf': { 
      number: '03', 
      title: '产品 CMF', 
      subtitle: '将视觉系统转化为物理现实。', 
      next: '04-packaging', 
      prev: '02-ui-guidelines', 
      bridge: {
        from: 'UI 视觉规则 (第 02 章)',
        to: '为什么接下来是包装？为了在一致的品牌体验中容纳实体产品。',
        intro: '在 UI 阶段我们定义了品牌的"数字皮肤"，本章则致力于打造其"物理骨肉"。通过 CMF（色彩、材质、工艺）设计，我们将平面的视觉语言转译为可触摸的质感，确保虚实体验的一致性。',
        outro: '产品本体的视觉定义已经完成。为了让用户在拿到产品的第一刻就能感受到品牌价值，我们需要为这个实体产品设计一个同样高品质的"家"——包装体验。'
      },
      content: [
        { title: 'UI 到 CMF 转译', text: '将数字十六进制代码映射到物理材质表面处理。', type: 'image', visual: '[ UI 色彩 -> 材质色卡 ]' },
        { title: '探索', text: '测试不同的纹理：哑光 vs 光面。', type: 'comparison', visual: '[ 材质 A vs 材质 B ]' },
        { title: '最终 CMF', text: '选定的阳极氧化铝和柔软触感塑料组合。', type: 'hero', visual: '[ 最终 CMF 渲染图与标注 ]' },
        { title: '产品应用', text: '最终硬件的高保真渲染图。', type: 'image', visual: '[ 产品渲染 / 照片 ]' }
      ], 
      deliverables: ['CMF 规格书'] 
    },
    '04-packaging': { 
      number: '04', 
      title: '包装设计', 
      subtitle: '品牌系统的第一个物理接触点。', 
      next: '05-poster-kv', 
      prev: '03-cmf', 
      bridge: {
        from: '产品 CMF (第 03 章)',
        to: '为什么接下来是 KV？为了在媒体中传达产品价值。',
        intro: '包装不仅是产品的容器，更是品牌与用户的第一次亲密接触。本章展示了如何将 UI 的视觉逻辑和 CMF 的质感延伸到包装结构与平面设计中，创造充满仪式感的开箱体验。',
        outro: '产品与包装已经就绪，我们拥有了完美的"商品"。现在的挑战是：如何通过极具冲击力的视觉画面，将这个商品推向市场？这需要一套强有力的主视觉（KV）。'
      },
      content: [
        { title: '包装目标', text: '货架识别度和高端开箱体验。', type: 'text' },
        { title: '结构与布局', text: '探索盒子结构和图形布局。', type: 'image', visual: '[ 草图 / 早期样机 ]' },
        { title: '最终设计', text: '展示所有角度的最终包装设计。', type: 'hero', visual: '[ 最终包装渲染图 ]' },
        { title: '原型制作', text: '用于验证尺寸和表面处理的实物样品。', type: 'image', visual: '[ 实物样品 / 照片 ]' }
      ], 
      deliverables: ['刀模图', '印刷文件'] 
    },
    '05-poster-kv': { 
      number: '05', 
      title: '海报 & 主视觉', 
      subtitle: '可视化核心信息以进行传播。', 
      next: '06-marketing-plan', 
      prev: '04-packaging', 
      galleryRef: {
        title: '插画故事',
        link: '/gallery/form/illustration-story',
        desc: '主视觉的构图与叙事手法，借鉴了我在"插画故事"模块中的创作经验。'
      },
      bridge: {
        from: '包装与产品 (第 04 章)',
        to: '为什么接下来是营销？为了跨渠道分发这个视觉信息。',
        intro: '基于产品与包装的实体形态，本章聚焦于传播层面的视觉表达。我们提炼了核心卖点，通过主视觉（KV）的设计，为整个营销战役定下了视觉基调。',
        outro: '一张完美的 KV 只是开始。为了触达更广泛的用户群体，我们需要将这套视觉语言系统化地拆解并应用到不同的营销渠道中，形成完整的营销视觉方案。'
      },
      content: [
        { title: '主视觉 (KV)', text: '定义活动的英雄形象。', type: 'hero', visual: '[ 主 KV 图片 ]' },
        { title: '概念探索', text: '概念 A（抽象）vs 概念 B（生活方式）。', type: 'comparison', visual: '[ 概念 A vs 概念 B ]' },
        { title: '延展', text: '针对不同格式和语境调整 KV。', type: 'grid', visual: '[ 竖版 | 横版 | 方版 ]' }
      ], 
      deliverables: ['高清 KV', '源文件'] 
    },
    '06-marketing-plan': { 
      number: '06', 
      title: '营销计划', 
      subtitle: '视觉系统如何跨渠道扩展。', 
      next: '07-offline-materials', 
      prev: '05-poster-kv', 
      bridge: {
        from: '主视觉 (第 05 章)',
        to: '为什么接下来是线下？为了将数字活动带入现实世界。',
        intro: '本章展示了视觉系统在复杂营销环境下的适应性。从社交媒体的碎片化传播到落地页的转化引导，我们确保了品牌声音在不同触点上的一致性与穿透力。',
        outro: '线上营销构建了认知，而线下活动则构建了关系。为了让用户更真实地感知品牌，我们需要将这套视觉系统从屏幕带入现实空间，进行线下的物料延展。'
      },
      content: [
        { title: '传播结构', text: '可视化线上和线下的用户接触点。', type: 'image', visual: '[ 接触点地图 ]' },
        { title: '渠道示例', text: '社交媒体、落地页和数字广告。', type: 'grid', visual: '[ 社交 | 网页 | 广告 ]' },
        { title: '信息层级', text: '确保复杂信息的清晰度。', type: 'image', visual: '[ 信息层级图 ]' }
      ], 
      deliverables: ['活动指南'] 
    },
    '07-offline-materials': { 
      number: '07', 
      title: '线下物料', 
      subtitle: '视觉系统在物理空间中的终极测试。', 
      next: '08-results-review', 
      prev: '06-marketing-plan', 
      bridge: {
        from: '营销计划 (第 06 章)',
        to: '为什么接下来是结果？为了评估整个系统的影响。',
        intro: '这是视觉系统的终极测试——在真实的物理空间中。本章涵盖了展位、印刷品等线下物料的设计，验证了这套视觉语言在大尺寸、实物印刷环境下的表现力。',
        outro: '至此，我们已经完成了从 0 到 1 的全链路设计。现在是时候停下来，回顾整个旅程，评估这套庞大的视觉系统最终带来了什么样的实际影响与价值。'
      },
      content: [
        { title: '场景概览', text: '应用于活动展位的视觉系统。', type: 'hero', visual: '[ 活动展位 / 场景渲染 ]' },
        { title: '物料细节', text: '海报、 jokedan�词义和愣是 newspaper包。', type: 'grid', visual: '[ 海报 | 笑点宝 | letin ]' }
      ], 
      deliverables: ['印刷就绪文件'] 
    },
    '08-results-review': { 
      number: '08', 
      title: '结果与复盘', 
      subtitle: '回顾旅程与影响。', 
      next: null, 
      prev: '07-offline-materials', 
      bridge: {
        from: '线下执行 (第 07 章)',
        to: '案例研究结束。',
        intro: '在项目的最后，我们汇总了所有的设计产出与市场反馈。本章不仅是对项目成果的量化展示，更是对设计策略有效性的验证与反思。',
        outro: '感谢阅读。这个项目展示了我如何通过系统化的设计思维，解决复杂的商业与视觉挑战。如果您对我的工作流程感兴趣，欢迎随时联系。'
      },
      content: [
        { title: '视觉回顾', text: '回顾我们创建的一致视觉主线。', type: 'hero', visual: '[ 系统概览拼贴 ]' },
        { title: '成果', text: '定性反馈和定量指标。', type: 'text' },
        { title: '反思', text: '哪些做得好，下次可以改进什么。', type: 'text' }
      ], 
      deliverables: ['最终报告'] 
    },
  };

  const chapter = chaptersData[chapterId] || chaptersData['01-background'];
  useTitle(`第 ${chapter.number} 章: ${chapter.title}`);

  // Calculate Progress
  const totalChapters = 8;
  const currentChapterNum = parseInt(chapter.number);
  
  // Render different layout based on section type
  const renderSection = (section, index) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={index} style={{ marginBottom: 'var(--space-section)' }}>
            <div style={{ 
              width: '100%', 
              aspectRatio: '16/9', 
              background: 'var(--color-bg-alt)', 
              borderRadius: 'var(--radius-sm)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--color-text-light)',
              marginBottom: 'var(--space-xl)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Placeholder for Hero Image */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--color-bg-subtle) 25%, var(--color-bg-alt) 25%, var(--color-bg-alt) 50%, var(--color-bg-subtle) 50%, var(--color-bg-subtle) 75%, var(--color-bg-alt) 75%, var(--color-bg-alt) 100%)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>
              <span style={{ position: 'relative', zIndex: 1, fontSize: 'var(--text-h3)', fontWeight: '500' }}>{section.visual}</span>
            </div>
            <div style={{ maxWidth: '65ch', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', marginBottom: 'var(--space-md)' }}>{section.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-base)' }}>{section.text}</p>
            </div>
          </section>
        );
      
      case 'comparison':
        return (
          <section key={index} style={{ marginBottom: 'var(--space-section)' }}>
            <div style={{ maxWidth: '65ch', marginBottom: 'var(--space-2xl)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', marginBottom: 'var(--space-md)' }}>{section.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-base)' }}>{section.text}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div style={{ aspectRatio: '4/3', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)', border: '1px solid var(--color-border)' }}>Before / Option A</div>
              <div style={{ aspectRatio: '4/3', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)', border: '1px solid var(--color-border)' }}>After / Option B</div>
            </div>
          </section>
        );

      case 'grid':
      case 'mood':
        return (
          <section key={index} style={{ marginBottom: 'var(--space-section)' }}>
            <div style={{ maxWidth: '65ch', marginBottom: 'var(--space-2xl)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', marginBottom: 'var(--space-md)' }}>{section.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-base)' }}>{section.text}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ aspectRatio: '1/1', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
                  Item {i}
                </div>
              ))}
            </div>
          </section>
        );

      case 'text':
      default:
        return (
          <section key={index} style={{ marginBottom: 'var(--space-section)', maxWidth: '65ch' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', marginBottom: 'var(--space-md)' }}>{section.title}</h2>
            <p style={{ color: 'var(--color-text-main)', fontSize: 'var(--text-body-lg)', lineHeight: 'var(--line-height-relaxed)' }}>{section.text}</p>
          </section>
        );
    }
  };
  
  return (
    <div className="noise-bg" style={{ minHeight: '100vh' }}>
      {/* 1. Sticky Chapter Navigation Bar */}
      <nav className="glass-panel" style={{ 
        position: 'sticky', 
        top: '20px', 
        zIndex: 900,
        margin: '0 20px',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md) var(--space-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <Link to="/work/the-case" style={{ textDecoration: 'none', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>←</span> {t('case.backToToc')}
          </Link>
          <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }}></div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
            <span style={{ color: 'var(--color-text-light)', marginRight: '10px', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Chapter {chapter.number}</span>
            {chapter.title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button 
              disabled={!chapter.prev}
              onClick={() => navigate(`/work/the-case/${chapter.prev}`)}
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', background: 'transparent', borderRadius: 'var(--radius-md)', cursor: chapter.prev ? 'pointer' : 'default', opacity: chapter.prev ? 1 : 0.3, transition: 'all 0.2s' }}
            >
              ←
            </button>
            <button 
              disabled={!chapter.next}
              onClick={() => navigate(`/work/the-case/${chapter.next}`)}
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', background: 'transparent', borderRadius: 'var(--radius-md)', cursor: chapter.next ? 'pointer' : 'default', opacity: chapter.next ? 1 : 0.3, transition: 'all 0.2s' }}
            >
              →
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-4xl) var(--space-2xl)' }}>
        
        {/* Bridge: From Previous (Enhanced UI) */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--space-4xl)', 
          padding: 'var(--space-2xl)', 
          background: 'var(--color-bg-subtle)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)', color: 'var(--color-text-light)' }}>
            {t('case.chapterIntro')}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', fontStyle: 'italic', color: 'var(--color-text-main)', maxWidth: '800px', margin: '0 auto', lineHeight: 'var(--line-height-base)' }}>
            "{chapter.bridge.intro}"
          </div>
        </div>

        {/* 2. Chapter Hero */}
        <section style={{ marginBottom: 'var(--space-section)', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '12em', 
              color: 'rgba(0,0,0,0.03)', 
              lineHeight: 0.8, 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: -1
            }}>
              {chapter.number}
            </div>
            <h1 style={{ fontSize: 'var(--text-display)', fontWeight: '400', marginBottom: 'var(--space-xl)', letterSpacing: '-0.02em', lineHeight: 'var(--line-height-tight)' }}>{chapter.title}</h1>
            <p style={{ fontSize: 'var(--text-h3)', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto var(--space-3xl) auto', lineHeight: 'var(--line-height-base)' }}>
              {chapter.subtitle}
            </p>
            
            <div style={{ display: 'inline-flex', gap: 'var(--space-3xl)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-xl)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)' }}>{t('case.goal')}</div>
                <div style={{ fontWeight: '500' }}>{t('case.defineStrategy')}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)' }}>Role</div>
                <div style={{ fontWeight: '500' }}>{t('case.leadDesigner')}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)' }}>{t('case.output')}</div>
                <div style={{ fontWeight: '500' }}>{chapter.deliverables[0] || t('case.asset')}</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-4xl)' }}>
          
          {/* Local TOC - Refined */}
          <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-light)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '1px' }}>Contents</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {chapter.content.map((section, i) => (
                <li key={i} style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-black">
                  {section.title}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <div>
            {chapter.content.map((section, i) => renderSection(section, i))}

            {/* Visual Language Source (New Component) */}
            {chapter.galleryRef && (
              <section style={{ marginBottom: 'var(--space-section)', padding: 'var(--space-2xl)', background: 'var(--color-bg-subtle)', borderLeft: '4px solid var(--color-text-main)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-md)' }}>
                  {t('case.visualLanguageSource')}
                </div>
                <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-text-main)', marginBottom: 'var(--space-lg)', lineHeight: 'var(--line-height-base)' }}>
                  {chapter.galleryRef.desc}
                </p>
                <Link to={chapter.galleryRef.link} style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: '500', borderBottom: '1px solid var(--color-text-main)', paddingBottom: '2px' }}>
                  → {t('case.viewRelatedWorks')} ({chapter.galleryRef.title})
                </Link>
              </section>
            )}

            {/* Deliverables */}
            <section style={{ marginTop: 'var(--space-section)', padding: 'var(--space-3xl)', background: 'var(--color-text-main)', color: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', marginBottom: 'var(--space-xl)' }}>{t('case.chapterDeliverables')}</h2>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                {chapter.deliverables.map((item, i) => (
                  <div key={i} style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ opacity: 0.5 }}>↓</span> {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 4. Next Chapter Navigation & Bridge (Enhanced UI) */}
        {chapter.next ? (
          <section style={{ marginTop: 'var(--space-section)' }}>
            <div style={{ 
              background: 'var(--color-text-main)', 
              color: 'var(--color-bg)', 
              padding: 'var(--space-4xl) var(--space-2xl)', 
              borderRadius: 'var(--radius-lg)', 
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: 'var(--space-2xl)', opacity: 0.8 }}>
                <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)' }}>Narrative Handoff</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto', lineHeight: 'var(--line-height-base)' }}>
                  "{chapter.bridge.outro}"
                </div>
              </div>
              
              <div 
                onClick={() => navigate(`/work/the-case/${chapter.next}`)}
                style={{ 
                  display: 'inline-block',
                  border: '1px solid rgba(255,255,255,0.3)', 
                  padding: '20px 60px', 
                  borderRadius: 'var(--radius-full)', 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: 'rgba(255,255,255,0.1)'
                }}
                className="hover:bg-white hover:text-black"
              >
                <p style={{ marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 'var(--text-xs)', opacity: 0.7 }}>Next Chapter</p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', margin: 0 }}>
                  {chaptersData[chapter.next].title} <span style={{ fontSize: '0.6em', verticalAlign: 'middle', marginLeft: '10px' }}>→</span>
                </h3>
              </div>
            </div>
          </section>
        ) : (
          <section style={{ marginTop: 'var(--space-section)', textAlign: 'center', padding: 'var(--space-4xl) 0', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
             <div style={{ marginBottom: 'var(--space-2xl)', opacity: 0.8, maxWidth: '800px', margin: '0 auto 40px auto' }}>
              <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)', color: 'var(--color-text-light)' }}>Conclusion</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', fontStyle: 'italic', color: 'var(--color-text-main)', lineHeight: 'var(--line-height-base)' }}>
                "{chapter.bridge.outro}"
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-display)', marginBottom: 'var(--space-2xl)', fontSize: '3em' }}>
              {t('case.caseStudyEnd')}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
              <Link to="/contact">
                <button style={{ padding: '15px 40px', background: 'var(--color-text-main)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-body-lg)', cursor: 'pointer', fontWeight: '500' }}>
                  {t('case.contactMe')}
                </button>
              </Link>
              <Link to="/work/the-case">
                <button style={{ padding: '15px 40px', background: 'transparent', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-body-lg)', cursor: 'pointer' }}>
                  {t('case.backToTableOfContents')}
                </button>
              </Link>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default CaseChapter;