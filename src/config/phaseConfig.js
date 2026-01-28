/**
 * Phase 配置文件
 * 定义每个 Phase 的屏幕序列、类型和内容结构
 */

// Phase 01: 品牌视觉系统的 0-1 建立 (7屏)
export const phase01Config = {
  id: 'phase-01',
  number: '01',
  titleEn: 'Brand Identity 0–1',
  titleKey: 'case.phases.phase-01.title',
  next: 'phase-02',
  totalScreens: 11, // 更新总屏幕数 (10 -> 11)
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  screens: [
    {
      id: 'intro',
      type: 'intro',
      imageHint: '品牌标志单独展示 / 标志 + 视觉关键词',
      // 使用 encodeURI 处理路径中的特殊字符
      bgImage: '/images/phase-01/cover.png'
    },
    {
      id: 'core-principles',
      type: 'core-principles'
    },
    {
      id: 'stability-message',
      type: 'stability-message'
    },
    // Logo 结构展示 (image 3.png)
    {
      id: 'logo-structure',
      type: 'logo-structure', // 修改类型为专用组件
      imageHint: 'Logo 结构示意 / 网格 / 比例 / 核心构成',
    },
    // Logo 变体 Focus Lens 展示
    {
      id: 'logo-focus-lens',
      type: 'logo-focus-lens',
      imageHint: 'Logo 变体 Focus Lens 展示'
    },
    // Logo 变体展示 (image 2 & 18)
    {
      id: 'logo-variations', // ID 变更以反映内容
      type: 'logo-marquee', // 使用新的跑马灯类型
      imageHint: 'Logo 变体展示',
    },
    // 色彩揭示 (Color Reveal) - 插入在 Logo Exploration 之前
    {
      id: 'color-reveal',
      type: 'color-reveal'
    },
    // Logo 变体探索 (image 9 & 10) - 修改为并列展示
    {
      id: 'logo-exploration',
      type: 'gallery', // 使用 gallery 类型
      columns: 2, // 两列并排
      images: [
        { 
          src: '/images/phase-01/logo-explore-01.png',
          hint: 'Logo 变体 A', 
          label: 'Variation A' 
        },
        { 
          src: '/images/phase-01/logo-explore-02.png',
          hint: 'Logo 变体 B', 
          label: 'Variation B' 
        }
      ],
      bgAlt: true // 使用交替背景色
    },
    {
      id: 'typography',
      type: 'content',
      imageHint: '字体层级示例 / 标题正文 / 版式示意',
      reverse: false
    },
    {
      id: 'validation',
      type: 'gallery',
      columns: 2,
      images: [
        { hint: '最小应用场景 1: 包装 seme质', label: '包装验证' },
        { hint: '最小应用场景 2: 页面/物料', label: '物料验证' }
      ],
      bgAlt: true
    },
    // 倒数第二屏：品牌手册目录概览
    {
      id: 'summary',
      type: 'summary',
      imageHint: '系统元素总览 / 产品方向暗示'
    },
    // 最后一屏：封底 + 导航按钮
    {
      id: 'phase-closing',
      type: 'phase-closing',
      bgImage: '/images/phase-01/closing.png'
    }
  ]
};

// Phase 02 素材基础路径 (规范命名：无空格、小写、语义化)
const PHASE02_BASE = '/images/phase-02';

// Phase 02: Product A · From Concept to Launch (8屏)
export const phase02Config = {
  id: 'phase-02',
  number: '02',
  titleEn: 'Product A · From Concept to Launch',
  titleKey: 'case.phases.phase-02.title',
  prev: 'phase-01',
  next: 'phase-03',
  processFlow: {
    // 按素材文件夹绑定：cmf/main → cmf/color-sequence → factory → priority
    screens: ['cmf-main', 'cmf-color', 'factory-keycaps', 'priority'],
    labels: ['Exploration', 'Memory', 'Details', 'Process']
  },
  totalScreens: 13,
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  screens: [
    // Screen 01: Intro - 建立语境
    {
      id: 'intro',
      type: 'intro',
      imageHint: 'Concept to Launch',
      bgImage: `${PHASE02_BASE}/cover/hero.png`,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    // Screen 02: TOC - 目录列表
    {
      id: 'toc',
      type: 'phase-toc',
      images: [
        `${PHASE02_BASE}/toc/toc-01.png`,
        `${PHASE02_BASE}/toc/toc-02.png`,
        `${PHASE02_BASE}/toc/toc-03.png`
      ],
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    // Screen 02.5: Popup Sequence - 目标用户代际弹出
    {
      id: 'user-generation',
      type: 'popup-sequence',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE02_BASE}/popup/popup-01.png`, label: 'Gen Z' },
        { src: `${PHASE02_BASE}/popup/popup-02.png`, label: 'Gen Y' },
        { src: `${PHASE02_BASE}/popup/popup-03.png`, label: 'Gen X' },
        { src: `${PHASE02_BASE}/popup/popup-04.png`, label: 'All Generations' }
      ]
    },
    // Screen 03: Boundaries - 提出张力
    {
      id: 'boundaries',
      type: 'boundaries', // 新组件类型
      images: [
        { src: `${PHASE02_BASE}/boundaries/boundary-01.png`, label: '资源边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-02.png`, label: '市场边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-03.png`, label: '目标边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-04.png`, label: '品牌边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-05.png`, label: '设计边界' }
      ],
      scrollBehavior: { sticky: false, length: 'longer', intensity: 'low' }
    },
    // Screen 03a: CMF Main - 主体探索 (2行网格，透明正方形)
    {
      id: 'cmf-main',
      type: 'square-grid', // 2行网格展示，无边框
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      columns: 6, // 每行5-6张
      noBorder: true, // 无边框样式
      images: [
        { src: `${PHASE02_BASE}/cmf/main/main-01.png`, label: 'Exploration 01' },
        { src: `${PHASE02_BASE}/cmf/main/main-02.png`, label: 'Exploration 02' },
        { src: `${PHASE02_BASE}/cmf/main/main-03.png`, label: 'Exploration 03' },
        { src: `${PHASE02_BASE}/cmf/main/main-04.png`, label: 'Exploration 04' },
        { src: `${PHASE02_BASE}/cmf/main/main-05.png`, label: 'Exploration 05' },
        { src: `${PHASE02_BASE}/cmf/main/main-06.png`, label: 'Exploration 06' },
        { src: `${PHASE02_BASE}/cmf/main/main-07.png`, label: 'Exploration 07' },
        { src: `${PHASE02_BASE}/cmf/main/main-08.png`, label: 'Exploration 08' },
        { src: `${PHASE02_BASE}/cmf/main/main-09.png`, label: 'Exploration 09' },
        { src: `${PHASE02_BASE}/cmf/main/main-10.png`, label: 'Exploration 10' },
        { src: `${PHASE02_BASE}/cmf/main/main-11.png`, label: 'Exploration 11' }
      ]
    },
    // Screen 03b: CMF Color Sequence - 色彩序列 (Grid 4-col)
    {
      id: 'cmf-color',
      type: 'gallery',
      columns: 4,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      bgAlt: true,
      images: [
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-01.png`, label: 'Seq 01' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-02.png`, label: 'Seq 02' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-03.png`, label: 'Seq 03' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-04.png`, label: 'Seq 04' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-05.png`, label: 'Seq 05' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-06.png`, label: 'Seq 06' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-07.png`, label: 'Seq 07' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-08.png`, label: 'Seq 08' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-09.png`, label: 'Seq 09' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-10.png`, label: 'Seq 10' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-11.png`, label: 'Seq 11' },
        { src: `${PHASE02_BASE}/cmf/color-sequence/color-12.png`, label: 'Seq 12' }
      ]
    },
    // Screen 04a: Factory Keycaps - 按键制造过程
    {
      id: 'factory-keycaps',
      type: 'factory-gallery',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      columns: 4,
      images: [
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-01.png`, label: 'Keycap 01' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-02.png`, label: 'Keycap 02' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-03.png`, label: 'Keycap 03' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-04.png`, label: 'Keycap 04' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-05.png`, label: 'Keycap 05' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-06.png`, label: 'Keycap 06' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-07.png`, label: 'Keycap 07' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-08.png`, label: 'Keycap 08' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-09.png`, label: 'Keycap 09' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-10.png`, label: 'Keycap 10' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-11.png`, label: 'Keycap 11' },
        { src: `${PHASE02_BASE}/factory/keycaps/keycap-12.png`, label: 'Keycap 12' }
      ]
    },
    // Screen 04b: Factory Backplate - 背板制造过程
    {
      id: 'factory-backplate',
      type: 'factory-gallery',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      columns: 4,
      bgAlt: true,
      images: [
        { src: `${PHASE02_BASE}/factory/backplate/backplate-01.png`, label: 'Backplate 01' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-02.png`, label: 'Backplate 02' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-03.png`, label: 'Backplate 03' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-04.png`, label: 'Backplate 04' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-05.png`, label: 'Backplate 05' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-06.png`, label: 'Backplate 06' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-07.png`, label: 'Backplate 07' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-08.png`, label: 'Backplate 08' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-09.png`, label: 'Backplate 09' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-10.png`, label: 'Backplate 10' },
        { src: `${PHASE02_BASE}/factory/backplate/backplate-11.png`, label: 'Backplate 11' }
      ]
    },
    // Screen 05: Priority - 重建理解 (Grouped Carousel)
    {
      id: 'priority',
      type: 'grouped-carousel',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      groups: [
        {
          label: 'Standard Series',
          images: [
            { src: `${PHASE02_BASE}/priority/cube-01.png`, label: 'Base' },
            { src: `${PHASE02_BASE}/priority/cube-02.png`, label: 'Variant 2' },
            { src: `${PHASE02_BASE}/priority/cube-03.png`, label: 'Variant 3' },
            { src: `${PHASE02_BASE}/priority/cube-04.png`, label: 'Variant 4' },
            { src: `${PHASE02_BASE}/priority/cube-05.png`, label: 'Variant 5' },
            { src: `${PHASE02_BASE}/priority/cube-06.png`, label: 'Variant 6' },
            { src: `${PHASE02_BASE}/priority/cube-07.png`, label: 'Variant 7' },
            { src: `${PHASE02_BASE}/priority/cube-08.png`, label: 'Variant 8' },
            { src: `${PHASE02_BASE}/priority/cube-09.png`, label: 'Variant 9' },
            { src: `${PHASE02_BASE}/priority/cube-10.png`, label: 'Variant 10' }
          ]
        },
        {
          label: 'Special Variants',
          images: [
            { src: `${PHASE02_BASE}/priority/cube-07b.png`, label: 'Variant 07' },
            { src: `${PHASE02_BASE}/priority/cube-08b.png`, label: 'Variant 08' },
            { src: `${PHASE02_BASE}/priority/cube-09b.png`, label: 'Variant 09' },
            { src: `${PHASE02_BASE}/priority/cube-10b.png`, label: 'Variant 010' }
          ]
        }
      ],
      bgAlt: true
    },
    // Screen 06: Packaging - 系统扩展 (两行5列正方形)
    {
      id: 'packaging',
      type: 'square-grid', // 正方形网格
      columns: 5, // 5列布局
      scrollBehavior: { sticky: true, length: 'medium', intensity: 'medium' },
      images: [
        { src: `${PHASE02_BASE}/packaging/pkg-01.png`, label: 'Package Design 1' },
        { src: `${PHASE02_BASE}/packaging/pkg-02.png`, label: 'Package Design 2' },
        { src: `${PHASE02_BASE}/packaging/pkg-03.png`, label: 'Package Design 3' },
        { src: `${PHASE02_BASE}/packaging/pkg-04.png`, label: 'Package Design 4' },
        { src: `${PHASE02_BASE}/packaging/pkg-05.png`, label: 'Package Design 5' },
        { src: `${PHASE02_BASE}/packaging/pkg-06.png`, label: 'Package Design 6' },
        { src: `${PHASE02_BASE}/packaging/pkg-07.png`, label: 'Package Design 7' },
        { src: `${PHASE02_BASE}/packaging/pkg-08.png`, label: 'Package Design 8' },
        { src: `${PHASE02_BASE}/packaging/pkg-09.png`, label: 'Package Design 9' },
        { src: `${PHASE02_BASE}/packaging/pkg-10.png`, label: 'Package Design 10' }
      ]
    },
    // Screen 07: Consistency - 方法论内化
    {
      id: 'consistency',
      type: 'consistency-mosaic', // 新组件类型
      scrollBehavior: { sticky: false, length: 'short', intensity: 'low' },
      images: [
        { src: `${PHASE02_BASE}/consistency/app-01.png`, label: 'Application 1' },
        { src: `${PHASE02_BASE}/consistency/app-02.png`, label: 'Application 2' },
        { src: `${PHASE02_BASE}/consistency/app-03.png`, label: 'Application 3' },
        { src: `${PHASE02_BASE}/consistency/app-04.png`, label: 'Application 4' },
        { src: `${PHASE02_BASE}/consistency/app-05.png`, label: 'Application 5' },
        { src: `${PHASE02_BASE}/consistency/detail-01.png`, label: 'Detail A' },
        { src: `${PHASE02_BASE}/consistency/detail-02.png`, label: 'Detail B' },
        { src: `${PHASE02_BASE}/consistency/detail-03.png`, label: 'Detail C' },
        { src: `${PHASE02_BASE}/consistency/detail-04.png`, label: 'Detail D' },
        // New Detail Images - 16张新增素材
        { src: `${PHASE02_BASE}/consistency/detail-new-01.png`, label: 'Detail New 01' },
        { src: `${PHASE02_BASE}/consistency/detail-new-02.png`, label: 'Detail New 02' },
        { src: `${PHASE02_BASE}/consistency/detail-new-03.png`, label: 'Detail New 03' },
        { src: `${PHASE02_BASE}/consistency/detail-new-04.png`, label: 'Detail New 04' },
        { src: `${PHASE02_BASE}/consistency/detail-new-05.png`, label: 'Detail New 05' },
        { src: `${PHASE02_BASE}/consistency/detail-new-06.png`, label: 'Detail New 06' },
        { src: `${PHASE02_BASE}/consistency/detail-new-07.png`, label: 'Detail New 07' },
        { src: `${PHASE02_BASE}/consistency/detail-new-08.png`, label: 'Detail New 08' },
        { src: `${PHASE02_BASE}/consistency/detail-new-09.png`, label: 'Detail New 09' },
        { src: `${PHASE02_BASE}/consistency/detail-new-10.png`, label: 'Detail New 10' },
        { src: `${PHASE02_BASE}/consistency/detail-new-11.png`, label: 'Detail New 11' },
        { src: `${PHASE02_BASE}/consistency/detail-new-12.png`, label: 'Detail New 12' },
        { src: `${PHASE02_BASE}/consistency/detail-new-13.png`, label: 'Detail New 13' },
        { src: `${PHASE02_BASE}/consistency/detail-new-14.png`, label: 'Detail New 14' },
        { src: `${PHASE02_BASE}/consistency/detail-new-15.png`, label: 'Detail New 15' },
        { src: `${PHASE02_BASE}/consistency/detail-new-16.png`, label: 'Detail New 16' }
      ],
      bgAlt: true
    },
    // Screen 08: Component Assembly - 组件拼装展示
    {
      id: 'component-assembly',
      type: 'component-assembly',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' }
    },
    // Screen 09: Product Final - 产品终图展示
    {
      id: 'product-final',
      type: 'fullscreen-image',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      bgImage: `${PHASE02_BASE}/closing/product-final.png`
    },
    // Screen 10: Closing - 收束与行动意图
    {
      id: 'closing',
      type: 'phase-closing',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'none' },
      images: [
        { src: `${PHASE02_BASE}/closing/closing-01.png`, label: 'Final Overview' },
        { src: `${PHASE02_BASE}/closing/product-final.png`, label: 'Product Shot' }
      ],
      bgImage: `${PHASE02_BASE}/closing/closing-01.png`
    }
  ]
};

// Phase 03 素材基础路径 (规范命名：无空格、小写、语义化)
const PHASE03_BASE = '/images/phase-03';

// Phase 03: Product B · Differentiation within Consistency (10屏)
export const phase03Config = {
  id: 'phase-03',
  number: '03',
  titleEn: 'Product B · Differentiation within Consistency',
  titleKey: 'case.phases.phase-03.title',
  prev: 'phase-02',
  next: 'phase-04',
  totalScreens: 12, // 拆分后变为 12 屏
  bgColor: '#000000', // 统一背景色 - 纯黑
  screens: [
    // Screen 01: Intro - 全屏背景 (4983×2804, 16:9) with reveal effect
    {
      id: 'intro',
      type: 'intro',
      imageHint: 'Product B Hero Shot',
      bgImage: `${PHASE03_BASE}/cover/hero.png`,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    // Screen 02: 概念对比 - 两张近方形图 (1942×1938, 1559×1821)
    {
      id: 'concept-comparison',
      type: 'comparison',
      leftHint: 'Concept A',
      rightHint: 'Concept B',
      leftLabel: 'Approach A',
      rightLabel: 'Approach B',
      images: [
        { src: `${PHASE03_BASE}/concept/concept-a.png`, label: 'Concept A' },
        { src: `${PHASE03_BASE}/concept/concept-b.png`, label: 'Concept B' }
      ],
      imageOffsetY: -60, // 图片 Y 轴偏移量，负值向上，正值向下
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    // Screen 03: 组件展示 - 混合网格 (共8张)
    {
      id: 'component-showcase',
      type: 'component-showcase',
      scrollBehavior: { sticky: false, length: 'medium', intensity: 'medium' },
      // 主图组 - 横向大图 1955×1404
      mainImages: [
        { src: `${PHASE03_BASE}/components/main/component-01.png`, label: 'Component A' },
        { src: `${PHASE03_BASE}/components/main/component-02.png`, label: 'Component B' },
        { src: `${PHASE03_BASE}/components/main/component-03.png`, label: 'Component C' }
      ],
      // 辅助图组 - 小图混排
      subImages: [
        { src: `${PHASE03_BASE}/components/detail/detail-01.png`, label: 'Detail 1' },
        { src: `${PHASE03_BASE}/components/detail/detail-02.png`, label: 'Motor' },
        { src: `${PHASE03_BASE}/components/detail/detail-03.png`, label: 'Part 1' },
        { src: `${PHASE03_BASE}/components/detail/detail-04.png`, label: 'Part 2' },
        { src: `${PHASE03_BASE}/components/detail/detail-05.png`, label: 'Assembly' }
      ]
    },
    // Screen 04: 三列幻灯片网格 - 9张 16:9 幻灯片
    {
      id: 'slide-grid',
      type: 'slide-grid',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 1.png`, label: 'Slide 1' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 2.png`, label: 'Slide 2' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 3.png`, label: 'Slide 3' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 4.png`, label: 'Slide 4' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 5.png`, label: 'Slide 5' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 6.png`, label: 'Slide 6' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 7.png`, label: 'Slide 7' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 8.png`, label: 'Slide 8' },
        { src: `${PHASE03_BASE}/slides/Slide 16_9 - 9.png`, label: 'Slide 9' }
      ]
    },
    // Screen 05: 三列配对文档网格 - 9组共18张 A4 文档
    {
      id: 'paired-document-grid',
      type: 'paired-document-grid',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      imageGroups: [
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/02/A4 - 26.png`, label: 'Doc 02-1' },
          { src: `${PHASE03_BASE}/documents-paired/02/A4 - 40.png`, label: 'Doc 02-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/03/A4 - 23.png`, label: 'Doc 03-1' },
          { src: `${PHASE03_BASE}/documents-paired/03/A4 - 34.png`, label: 'Doc 03-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/04/A4 - 2.png`, label: 'Doc 04-1' },
          { src: `${PHASE03_BASE}/documents-paired/04/A4 - 32.png`, label: 'Doc 04-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/05/A4 - 28.png`, label: 'Doc 05-1' },
          { src: `${PHASE03_BASE}/documents-paired/05/A4 - 39.png`, label: 'Doc 05-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/06/A4 - 1.png`, label: 'Doc 06-1' },
          { src: `${PHASE03_BASE}/documents-paired/06/A4 - 33.png`, label: 'Doc 06-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/07/A4 - 19.png`, label: 'Doc 07-1' },
          { src: `${PHASE03_BASE}/documents-paired/07/A4 - 35.png`, label: 'Doc 07-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/08/A4 - 16.png`, label: 'Doc 08-1' },
          { src: `${PHASE03_BASE}/documents-paired/08/A4 - 36.png`, label: 'Doc 08-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/09/A4 - 9.png`, label: 'Doc 09-1' },
          { src: `${PHASE03_BASE}/documents-paired/09/A4 - 37.png`, label: 'Doc 09-2' }
        ]},
        { images: [
          { src: `${PHASE03_BASE}/documents-paired/10/A4 - 5.png`, label: 'Doc 10-1' },
          { src: `${PHASE03_BASE}/documents-paired/10/A4 - 31.png`, label: 'Doc 10-2' }
        ]}
      ]
    },
    // Screen 05: 等高飞入画廊 - 7张图片同时飞入展示
    {
      id: 'fly-in-gallery',
      type: 'fly-in-gallery',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      imageHeight: '55vh', // 统一高度
      images: [
        { src: `${PHASE03_BASE}/product/wide/fly-01.png`, label: 'View 1' },
        { src: `${PHASE03_BASE}/product/wide/fly-02.png`, label: 'View 2' },
        { src: `${PHASE03_BASE}/product/wide/fly-03.png`, label: 'View 3' },
        { src: `${PHASE03_BASE}/product/wide/fly-04.png`, label: 'View 4' },
        { src: `${PHASE03_BASE}/product/wide/fly-05.png`, label: 'View 5' },
        { src: `${PHASE03_BASE}/product/wide/fly-06.png`, label: 'View 6' },
        { src: `${PHASE03_BASE}/product/wide/fly-07.png`, label: 'View 7' }
      ]
    },
    // Screen 07: 分组轮播 - 3组正方形产品图 (3+8+4=15张)
    {
      id: 'grouped-carousel',
      type: 'grouped-carousel',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      groups: [
        {
          label: 'Series A',
          images: [
            { src: `${PHASE03_BASE}/product/groups/01/Frame 1430105703.png`, label: 'A-1' },
            { src: `${PHASE03_BASE}/product/groups/01/Frame 1430105705.png`, label: 'A-2' },
            { src: `${PHASE03_BASE}/product/groups/01/Frame 1430105706.png`, label: 'A-3' }
          ]
        },
        {
          label: 'Series B',
          images: [
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105695.png`, label: 'B-1' },
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105696.png`, label: 'B-2' },
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105697.png`, label: 'B-3' },
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105698.png`, label: 'B-4' },
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105699.png`, label: 'B-5' },
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105700.png`, label: 'B-6' },
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105701.png`, label: 'B-7' },
            { src: `${PHASE03_BASE}/product/groups/02/Frame 1430105702.png`, label: 'B-8' }
          ]
        },
        {
          label: 'Series C',
          images: [
            { src: `${PHASE03_BASE}/product/groups/03/Frame 1430105704.png`, label: 'C-1' },
            { src: `${PHASE03_BASE}/product/groups/03/Frame 1430105707.png`, label: 'C-2' },
            { src: `${PHASE03_BASE}/product/groups/03/Frame 1430105708.png`, label: 'C-3' },
            { src: `${PHASE03_BASE}/product/groups/03/Frame 1430105709.png`, label: 'C-4' }
          ]
        }
      ]
    },
    // Screen 08: 三行跑马灯 - 21张竖向卡片 (752×969)
    {
      id: 'cards-marquee',
      type: 'three-row-marquee',
      scrollBehavior: { sticky: false, length: 'medium', intensity: 'low' },
      showGradient: false,
      images: [
        // Row 1: Group 01/a (7张)
        { src: `${PHASE03_BASE}/product/cards/Group 483.png`, label: 'Card A-1' },
        { src: `${PHASE03_BASE}/product/cards/Group 495.png`, label: 'Card A-2' },
        { src: `${PHASE03_BASE}/product/cards/Group 496.png`, label: 'Card A-3' },
        { src: `${PHASE03_BASE}/product/cards/Group 497.png`, label: 'Card A-4' },
        { src: `${PHASE03_BASE}/product/cards/Group 498.png`, label: 'Card A-5' },
        { src: `${PHASE03_BASE}/product/cards/Group 499.png`, label: 'Card A-6' },
        { src: `${PHASE03_BASE}/product/cards/Group 504.png`, label: 'Card A-7' },
        // Row 2: Group 01/b (7张)
        { src: `${PHASE03_BASE}/product/cards/Group 484.png`, label: 'Card B-1' },
        { src: `${PHASE03_BASE}/product/cards/Group 487.png`, label: 'Card B-2' },
        { src: `${PHASE03_BASE}/product/cards/Group 488.png`, label: 'Card B-3' },
        { src: `${PHASE03_BASE}/product/cards/Group 500.png`, label: 'Card B-4' },
        { src: `${PHASE03_BASE}/product/cards/Group 501.png`, label: 'Card B-5' },
        { src: `${PHASE03_BASE}/product/cards/Group 502.png`, label: 'Card B-6' },
        { src: `${PHASE03_BASE}/product/cards/Group 503.png`, label: 'Card B-7' },
        // Row 3: Group 02 (7张)
        { src: `${PHASE03_BASE}/product/cards/Group 485.png`, label: 'Card C-1' },
        { src: `${PHASE03_BASE}/product/cards/Group 486.png`, label: 'Card C-2' },
        { src: `${PHASE03_BASE}/product/cards/Group 489.png`, label: 'Card C-3' },
        { src: `${PHASE03_BASE}/product/cards/Group 490.png`, label: 'Card C-4' },
        { src: `${PHASE03_BASE}/product/cards/Group 492.png`, label: 'Card C-5' },
        { src: `${PHASE03_BASE}/product/cards/Group 493.png`, label: 'Card C-6' },
        { src: `${PHASE03_BASE}/product/cards/Group 494.png`, label: 'Card C-7' }
      ]
    },
    // Screen 09: Square 网格滚动渐现 - 12张方形图 4×3
    {
      id: 'square-grid',
      type: 'square-grid',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE03_BASE}/product/square/Frame 1430105683.png`, label: 'Product 1' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105684.png`, label: 'Product 2' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105685.png`, label: 'Product 3' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105686.png`, label: 'Product 4' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105687.png`, label: 'Product 5' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105688.png`, label: 'Product 6' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105689.png`, label: 'Product 7' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105690.png`, label: 'Product 8' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105691.png`, label: 'Product 9' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105692.png`, label: 'Product 10' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105693.png`, label: 'Product 11' },
        { src: `${PHASE03_BASE}/product/square/Frame 1430105694.png`, label: 'Product 12' }
      ],
      // 合并原 Screen 07 的配件数据 (正面)
      accessoryImages: [
        { src: `${PHASE03_BASE}/product/strip/strip-01.png`, label: 'Lanyard 1' },
        { src: `${PHASE03_BASE}/product/strip/strip-02.png`, label: 'Lanyard 2' },
        { src: `${PHASE03_BASE}/product/strip/strip-03.png`, label: 'Lanyard 3' },
        { src: `${PHASE03_BASE}/product/strip/strip-04.png`, label: 'Lanyard 4' },
        { src: `${PHASE03_BASE}/product/strip/strip-05.png`, label: 'Lanyard 5' }
      ],
      // 配件背面图片 (翻转后显示)
      accessoryBackImages: [
        { src: `${PHASE03_BASE}/product/strip-back/Group 537.png`, label: 'Back 1' }, // 黄→黄绿
        { src: `${PHASE03_BASE}/product/strip-back/Group 536.png`, label: 'Back 2' }, // 蓝→蓝
        { src: `${PHASE03_BASE}/product/strip-back/Group 538.png`, label: 'Back 3' }, // 紫→紫
        { src: `${PHASE03_BASE}/product/strip-back/Group 534.png`, label: 'Back 4' }, // 黑→黑
        { src: `${PHASE03_BASE}/product/strip-back/Group 535.png`, label: 'Back 5' }  // 粉→粉
      ]
    },
    // Screen 07: 移除 (内容已合并至上方)
    // Screen 08: Panorama 单屏完整展示 - 1张超宽全景图
    {
      id: 'panorama-full',
      type: 'panorama-full',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      image: { src: `${PHASE03_BASE}/panorama/panorama-01.png`, label: 'Panorama View' }
    },
    // Screen 07: 跑马灯 + 场景 + 轮播 (共17张)
    {
      id: 'panorama-marquee',
      type: 'panorama-marquee',
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      // 横条跑马灯
      marqueeImages: [
        { src: `${PHASE03_BASE}/marquee/marquee-01.png`, label: 'Marquee 1' },
        { src: `${PHASE03_BASE}/marquee/marquee-02.png`, label: 'Marquee 2' },
        { src: `${PHASE03_BASE}/marquee/marquee-03.png`, label: 'Marquee 3' },
        { src: `${PHASE03_BASE}/marquee/marquee-04.png`, label: 'Marquee 4' },
        { src: `${PHASE03_BASE}/marquee/marquee-05.png`, label: 'Marquee 5' },
        { src: `${PHASE03_BASE}/marquee/marquee-06.png`, label: 'Marquee 6' },
        { src: `${PHASE03_BASE}/marquee/marquee-07.png`, label: 'Marquee 7' },
        { src: `${PHASE03_BASE}/marquee/marquee-08.png`, label: 'Marquee 8' },
        { src: `${PHASE03_BASE}/marquee/marquee-09.png`, label: 'Marquee 9' },
        { src: `${PHASE03_BASE}/marquee/marquee-10.png`, label: 'Marquee 10' }
      ],
      // 竖向场景图 (~1400×1880)
      sceneImages: [
        { src: `${PHASE03_BASE}/scene/scene-01.png`, label: 'Scene 1' },
        { src: `${PHASE03_BASE}/scene/scene-02.png`, label: 'Scene 2' },
        { src: `${PHASE03_BASE}/scene/scene-03.png`, label: 'Scene 3' }
      ],
      // 宽横图轮播 (~3580×2012)
      carouselImages: [
        { src: `${PHASE03_BASE}/carousel/carousel-01.png`, label: 'Wide 1' },
        { src: `${PHASE03_BASE}/carousel/carousel-02.png`, label: 'Wide 2' },
        { src: `${PHASE03_BASE}/carousel/carousel-03.png`, label: 'Wide 3' },
        { src: `${PHASE03_BASE}/carousel/carousel-04.png`, label: 'Wide 4' }
      ]
    },
    // Screen 12: 6×6 正方形网格 - 36张产品图 (1052×1052)
    {
      id: 'product-grid-36',
      type: 'square-grid',
      columns: 6, // 6列布局
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105662.png`, label: 'Grid 1' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105663.png`, label: 'Grid 2' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105664.png`, label: 'Grid 3' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105665.png`, label: 'Grid 4' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105666.png`, label: 'Grid 5' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105667.png`, label: 'Grid 6' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105668.png`, label: 'Grid 7' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105669.png`, label: 'Grid 8' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105670.png`, label: 'Grid 9' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105671.png`, label: 'Grid 10' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105672.png`, label: 'Grid 11' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105673.png`, label: 'Grid 12' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105674.png`, label: 'Grid 13' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105675.png`, label: 'Grid 14' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105676.png`, label: 'Grid 15' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105677.png`, label: 'Grid 16' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105678.png`, label: 'Grid 17' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105679.png`, label: 'Grid 18' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105680.png`, label: 'Grid 19' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105681.png`, label: 'Grid 20' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105682.png`, label: 'Grid 21' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105683.png`, label: 'Grid 22' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105684.png`, label: 'Grid 23' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105685.png`, label: 'Grid 24' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105686.png`, label: 'Grid 25' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105687.png`, label: 'Grid 26' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105688.png`, label: 'Grid 27' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105689.png`, label: 'Grid 28' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105690.png`, label: 'Grid 29' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105691.png`, label: 'Grid 30' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105692.png`, label: 'Grid 31' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105693.png`, label: 'Grid 32' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105694.png`, label: 'Grid 33' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105695.png`, label: 'Grid 34' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105696.png`, label: 'Grid 35' },
        { src: `${PHASE03_BASE}/product/grid-36/Frame 1430105697.png`, label: 'Grid 36' }
      ]
    },
    // Screen 13: 瀑布流 (上) - 9张 A4 竖向 (1592×2253)
    {
      id: 'gallery-upper',
      type: 'packaging-gallery',
      scrollBehavior: { sticky: false, length: 'medium', intensity: 'low' },
      images: [
        { src: `${PHASE03_BASE}/gallery-a/page-01.png`, label: 'Page 1' },
        { src: `${PHASE03_BASE}/gallery-a/page-02.png`, label: 'Page 2' },
        { src: `${PHASE03_BASE}/gallery-a/page-03.png`, label: 'Page 3' },
        { src: `${PHASE03_BASE}/gallery-a/page-04.png`, label: 'Page 4' },
        { src: `${PHASE03_BASE}/gallery-a/page-05.png`, label: 'Page 5' },
        { src: `${PHASE03_BASE}/gallery-a/page-06.png`, label: 'Page 6' },
        { src: `${PHASE03_BASE}/gallery-a/page-07.png`, label: 'Page 7' },
        { src: `${PHASE03_BASE}/gallery-a/page-08.png`, label: 'Page 8' },
        { src: `${PHASE03_BASE}/gallery-a/page-09.png`, label: 'Page 9' }
      ]
    },
    // Screen 09: 瀑布流 (下) - 9张长竖图 (~1555×2763)
    {
      id: 'gallery-lower',
      type: 'packaging-gallery',
      scrollBehavior: { sticky: false, length: 'medium', intensity: 'low' },
      images: [
        { src: `${PHASE03_BASE}/gallery-b/poster-01.png`, label: 'Poster 1' },
        { src: `${PHASE03_BASE}/gallery-b/poster-02.png`, label: 'Poster 2' },
        { src: `${PHASE03_BASE}/gallery-b/poster-03.png`, label: 'Poster 3' },
        { src: `${PHASE03_BASE}/gallery-b/poster-04.png`, label: 'Poster 4' },
        { src: `${PHASE03_BASE}/gallery-b/poster-05.png`, label: 'Poster 5' },
        { src: `${PHASE03_BASE}/gallery-b/poster-06.png`, label: 'Poster 6' },
        { src: `${PHASE03_BASE}/gallery-b/poster-07.png`, label: 'Poster 7' },
        { src: `${PHASE03_BASE}/gallery-b/poster-08.png`, label: 'Poster 8' },
        { src: `${PHASE03_BASE}/gallery-b/poster-09.png`, label: 'Poster 9' }
      ]
    },
    // Screen 10: Closing - 收尾导航
    {
      id: 'closing',
      type: 'phase-closing',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'none' },
      bgImage: `${PHASE03_BASE}/cover/hero.png`
    }
  ]
};

// Phase 04: Packaging & Marketing Extensions (8屏)
export const phase04Config = {
  id: 'phase-04',
  number: '04',
  titleEn: 'Packaging & Marketing Extensions',
  titleKey: 'case.phases.phase-04.title',
  prev: 'phase-03',
  next: null,
  totalScreens: 8,
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  screens: [
    {
      id: 'intro',
      type: 'intro',
      imageHint: '多应用场景整体拼贴: 包装 / 营销物料 / 线下环境'
    },
    {
      id: 'packaging-system',
      type: 'gallery',
      columns: 3,
      images: [
        { hint: '包装规格 1', label: '规格 A' },
        { hint: '包装规格 2', label: '规格 B' },
        { hint: '包装规格 3', label: '规格 C' }
      ]
    },
    {
      id: 'kv',
      type: 'content',
      imageHint: '主 KV 核心母题 / 1-2 个延展示例',
      reverse: false,
      bgAlt: true
    },
    {
      id: 'regional',
      type: 'gallery',
      columns: 2,
      images: [
        { hint: '区域适配 A: 结构一致 / 内容微调', label: '区域 A' },
        { hint: '区域适配 B: 结构一致 / 内容微调', label: '区域 B' }
      ]
    },
    {
      id: 'offline',
      type: 'gallery',
      columns: 2,
      images: [
        { hint: '线下实拍 1: 真实光线/比例', label: '场景 A' },
        { hint: '线下实拍 2: 不完美环境', label: '场景 B' }
      ],
      bgAlt: true
    },
    {
      id: 'online-offline',
      type: 'comparison',
      leftHint: '线上: 页面/数字触点',
      rightHint: '线下: 物料/实体触点',
      leftLabel: '线上 Online',
      rightLabel: '线下 Offline'
    },
    {
      id: 'pressure',
      type: 'content',
      imageHint: '多产品 + 多应用整体展示 / 画面稳且干净',
      reverse: true,
      bgAlt: true
    },
    {
      id: 'closing',
      type: 'summary',
      imageHint: '品牌整体形象汇总 / 未来扩展暗示'
    }
  ]
};

// 汇总配置
export const phasesConfig = {
  'phase-01': phase01Config,
  'phase-02': phase02Config,
  'phase-03': phase03Config,
  'phase-04': phase04Config
};

// 获取 Phase 配置的辅助函数
export const getPhaseConfig = (phaseId) => phasesConfig[phaseId] || null;

// 获取下一个 Phase 配置
export const getNextPhase = (phaseId) => {
  const current = phasesConfig[phaseId];
  if (current?.next) {
    return phasesConfig[current.next];
  }
  return null;
};

// 获取上一个 Phase 配置
export const getPrevPhase = (phaseId) => {
  const current = phasesConfig[phaseId];
  if (current?.prev) {
    return phasesConfig[current.prev];
  }
  return null;
};

export default phasesConfig;