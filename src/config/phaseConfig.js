/**
 * Phase 配置文件
 * 定义每个 Phase 的屏幕序列、类型和内容结构
 */

// 移动端封面图片路径 - 用于 CaseIndex 和 PhaseDetail intro 的揭示底图
const MOBILE_COVER_BASE = '/images/mobile/work';

// Phase 01: 品牌视觉系统的 0-1 建立 (7屏)
export const phase01Config = {
  id: 'phase-01',
  number: '01',
  titleEn: 'Brand Identity 0–1',
  titleKey: 'case.phases.phase-01.title',
  next: 'phase-02',
  // 顶部胶囊导航配置
  processFlow: {
    screens: ['core-principles', 'logo-structure', 'color-reveal', 'typography', 'validation', 'summary'],
    labels: ['理念', 'Logo', '色彩', '字体', '验证', '总览'],
    allScreens: [
      'core-principles', 'stability-message', 'logo-structure', 'logo-focus-lens',
      'logo-variations', 'color-reveal', 'logo-exploration', 'typography',
      'validation', 'summary', 'phase-closing'
    ]
  },
  totalScreens: 11, // 更新总屏幕数 (10 -> 11)
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  screens: [
    {
      id: 'intro',
      type: 'intro',
      categoryLabel: '引言',
      imageHint: '品牌标志单独展示 / 标志 + 视觉关键词',
      bgImage: `${MOBILE_COVER_BASE}/Desktop - 1.png`,
      enableFlashlight: true,
      flashlightInitialPosition: { x: 0.32, y: 0.2 } // 上中偏左（ZMR建筑）
    },
    {
      id: 'core-principles',
      type: 'core-principles',
      categoryLabel: '核心理念'
    },
    {
      id: 'stability-message',
      type: 'stability-message',
      categoryLabel: '稳定性宣言'
    },
    {
      id: 'logo-structure',
      type: 'popup-sequence',
      categoryLabel: 'Logo / 结构',
      contentKey: 'case.phases.phase-01.screens.logo-structure.content',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: '/images/phase-01/logo-structure.png', label: 'Logo-Structure' }
      ]
    },
    {
      id: 'logo-focus-lens',
      type: 'two-row-static',
      categoryLabel: 'Logo / 聚焦',
      sticky: true,
      stickyHeight: 200,
      sequentialPopup: true,
      showItemCount: false,
      scrollBehavior: { sticky: true, length: 'normal', intensity: 'medium' },
      layout: {
        rows: [
          { count: 2, scale: 1.6, aspectRatio: 0.67 },  // 上行：2张，略大
          { count: 3, scale: 1.4, aspectRatio: 0.67 }   // 下行：3张，稍小
        ]
      },
      images: [
        // 上行（2张）
        { src: '/images/phase-01/logo-variants/Group675.png', label: 'Wireframe' },
        { src: '/images/phase-01/logo-variants/Group671.png', label: 'Sketch' },
        // 下行（3张）
        { src: '/images/phase-01/logo-variants/Group672.png', label: 'Grid' },
        { src: '/images/phase-01/logo-variants/Group673.png', label: 'Solid' },
        { src: '/images/phase-01/logo-variants/Group674.png', label: 'Final' }
      ]
    },
    {
      id: 'logo-variations',
      type: 'logo-marquee',
      categoryLabel: 'Logo / 文字标',
      imageHint: 'Logo 变体展示',
    },
    {
      id: 'color-reveal',
      type: 'color-reveal',
      categoryLabel: '色彩揭示'
    },
    {
      id: 'logo-exploration',
      type: 'popup-sequence',
      categoryLabel: '色彩 / 主辅色探索',
      contentKey: 'case.phases.phase-01.screens.logo-exploration.content',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: '/images/phase-01/logo-explore-01.png', label: 'Exploration A' },
        { src: '/images/phase-01/logo-explore-02.png', label: 'Exploration B' }
      ]
    },
    {
      id: 'typography',
      type: 'popup-sequence',
      categoryLabel: '字体 / 探索',
      contentKey: 'case.phases.phase-01.screens.typography.content',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: '/images/phase-01/type-specimen-01.png', label: 'Type Specimen 01' },
        { src: '/images/phase-01/type-specimen-02.png', label: 'Type Specimen 02' }
      ]
    },
    {
      id: 'validation',
      type: 'popup-sequence',
      categoryLabel: '应用验证',
      contentKey: 'case.phases.phase-01.screens.validation.content',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: '/images/phase-01/validation-packaging.png', label: '包装验证' },
        { src: '/images/phase-01/validation-material-01.png', label: '物料验证 01' },
        { src: '/images/phase-01/validation-material-02.png', label: '物料验证 02' },
        { src: '/images/phase-01/validation-preview-01.png', label: '预览验证 01' },
        { src: '/images/phase-01/validation-preview-02.png', label: '预览验证 02' }
      ]
    },
    {
      id: 'summary',
      type: 'summary',
      categoryLabel: '总览',
      imageHint: '系统元素总览 / 产品方向暗示'
    },
    {
      id: 'phase-closing',
      type: 'phase-closing',
      categoryLabel: '收尾',
      sticky: true,
      stickyHeight: 200,
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
    // 7 个分类锚点：人群→定位→CMF→工厂→包装→周边→产品
    screens: ['user-generation', 'boundaries', 'cmf-main', 'factory-keycaps', 'priority', 'consistency', 'component-assembly'],
    labels: ['人群', '定位', 'CMF', '工厂', '包装', '周边', '产品'],
    // 用于范围检测的所有屏幕（确保滚动到任意屏幕时锚点都能正确高亮）
    allScreens: [
      'user-generation',
      'boundaries',
      'cmf-main', 'cmf-color',
      'factory-keycaps', 'factory-backplate',
      'priority',
      'consistency',
      'component-assembly'
    ]
  },
  totalScreens: 10, // 删除目录屏+packaging屏后：10屏
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  screens: [
    // Screen 01: Intro - 建立语境
    {
      id: 'intro',
      type: 'intro',
      categoryLabel: '引言',
      imageHint: 'Concept to Launch',
      bgImage: `${MOBILE_COVER_BASE}/Desktop - 2.png`,
      enableFlashlight: true,
      flashlightInitialPosition: { x: 0.32, y: 0.27 }, // 左上（人物脸部+烟雾）
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    // Screen 02: Popup Sequence - 目标用户代际弹出
    {
      id: 'user-generation',
      type: 'popup-sequence',
      categoryLabel: '人群 / 用户代际',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE02_BASE}/popup/popup-01.png`, label: 'Gen Z' },
        { src: `${PHASE02_BASE}/popup/popup-02.png`, label: 'Gen Y' },
        { src: `${PHASE02_BASE}/popup/popup-03.png`, label: 'Gen X' },
        { src: `${PHASE02_BASE}/popup/popup-04.png`, label: 'All Generations' }
      ]
    },
    // Screen 02a: 文字过渡条 - 边界张力 文案
    {
      id: 'scroll-text-boundaries',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-02.screens.boundaries.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 03: Boundaries - 提出张力
    {
      id: 'boundaries',
      type: 'boundaries',
      categoryLabel: '定位 / 边界张力',
      images: [
        { src: `${PHASE02_BASE}/boundaries/boundary-01.png`, label: '资源边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-02.png`, label: '市场边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-03.png`, label: '目标边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-04.png`, label: '品牌边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-05.png`, label: '设计边界' },
        { src: `${PHASE02_BASE}/boundaries/boundary-06.png`, label: '边界总览' }
      ],
      scrollBehavior: { sticky: false, length: 'longer', intensity: 'low' }
    },
    // Screen 03a-text: 文字过渡条 - CMF 主体探索 文案
    {
      id: 'scroll-text-cmf-main',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-02.screens.cmf-main.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 03a: CMF Main - 主体探索 (2行网格，透明正方形)
    {
      id: 'cmf-main',
      type: 'square-grid',
      categoryLabel: 'CMF / 主题探索',
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
      categoryLabel: 'CMF / 色彩序列',
      contentKey: 'case.phases.phase-02.screens.cmf-color.content',
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
      contentKey: 'case.phases.phase-02.screens.factory-keycaps.content',
      categoryLabel: '工厂 / 按键',
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
      contentKey: 'case.phases.phase-02.screens.factory-backplate.content',
      categoryLabel: '工厂 / 背板',
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
    // Screen 05: Priority - 超级符号在包装上的应用 (Grouped Carousel)
    {
      id: 'priority',
      type: 'grouped-carousel',
      categoryLabel: '包装 / 超级符号在包装上的应用',
      contentKey: 'case.phases.phase-02.screens.priority.content',
      showGroupLabel: false,
      showItemCount: false,
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      groups: [
        {
          label: 'Standard Series',
          labelKey: 'case.phases.phase-02.screens.priority.groups.0.label',
          layout: {
            rows: [{ count: 5, scale: 1 }, { count: 5, scale: 1 }],
            rowGap: '20px',
            colGap: '16px',
            mainScale: 1.1,
            subScale: 1,
            subOffset: { x: 14, y: 10 }
          },
          images: [
            { src: `${PHASE02_BASE}/priority/cube-01.png`, label: 'Base', subSrc: `${PHASE02_BASE}/packaging/pkg-01.png` },
            { src: `${PHASE02_BASE}/priority/cube-02.png`, label: 'Variant 2', subSrc: `${PHASE02_BASE}/packaging/pkg-02.png` },
            { src: `${PHASE02_BASE}/priority/cube-03.png`, label: 'Variant 3', subSrc: `${PHASE02_BASE}/packaging/pkg-03.png` },
            { src: `${PHASE02_BASE}/priority/cube-04.png`, label: 'Variant 4', subSrc: `${PHASE02_BASE}/packaging/pkg-04.png` },
            { src: `${PHASE02_BASE}/priority/cube-05.png`, label: 'Variant 5', subSrc: `${PHASE02_BASE}/packaging/pkg-05.png` },
            { src: `${PHASE02_BASE}/priority/cube-06.png`, label: 'Variant 6', subSrc: `${PHASE02_BASE}/packaging/pkg-06.png` },
            { src: `${PHASE02_BASE}/priority/cube-07.png`, label: 'Variant 7', subSrc: `${PHASE02_BASE}/packaging/pkg-07.png` },
            { src: `${PHASE02_BASE}/priority/cube-08.png`, label: 'Variant 8', subSrc: `${PHASE02_BASE}/packaging/pkg-08.png` },
            { src: `${PHASE02_BASE}/priority/cube-09.png`, label: 'Variant 9', subSrc: `${PHASE02_BASE}/packaging/pkg-09.png` },
            { src: `${PHASE02_BASE}/priority/cube-10.png`, label: 'Variant 10', subSrc: `${PHASE02_BASE}/packaging/pkg-10.png` }
          ]
        },
        {
          label: 'Special Variants',
          labelKey: 'case.phases.phase-02.screens.priority.groups.1.label',
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
    // Screen 06b: Consistency Transition - 周边过渡条 (Scroll Text Bar)
    {
      id: 'consistency-transition',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-02.screens.consistency-transition.content',
      bgColor: '#000',
      scrollBehavior: { sticky: false, length: 'short', intensity: 'none' }
    },
    // Screen 07: Consistency - 产品周边扩展
    {
      id: 'consistency',
      type: 'consistency-mosaic',
      categoryLabel: '周边 / 产品周边扩展',
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
    // Screen 08: Component Assembly - 产品速读 (auto-sequence-popup)
    {
      id: 'component-assembly',
      type: 'auto-sequence-popup',
      categoryLabel: '产品 / 产品速读',
      contentKey: 'case.phases.phase-02.screens.component-assembly.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE02_BASE}/product-quickread/Frame 90.png`, label: 'Frame 90' },
        { src: `${PHASE02_BASE}/product-quickread/Frame 91.png`, label: 'Frame 91' },
        { src: `${PHASE02_BASE}/product-quickread/Frame 92.png`, label: 'Frame 92' },
        { src: `${PHASE02_BASE}/product-quickread/Frame 93.png`, label: 'Frame 93' },
        { src: `${PHASE02_BASE}/product-quickread/Frame 94.png`, label: 'Frame 94' }
      ]
    },
    // Screen 09: Closing - 收束与行动意图
    {
      id: 'closing',
      type: 'phase-closing',
      categoryLabel: '收尾',
      sticky: true,
      stickyHeight: 200,
      scrollBehavior: { sticky: true, length: 'normal', intensity: 'none' },
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
  // 顶部胶囊导航配置 - 右侧显示分类（去重后8个），点击跳转到该分类的第一个屏幕
  processFlow: {
    // 用于胶囊显示和跳转的目标屏幕（去重后）
    screens: [
      'concept-comparison',  // 概念
      'component-showcase',  // 包装
      'slide-grid',          // 营销（第一个）
      'fly-in-gallery',      // 周边（第一个）
      'panorama-full',       // 产品
      'panorama-marquee',    // 口味（第一个）
      'document-focus',      // 终端
      'gallery-upper'        // 社媒
    ],
    // 用于范围检测的所有屏幕（确保滚动到任意屏幕时胶囊都显示）
    allScreens: [
      'concept-comparison',
      'component-showcase',
      'slide-grid',
      'paired-document-grid',
      'fly-in-gallery',
      'grouped-carousel',
      'cards-marquee',
      'square-grid',
      'panorama-full',
      'panorama-marquee',
      'product-grid-36',
      'document-focus',
      'gallery-upper'
    ],
    labels: [
      '概念',
      '包装',
      '营销',
      '周边',
      '产品',
      '口味',
      '终端',
      '社媒'
    ]
  },
  totalScreens: 14, // 新增一屏：scroll-text-gallery-upper
  bgColor: '#000000', // 统一背景色 - 纯黑
  screens: [
    // Screen 01: Intro - 全屏背景 (4983×2804, 16:9) with reveal effect
    {
      id: 'intro',
      type: 'intro',
      categoryLabel: '引言',
      imageHint: 'Product B Hero Shot',
      bgImage: `${MOBILE_COVER_BASE}/Desktop - 3.png`,
      enableFlashlight: true,
      flashlightInitialPosition: { x: 0.32, y: 0.55 }, // 左中（手持设备）
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    // Screen 02: 概念对比 - 弹出组件展示产品差异
    {
      id: 'concept-comparison',
      type: 'auto-sequence-popup',
      categoryLabel: '概念对比',
      interval: 400, // 弹出间隔
      duration: 0.8, // 动画持续时间
      bgColor: '#000',
      structuredContent: [
        {
          type: 'intro',
          text: '这一屏用「产品1 vs 产品2」的对照，把沿用的品牌骨架与新增的体验表达拆开说明，让差异一眼可读。'
        },
        {
          type: 'section',
          title: '不变：延续品牌系统的骨架',
          items: [
            '统一 Logo 位置与露出逻辑',
            '统一斜纹/纹理语言作为系列识别',
            '统一整体比例与关键结构边界（在同一系统里迭代）'
          ]
        },
        {
          type: 'section',
          title: '变化：通过 CMF 与细节做「合理升级」',
          items: [
            '两条风格路线对比：理性功能导向的工业科技风 vs 情绪感知导向的未来消费电子风',
            '边框与金属件：黑色磨砂金属边框 vs 银色镜面金属边框',
            '背板处理：低饱和度金属漆背板 vs 高饱和度金属漆背板',
            '配色策略：在同一系统中扩展更丰富、更情绪化的颜色组合'
          ]
        }
      ],
      images: [
        { src: `${PHASE03_BASE}/concept-popup/6.png`, label: '延续品牌系统的骨架' },
        { src: `${PHASE03_BASE}/concept-popup/7.png`, label: '通过 CMF 与细节做合理升级' },
        { src: `${PHASE03_BASE}/concept-popup/8.png`, label: '理性功能导向的工业科技风' },
        { src: `${PHASE03_BASE}/concept-popup/9.png`, label: '情绪感知导向的未来消费电子风' },
        { src: `${PHASE03_BASE}/concept-popup/10.png`, label: '边框与金属件对比' },
        { src: `${PHASE03_BASE}/concept-popup/11.png`, label: '背板处理对比' },
        { src: `${PHASE03_BASE}/concept-popup/12.png`, label: '配色策略扩展' }
      ],
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' }
    },
    // Screen 03: 组件展示 - 混合网格 (共8张)
    {
      id: 'component-showcase',
      type: 'component-showcase',
      categoryLabel: '包装/包装体系',
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
    // Screen 04a: 文字过渡条 - 区域KV 文案
    {
      id: 'scroll-text-slide-grid',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-03.screens.slide-grid.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 04b: 三列幻灯片网格 - 9张 16:9 幻灯片（不同区域KV）
    {
      id: 'slide-grid',
      type: 'slide-grid',
      categoryLabel: '营销/不同区域KV',
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
    // Screen 05a: 文字过渡条 - 口味KV 文案
    {
      id: 'scroll-text-paired-doc',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-03.screens.paired-document-grid.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 05b: 三列配对文档网格 - 9组共18张 A4 文档（不同口味KV）
    {
      id: 'paired-document-grid',
      type: 'paired-document-grid',
      categoryLabel: '营销/不同口味KV',
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
    // Screen 06a: 文字过渡条 - 贴纸资产文案
    {
      id: 'scroll-text-fly-in',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-03.screens.fly-in-gallery.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 06b: 等高飞入画廊 - 7张图片同时飞入展示（贴纸图形资产包）
    {
      id: 'fly-in-gallery',
      type: 'fly-in-gallery',
      categoryLabel: '周边/贴纸图形资产包',
      scrollBehavior: { sticky: true, length: 'medium', intensity: 'medium' },
      stickyHeight: 180, // 滚动 180vh 后离开
      imageHeight: '38vh', // 缩小图片高度
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
    // Screen 07: 分组轮播 - 3组产品图 (3+8+4=15张)（周边壳套设计）
    {
      id: 'grouped-carousel',
      type: 'grouped-carousel',
      categoryLabel: '周边/周边壳套设计',
      showGroupLabel: false,
      showItemCount: false,
      aspectRatio: '3 / 4', // 竖向产品图，避免被截断
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      groups: [
        {
          label: 'Series A',
          labelKey: 'case.phases.phase-03.screens.grouped-carousel.groups.0.label',
          images: [
            { src: `${PHASE03_BASE}/product/groups/01/Frame 1430105703.png`, label: 'A-1' },
            { src: `${PHASE03_BASE}/product/groups/01/Frame 1430105705.png`, label: 'A-2' },
            { src: `${PHASE03_BASE}/product/groups/01/Frame 1430105706.png`, label: 'A-3' }
          ]
        },
        {
          label: 'Series B',
          labelKey: 'case.phases.phase-03.screens.grouped-carousel.groups.1.label',
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
          labelKey: 'case.phases.phase-03.screens.grouped-carousel.groups.2.label',
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
      categoryLabel: '周边/壳套丝印图样设计',
      contentKey: 'case.phases.phase-03.screens.cards-marquee.content',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'medium' },
      stickyHeight: 200, // 滚动 200vh 后离开
      showGradient: false,
      rowHeights: [170, 170, 170], 
      containerPadding: '20px 0 60px 0', // 上移容器（减少顶部 padding，增加底部 padding）
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
    // Screen 09a: 文字过渡条 - 款式收敛 文案
    {
      id: 'scroll-text-square-grid',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-03.screens.square-grid.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 09b: Square 网格滚动渐现 - 12张方形图 4×3
    {
      id: 'square-grid',
      type: 'square-grid',
      categoryLabel: '周边/壳套款式收敛',
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
    // Screen 08: 全景展示 - 多图自动弹出（产品速读 - 组件内已有文案）
    {
      id: 'panorama-full',
      type: 'auto-sequence-popup',
      categoryLabel: '产品/产品速读',
      interval: 300,
      duration: 0.6,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      images: [
        { src: `${PHASE03_BASE}/panorama-popup/Frame 95.png`, label: 'Panorama 1' },
        { src: `${PHASE03_BASE}/panorama-popup/Frame 96.png`, label: 'Panorama 2' },
        { src: `${PHASE03_BASE}/panorama-popup/Frame 97.png`, label: 'Panorama 3' },
        { src: `${PHASE03_BASE}/panorama-popup/Frame 98.png`, label: 'Panorama 4' },
        { src: `${PHASE03_BASE}/panorama-popup/Frame 99.png`, label: 'Panorama 5' }
      ]
    },
    // Screen 07: 三行跑马灯 - 口味与色彩适配 (与周边区相同的组件类型)
    {
      id: 'panorama-marquee',
      type: 'three-row-marquee',
      categoryLabel: '口味/口味与色彩适配',
      contentKey: 'case.phases.phase-03.screens.panorama-marquee.content',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'medium' },
      stickyHeight: 200, // 滚动 200vh 后离开
      showGradient: false,
      rowGap: '6px', // 三行间距更小
      rowHeights: [170, 170, 170], // 每行高度缩小（默认 220, 200, 220）



      images: [
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
      ]
    },
    // Screen 12a: 文字过渡条 - 口味资源库 文案
    {
      id: 'scroll-text-product-grid-36',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-03.screens.product-grid-36.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 12b: 6×6 正方形网格 - 36张产品图 (1052×1052)
    {
      id: 'product-grid-36',
      type: 'square-grid',
      categoryLabel: '口味/口味资源库',
      columns: 6,
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
    // Screen 12.5: 终端展架展示 - 使用分组轮播组件
    {
      id: 'document-focus',
      type: 'grouped-carousel',
      categoryLabel: '终端/展架展示',
      contentKey: 'case.phases.phase-03.screens.document-focus.content',
      showGroupLabel: false,
      showItemCount: false,
      aspectRatio: 'auto', // 自适应图片原始比例
      imageScale: 0.6, // 缩小图片尺寸以完整显示
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      groups: [
        {
          label: '展架 A',
          labelKey: 'case.phases.phase-03.screens.document-focus.groups.0.label',
          images: [
            { src: `${PHASE03_BASE}/document-focus/focus-01.png`, label: '展架 1' }
          ]
        },
        {
          label: '展架 B',
          labelKey: 'case.phases.phase-03.screens.document-focus.groups.1.label',
          images: [
            { src: `${PHASE03_BASE}/document-focus/focus-02.png`, label: '展架 2' }
          ]
        },
        {
          label: '展架 C',
          labelKey: 'case.phases.phase-03.screens.document-focus.groups.2.label',
          images: [
            { src: `${PHASE03_BASE}/document-focus/focus-03.png`, label: '展架 3' }
          ]
        }
      ]
    },
    // Screen 12.6: 文字过渡条 - 社交媒体素材制作 文案
    {
      id: 'scroll-text-gallery-upper',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-03.screens.gallery-upper.content',
      padding: '40px 24px 40px 24px'
    },
    // Screen 13: 瀑布流画廊 - 社交媒体素材制作
    {
      id: 'gallery-upper',
      type: 'natural-parallax-grid',
      categoryLabel: '社媒/社交媒体素材制作',
      hideContent: true, // 文案已移至独立的 scroll-text-bar 显示
      maxWidth: '1400px',
      columns: 5,
      gap: '20px',
      paddingTop: 60,
      parallaxIntensity: 1,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      // 将18张图片分为2组（每组9张）
      groups: [
        {
          label: 'GALLERY A',
          columns: 4,
          images: [
            { src: `${PHASE03_BASE}/gallery-a/page-01.png`, label: 'Page 1' },
            { src: `${PHASE03_BASE}/gallery-a/page-02.png`, label: 'Page 2' },
            { src: `${PHASE03_BASE}/gallery-a/page-03.png`, label: 'Page 3' },
            { src: `${PHASE03_BASE}/gallery-a/page-04.png`, label: 'Page 4' },
            { src: `${PHASE03_BASE}/gallery-a/page-05.png`, label: 'Page 5' },
            { src: `${PHASE03_BASE}/gallery-a/page-06.png`, label: 'Page 6' },
            { src: `${PHASE03_BASE}/gallery-a/page-07.png`, label: 'Page 7' },
            { src: `${PHASE03_BASE}/gallery-a/page-08.png`, label: 'Page 8' }
          ]
        },
        {
          label: 'GALLERY B',
          columns: 5,
          images: [
            { src: `${PHASE03_BASE}/gallery-b/poster-01.png`, label: 'Poster 1' },
            { src: `${PHASE03_BASE}/gallery-b/poster-02.png`, label: 'Poster 2' },
            { src: `${PHASE03_BASE}/gallery-b/poster-03.png`, label: 'Poster 3' },
            { src: `${PHASE03_BASE}/gallery-b/poster-04.png`, label: 'Poster 4' },
            { src: `${PHASE03_BASE}/gallery-b/poster-05.png`, label: 'Poster 5' },
            { src: `${PHASE03_BASE}/gallery-b/poster-06.png`, label: 'Poster 6' },
            { src: `${PHASE03_BASE}/gallery-b/poster-07.png`, label: 'Poster 7' },
            { src: `${PHASE03_BASE}/gallery-b/poster-08.png`, label: 'Poster 8' },
            { src: `${PHASE03_BASE}/gallery-b/poster-09.png`, label: 'Poster 9' },
            { src: `${PHASE03_BASE}/gallery-a/page-09.png`, label: 'Page 9' }
          ]
        }
      ]
    },
    // Screen 10: Closing - 收尾导航
    {
      id: 'closing',
      type: 'phase-closing',
      categoryLabel: '收尾',
      sticky: true,
      stickyHeight: 200,
      scrollBehavior: { sticky: true, length: 'normal', intensity: 'none' },
      bgImage: `${PHASE03_BASE}/cover/hero.png`
    }
  ]
};

// Phase 04 素材基础路径
const PHASE04_BASE = '/images/phase-04';

// Phase 04: Packaging & Marketing Extensions (14屏)
export const phase04Config = {
  id: 'phase-04',
  number: '04',
  titleEn: 'Packaging & Marketing Extensions',
  titleKey: 'case.phases.phase-04.title',
  prev: 'phase-03',
  next: 'phase-05',
  // 左上角胶囊导航配置
  processFlow: {
    screens: ['packaging-bag-series', 'kv-marquee', 'products-oil', 'products-nano', 'products-kiyomi', 'products-spark', 'products-addone', 'products-mingcang', 'products-mistflow', 'offline-badges'],
    labels: ['包装', 'KV', '烟油', 'Nano', 'Kiyomi', 'Spark', 'Addone', 'Mingcang', 'Mist Flow', '线下物料']
  },
  totalScreens: 25, // 添加全部线下物料模块后：25屏
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  screens: [
    // Screen 01: Intro - 建立语境 (with reveal + flashlight effects)
    {
      id: 'intro',
      type: 'intro',
      categoryLabel: '引言',
      imageHint: '包装与营销系统化扩展',
      bgImage: `${MOBILE_COVER_BASE}/Desktop - 4.png`,
      enableFlashlight: true,
      flashlightInitialPosition: { x: 0.7, y: 0.55 }, // 右下（迪拜帆船酒店）
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    
    // Screen 02: 文字过渡条 - 分层定价包装体系
    {
      id: 'scroll-text-intro-packaging',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.packaging-intro.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 03: 袋装系列 - 3列2行独立展示（更大图片尺寸）
    {
      id: 'packaging-bag-series',
      type: 'square-grid',
      categoryLabel: '包装 / 袋装系列',
      columns: 3,
      noBorder: false,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        // 袋装系列 (5张 - 3+2布局)
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/1-bag/Nicotine Drops.png`, label: 'Bag-1' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/1-bag/Nicotine Drops-1.png`, label: 'Bag-2' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/1-bag/Nicotine Drops-2.png`, label: 'Bag-3' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/1-bag/Nicotine Drops-3.png`, label: 'Bag-4' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/1-bag/Nicotine Drops-4.png`, label: 'Bag-5' }
      ]
    },
    
    // Screen 03: 包装形态系统 - 5列3行网格（胶盒装、铁盒装、子弹盒）
    {
      id: 'packaging-grid',
      type: 'square-grid',
      categoryLabel: '包装 / 分层定价包装体系',
      columns: 5,
      noBorder: false,
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        // 胶盒装系列 (5张)
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/2-plastic-box/Nicotine Drops.png`, label: 'Box-1' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/2-plastic-box/24.png`, label: 'Box-2' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/2-plastic-box/25.png`, label: 'Box-3' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/2-plastic-box/26.png`, label: 'Box-4' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/2-plastic-box/Nicotine Drops-1.png`, label: 'Box-5' },
        
        // 铁盒装系列 (5张)
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/3-tin-box/Nicotine Drops.png`, label: 'Tin-1' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/3-tin-box/Nicotine Drops-1.png`, label: 'Tin-2' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/3-tin-box/Nicotine Drops-2.png`, label: 'Tin-3' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/3-tin-box/Nicotine Drops-3.png`, label: 'Tin-4' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/3-tin-box/Nicotine Drops-4.png`, label: 'Tin-5' },
        
        // 子弹盒系列 (5张)
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/4-bullet-box/Nicotine Drops.png`, label: 'Bullet-1' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/4-bullet-box/Nicotine Drops-1.png`, label: 'Bullet-2' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/4-bullet-box/Nicotine Drops-2.png`, label: 'Bullet-3' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/4-bullet-box/Nicotine Drops-3.png`, label: 'Bullet-4' },
        { src: `${PHASE04_BASE}/2-products/1-nicotine-drops/4-bullet-box/Nicotine Drops-4.png`, label: 'Bullet-5' }
      ]
    },
    
    // Screen 04: 主视觉跑马灯 - 三行流动 (sticky效果)
    {
      id: 'kv-marquee',
      type: 'three-row-marquee',
      categoryLabel: 'KV / 主视觉呈现',
      contentKey: 'case.phases.phase-04.screens.kv-marquee.content',
      scrollBehavior: { sticky: true, length: 'medium', intensity: 'low' },
      stickyHeight: 200, // sticky 停留的滚动高度 (vh)
      showGradient: false,
      images: [
        // Row 1: 黑色系列
        { src: `${PHASE04_BASE}/1-banner/1-black/Group 189.png`, label: 'Black-1' },
        { src: `${PHASE04_BASE}/1-banner/1-black/Group 311.png`, label: 'Black-2' },
        { src: `${PHASE04_BASE}/1-banner/1-black/Group 312.png`, label: 'Black-3' },
        
        // Row 2: R15 + 黄色系列
        { src: `${PHASE04_BASE}/1-banner/2-r15/banner-RHYTHM 15 2.png`, label: 'R15-1' },
        { src: `${PHASE04_BASE}/1-banner/2-r15/Group 299.png`, label: 'R15-2' },
        { src: `${PHASE04_BASE}/1-banner/3-yellow/banner 16.png`, label: 'Yellow-1' },
        { src: `${PHASE04_BASE}/1-banner/3-yellow/Group 298.png`, label: 'Yellow-2' },
        
        // Row 3: 蓝色系列
        { src: `${PHASE04_BASE}/1-banner/4-blue/Group 308.png`, label: 'Blue-1' },
        { src: `${PHASE04_BASE}/1-banner/4-blue/Group 394.png`, label: 'Blue-2' }
      ]
    },
    
    // Screen 05: 主视觉全屏切换
    {
      id: 'kv-popup',
      type: 'popup-sequence',
      categoryLabel: 'KV / 全屏展示',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE04_BASE}/1-banner/1-black/Group 189.png`, label: '黑色系统' },
        { src: `${PHASE04_BASE}/1-banner/2-r15/banner-RHYTHM 15 2.png`, label: 'R15系列' },
        { src: `${PHASE04_BASE}/1-banner/3-yellow/banner 16.png`, label: '黄色系统' },
        { src: `${PHASE04_BASE}/1-banner/4-blue/Group 308.png`, label: '蓝色系统' }
      ]
    },
    
    // Screen 06a: 文字过渡条 - 烟油产品文案
    {
      id: 'scroll-text-intro-oil',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.products-oil.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 06b: 产品系列 A - 烟油方形网格 (透明素材，无边框)
    {
      id: 'products-oil',
      type: 'square-grid',
      categoryLabel: '产品 / 烟油',
      columns: 4,
      noBorder: true,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      images: [
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT.png`, label: 'Oil-Base' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-1.png`, label: 'Oil-1' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-2.png`, label: 'Oil-2' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-3.png`, label: 'Oil-3' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-4.png`, label: 'Oil-4' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-5.png`, label: 'Oil-5' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-6.png`, label: 'Oil-6' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-7.png`, label: 'Oil-7' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-8.png`, label: 'Oil-8' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-9.png`, label: 'Oil-9' },
        { src: `${PHASE04_BASE}/2-products/2-oil/ICE FLOW NICSALT-10.png`, label: 'Oil-10' }
      ]
    },
    
    // Screen 07a: 文字过渡条 - Nano 产品文案
    {
      id: 'scroll-text-intro-nano',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.products-nano.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 07b: 产品系列 B - Nano方形网格 (2行6列，密集展示)
    {
      id: 'products-nano',
      type: 'square-grid',
      categoryLabel: '产品 / Nano',
      columns: 6,
      imageScale: 0.75,
      gap: '0.3rem',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' },
      images: [
        { src: `${PHASE04_BASE}/2-products/3-nano/51.png`, label: 'Nano-1' },
        { src: `${PHASE04_BASE}/2-products/3-nano/52.png`, label: 'Nano-2' },
        { src: `${PHASE04_BASE}/2-products/3-nano/53.png`, label: 'Nano-3' },
        { src: `${PHASE04_BASE}/2-products/3-nano/54.png`, label: 'Nano-4' },
        { src: `${PHASE04_BASE}/2-products/3-nano/55.png`, label: 'Nano-5' },
        { src: `${PHASE04_BASE}/2-products/3-nano/56.png`, label: 'Nano-6' },
        { src: `${PHASE04_BASE}/2-products/3-nano/57.png`, label: 'Nano-7' },
        { src: `${PHASE04_BASE}/2-products/3-nano/58.png`, label: 'Nano-8' },
        { src: `${PHASE04_BASE}/2-products/3-nano/59.png`, label: 'Nano-9' },
        { src: `${PHASE04_BASE}/2-products/3-nano/60.png`, label: 'Nano-10' },
        { src: `${PHASE04_BASE}/2-products/3-nano/61.png`, label: 'Nano-11' },
        { src: `${PHASE04_BASE}/2-products/3-nano/62.png`, label: 'Nano-12' }
      ]
    },
    
    // Screen 08a: 文字过渡条 - Kiyomi 产品文案
    {
      id: 'scroll-text-intro-kiyomi',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.products-kiyomi.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 08b: 产品系列 C - Kiyomi配对滚动展示（两行布局：每行5对）
    {
      id: 'products-kiyomi',
      type: 'product-pair-scroll',
      categoryLabel: '产品 / Kiyomi',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      showLabel: false, // 隐藏图片下方标签
      pairs: [
        // Pair 1: K-63
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/63.png`, label: 'K-63' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/63-1.png`, label: 'K-63-v' }
        },
        // Pair 2: K-64
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/64.png`, label: 'K-64' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/64-1.png`, label: 'K-64-v' }
        },
        // Pair 3: K-65
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/65.png`, label: 'K-65' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/65-1.png`, label: 'K-65-v' }
        },
        // Pair 4: K-66
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/66.png`, label: 'K-66' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/66-1.png`, label: 'K-66-v' }
        },
        // Pair 5: K-67
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/67.png`, label: 'K-67' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/67-1.png`, label: 'K-67-v' }
        },
        // Pair 6: K-68
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/68.png`, label: 'K-68' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/68-1.png`, label: 'K-68-v' }
        },
        // Pair 7: K-69
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/69.png`, label: 'K-69' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/69-1.png`, label: 'K-69-v' }
        },
        // Pair 8: K-70
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/70.png`, label: 'K-70' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/70-1.png`, label: 'K-70-v' }
        },
        // Pair 9: K-71
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/71.png`, label: 'K-71' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/71-1.png`, label: 'K-71-v' }
        },
        // Pair 10: K-74
        {
          main: { src: `${PHASE04_BASE}/2-products/4-kiyomi/74.png`, label: 'K-74' },
          variant: { src: `${PHASE04_BASE}/2-products/4-kiyomi/74-1.png`, label: 'K-74-v' }
        }
      ]
    },
    
    // Screen 09a: 文字过渡条 - Spark 产品文案
    {
      id: 'scroll-text-intro-spark',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.products-spark.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 09b: 产品系列 D - Spark 产品配对展示（2行×5列视差滚动）
    {
      id: 'products-spark',
      type: 'product-pair-scroll',
      categoryLabel: '产品 / Spark',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      showLabel: false, // 隐藏图片下方标签
      pairs: [
        // Pair 1: Spark-75
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/75.png`, label: 'Spark-75' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105698.png`, label: 'Package-1' }
        },
        // Pair 2: Spark-76
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/76.png`, label: 'Spark-76' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105699.png`, label: 'Package-2' }
        },
        // Pair 3: Spark-77
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/77.png`, label: 'Spark-77' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105700.png`, label: 'Package-3' }
        },
        // Pair 4: Spark-78
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/78.png`, label: 'Spark-78' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105701.png`, label: 'Package-4' }
        },
        // Pair 5: Spark-79
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/79.png`, label: 'Spark-79' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105702.png`, label: 'Package-5' }
        },
        // Pair 6: Spark-80
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/80.png`, label: 'Spark-80' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105703.png`, label: 'Package-6' }
        },
        // Pair 7: Spark-81
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/81.png`, label: 'Spark-81' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105704.png`, label: 'Package-7' }
        },
        // Pair 8: Spark-82
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/82.png`, label: 'Spark-82' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105705.png`, label: 'Package-8' }
        },
        // Pair 9: Spark-83
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/83.png`, label: 'Spark-83' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105706.png`, label: 'Package-9' }
        },
        // Pair 10: Spark-84
        {
          main: { src: `${PHASE04_BASE}/2-products/5-spark/product/84.png`, label: 'Spark-84' },
          variant: { src: `${PHASE04_BASE}/2-products/5-spark/package/Frame 1430105707.png`, label: 'Package-10' }
        }
      ]
    },
    
    // Screen 10: Addone 系列 - 分行展示（product 上行 + package 下行，纯纵向滚动）
    {
      id: 'products-addone',
      type: 'two-row-static',
      categoryLabel: '产品 / Addone',
      sticky: true,
      stickyHeight: 200,
      scrollBehavior: { sticky: true, length: 'normal', intensity: 'medium' },
      title: 'ADDONE SERIES',
      layout: {
        rows: [
          { count: 5, scale: 1.8, aspectRatio: 0.6 },  // 上行：5张竖版 product（容器宽高比 0.6，确保纵向完整显示）
          { count: 3, scale: 2.3, aspectRatio: 0.75 } // 下行：3张 package（稍宽一点）
        ]
      },
      images: [
        // Product 主体（5张 - 上行）
        { src: `${PHASE04_BASE}/2-products/7-addone/product/image 143.png`, label: 'Addone-P1' },
        { src: `${PHASE04_BASE}/2-products/7-addone/product/image 144.png`, label: 'Addone-P2' },
        { src: `${PHASE04_BASE}/2-products/7-addone/product/image 145.png`, label: 'Addone-P3' },
        { src: `${PHASE04_BASE}/2-products/7-addone/product/image 146.png`, label: 'Addone-P4' },
        { src: `${PHASE04_BASE}/2-products/7-addone/product/image 147.png`, label: 'Addone-P5' },
        // Package 包装（3张 - 下行，更大）
        { src: `${PHASE04_BASE}/2-products/7-addone/package/30.png`, label: 'Addone-Pkg1' },
        { src: `${PHASE04_BASE}/2-products/7-addone/package/31.png`, label: 'Addone-Pkg2' },
        { src: `${PHASE04_BASE}/2-products/7-addone/package/32.png`, label: 'Addone-Pkg3' }
      ]
    },
    
    // Screen 10c: 文字过渡条 - Mingcang 产品文案
    {
      id: 'scroll-text-intro-mingcang',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.products-mingcang.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 10d: Mingcang 系列 - 网格展示（type1 + type2）
    {
      id: 'products-mingcang',
      type: 'square-grid',
      categoryLabel: '产品 / Mingcang',
      columns: 5,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        // Type 1（5张）
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type1/10.png`, label: 'Mingcang-T1-1' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type1/11.png`, label: 'Mingcang-T1-2' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type1/12.png`, label: 'Mingcang-T1-3' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type1/4088173.png`, label: 'Mingcang-T1-4' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type1/4088174.png`, label: 'Mingcang-T1-5' },
        // Type 2（5张）
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type2/image 148.png`, label: 'Mingcang-T2-1' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type2/image 149.png`, label: 'Mingcang-T2-2' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type2/image 150.png`, label: 'Mingcang-T2-3' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type2/image 151.png`, label: 'Mingcang-T2-4' },
        { src: `${PHASE04_BASE}/2-products/8-mingcang/type2/image 152.png`, label: 'Mingcang-T2-5' }
      ]
    },
    
    // Screen 10e: Mist Flow 系列 - 两列展示（顶部文案 + 左右两图）
    {
      id: 'products-mistflow',
      type: 'two-column-showcase',
      categoryLabel: '产品 / Mist Flow',
      contentKey: 'case.phases.phase-04.screens.products-mistflow.content',
      scrollBehavior: { sticky: false, length: 'short', intensity: 'low' },
      gap: '60px',
      imageScale: 0.85,
      topPadding: '100px',
      imagePadding: '40px 60px',
      images: [
        { src: `${PHASE04_BASE}/2-products/6-mist flow/13.png`, label: 'Mist-1' },
        { src: `${PHASE04_BASE}/2-products/6-mist flow/14.png`, label: 'Mist-2' }
      ]
    },
    
    // Screen 11a: 文字过渡条 - 线下物料·徽章文案
    {
      id: 'scroll-text-intro-badges',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.offline-badges.content',
      padding: '40px 24px 40px 24px'
    },

    // Screen 11b: 线下物料 - 徽章系列（5列3行网格，与 packaging-bag-series 同组件）
    {
      id: 'offline-badges',
      type: 'square-grid',
      categoryLabel: '物料 / 徽章',
      columns: 5,
      noBorder: true,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 1.png`, label: 'Badge-1' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 2.png`, label: 'Badge-2' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 3.png`, label: 'Badge-3' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 4.png`, label: 'Badge-4' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 5.png`, label: 'Badge-5' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 6.png`, label: 'Badge-6' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 7.png`, label: 'Badge-7' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 8.png`, label: 'Badge-8' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 9.png`, label: 'Badge-9' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 10.png`, label: 'Badge-10' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 11.png`, label: 'Badge-11' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 12.png`, label: 'Badge-12' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 13.png`, label: 'Badge-13' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 14.png`, label: 'Badge-14' },
        { src: `${PHASE04_BASE}/3-offline-materials/1-badges/img_v3_02lr_90dec6e4-fdd5-49f4-a674-9065210c57fg 15.png`, label: 'Badge-15' }
      ]
    },

    // Screen 12a: 文字过渡条 - 线下物料·展架文案
    {
      id: 'scroll-text-intro-display-stands',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.offline-display-stands.content',
      padding: '40px 24px 40px 24px'
    },

    // Screen 12b: 线下物料 - 展架系列（5列2行网格）
    {
      id: 'offline-display-stands',
      type: 'square-grid',
      categoryLabel: '物料 / 展架',
      columns: 5,
      noBorder: true,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/33.png`, label: 'Stand-1' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/34.png`, label: 'Stand-2' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/35.png`, label: 'Stand-3' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/36.png`, label: 'Stand-4' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/37.png`, label: 'Stand-5' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/4088175.png`, label: 'Stand-6' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/4088176.png`, label: 'Stand-7' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/4088177.png`, label: 'Stand-8' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/4088178.png`, label: 'Stand-9' },
        { src: `${PHASE04_BASE}/3-offline-materials/2-display-stands/4088179.png`, label: 'Stand-10' }
      ]
    },

    // Screen 13a: 文字过渡条 - 线下物料·物品文案
    {
      id: 'scroll-text-intro-items',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.offline-items.content',
      padding: '40px 24px 40px 24px'
    },

    // Screen 13b: 线下物料 - 周边物品系列（5列2行网格）
    {
      id: 'offline-items',
      type: 'square-grid',
      categoryLabel: '物料 / 物品',
      columns: 5,
      noBorder: true,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/44.png`, label: 'Item-1' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/45.png`, label: 'Item-2' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/46.png`, label: 'Item-3' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/48.png`, label: 'Item-4' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/49.png`, label: 'Item-5' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/4088180.png`, label: 'Item-6' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/4088181.png`, label: 'Item-7' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/4088182.png`, label: 'Item-8' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/4088183.png`, label: 'Item-9' },
        { src: `${PHASE04_BASE}/3-offline-materials/3-items/4088184.png`, label: 'Item-10' }
      ]
    },

    // Screen 14a: 文字过渡条 - 线下物料·贴纸文案
    {
      id: 'scroll-text-intro-stickers',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.offline-stickers.content',
      padding: '40px 24px 40px 24px'
    },

    // Screen 14b: 线下物料 - 贴纸系列（5列2行网格）
    {
      id: 'offline-stickers',
      type: 'square-grid',
      categoryLabel: '物料 / 贴纸',
      columns: 5,
      noBorder: true,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/1 30328.png`, label: 'Sticker-1' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/1 30329.png`, label: 'Sticker-2' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/2 4.png`, label: 'Sticker-3' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/2 7.png`, label: 'Sticker-4' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/3 8678.png`, label: 'Sticker-5' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/3 8679.png`, label: 'Sticker-6' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/3 8680.png`, label: 'Sticker-7' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/3 8681.png`, label: 'Sticker-8' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/3 8682.png`, label: 'Sticker-9' },
        { src: `${PHASE04_BASE}/3-offline-materials/4-stickers/3 8683.png`, label: 'Sticker-10' }
      ]
    },

    // Screen 15a: 文字过渡条 - 立牌（不规则）文案
    {
      id: 'scroll-text-intro-signs-irregular',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.offline-signs-irregular.content',
      padding: '40px 24px 40px 24px'
    },

    // Screen 15b: 线下物料 - 立牌（不规则）3列2行
    {
      id: 'offline-signs-irregular',
      type: 'square-grid',
      categoryLabel: '物料 / 立牌（不规则）',
      columns: 3,
      noBorder: true,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        { src: `${PHASE04_BASE}/3-offline-materials/5-signs-irregular/image 141.png`, label: 'Sign-Irr-1' },
        { src: `${PHASE04_BASE}/3-offline-materials/5-signs-irregular/image 142.png`, label: 'Sign-Irr-2' },
        { src: `${PHASE04_BASE}/3-offline-materials/5-signs-irregular/image 143.png`, label: 'Sign-Irr-3' },
        { src: `${PHASE04_BASE}/3-offline-materials/5-signs-irregular/image 157.png`, label: 'Sign-Irr-4' },
        { src: `${PHASE04_BASE}/3-offline-materials/5-signs-irregular/image 158.png`, label: 'Sign-Irr-5' },
        { src: `${PHASE04_BASE}/3-offline-materials/5-signs-irregular/image 159.png`, label: 'Sign-Irr-6' }
      ]
    },

    // Screen 16: 线下物料 - 立牌（规则）popup-sequence，单次弹出一张
    {
      id: 'offline-signs-regular',
      type: 'popup-sequence',
      categoryLabel: '物料 / 立牌（规则）',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE04_BASE}/3-offline-materials/7-signs-regular/img_v3_02tg_1eaf34e7-8979-4f54-9b66-c6c12d1abb1g 1.png`, label: '规则立牌-1' },
        { src: `${PHASE04_BASE}/3-offline-materials/7-signs-regular/img_v3_02tg_4e8d9c17-4619-4eb6-a301-19e71af5aaeg 1.png`, label: '规则立牌-2' },
        { src: `${PHASE04_BASE}/3-offline-materials/7-signs-regular/img_v3_02tg_b17d8636-523d-4f16-adcb-044c724d4d7g 1.png`, label: '规则立牌-3' }
      ]
    },

    // Screen 17a: 文字过渡条 - 门帖文案
    {
      id: 'scroll-text-intro-door-posters',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-04.screens.offline-door-posters.content',
      padding: '40px 24px 40px 24px'
    },

    // Screen 17b: 线下物料 - 门帖 3列2行
    {
      id: 'offline-door-posters',
      type: 'square-grid',
      categoryLabel: '物料 / 门帖',
      columns: 3,
      noBorder: true,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        { src: `${PHASE04_BASE}/3-offline-materials/6-door-posters/image 160.png`, label: 'Door-1' },
        { src: `${PHASE04_BASE}/3-offline-materials/6-door-posters/image 161.png`, label: 'Door-2' },
        { src: `${PHASE04_BASE}/3-offline-materials/6-door-posters/image 162.png`, label: 'Door-3' },
        { src: `${PHASE04_BASE}/3-offline-materials/6-door-posters/image 163.png`, label: 'Door-4' },
        { src: `${PHASE04_BASE}/3-offline-materials/6-door-posters/image 164.png`, label: 'Door-5' },
        { src: `${PHASE04_BASE}/3-offline-materials/6-door-posters/image 165.png`, label: 'Door-6' }
      ]
    },

    // Screen 18: Closing - 收束与导航
    {
      id: 'closing',
      type: 'phase-closing',
      categoryLabel: '收尾',
      sticky: true,
      stickyHeight: 200,
      scrollBehavior: { sticky: true, length: 'normal', intensity: 'none' },
      bgImage: `${PHASE04_BASE}/1-banner/1-black/Group 312.png`
    }
  ]
};

// Phase 05 素材基础路径
const PHASE05_BASE = '/images/phase-05';

// Phase 05: Retail & Experience Expansion (15屏)
export const phase05Config = {
  id: 'phase-05',
  number: '05',
  titleEn: 'Retail & Experience Expansion',
  titleKey: 'case.phases.phase-05.title',
  prev: 'phase-04',
  next: 'phase-06',
  // 顶部胶囊导航配置
  processFlow: {
    screens: ['kv-kiyomi', 'kv-nicotine-drops', 'kv-mixed-grid', 'photo-cube', 'photo-display', 'mockups'],
    labels: ['KV/KIYOMI', 'KV/尼古丁', 'KV/混合', '实拍', '展架', '效果图'],
    allScreens: [
      'kv-kiyomi',
      'kv-nicotine-drops',
      'kv-mixed-grid', 'kv-marquee-mix',
      'scroll-text-intro-cube', 'photo-cube',
      'scroll-text-intro-motor', 'photo-motor',
      'photo-display',
      'photo-store',
      'photo-packaging',
      'scroll-text-intro-expo', 'photo-expo',
      'mockups'
    ]
  },
  totalScreens: 15, // 15 - 3 + 1 + 2 = 15 (合并 Screen 04/05/06, 新增 motor/expo 文字条)
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  screens: [
    // Screen 01: Intro - 建立语境
    {
      id: 'intro',
      type: 'intro',
      categoryLabel: '引言',
      imageHint: '零售场景与体验拓展',
      bgImage: `${MOBILE_COVER_BASE}/Desktop - 5.png`,
      enableFlashlight: true,
      flashlightInitialPosition: { x: 0.7, y: 0.15 }, // 右上角初始光圈位置
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    
    // Screen 02: KV - KIYOMI 系列主视觉（6组×31张）
    {
      id: 'kv-kiyomi',
      type: 'grouped-carousel',
      categoryLabel: 'KV / KIYOMI',
      contentKey: 'case.phases.phase-05.screens.kv-kiyomi.content',
      showGroupLabel: false,
      showItemCount: false,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      groups: [
        {
          label: 'Hero Flavor Poster 核心口味主视觉',
          labelKey: 'case.phases.phase-05.screens.kv-kiyomi.groups.0.label',
          layout: { rows: [{ count: 6, scale: 5.0 }], colGap: '0px', mainScale: 1.2 },  // 间距为0 + 图片溢出120%
          images: [
            { src: `${PHASE05_BASE}/kv/kiyomi/group-01/A4 - 10.png`, label: 'K01-1' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-01/A4 - 105.png`, label: 'K01-2' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-01/A4 - 108.png`, label: 'K01-3' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-01/A4 - 109.png`, label: 'K01-4' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-01/A4 - 110.png`, label: 'K01-5' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-01/A4 - 111.png`, label: 'K01-6' }
          ]
        },
        {
          label: 'Flavor System Card 口味系统信息卡',
          labelKey: 'case.phases.phase-05.screens.kv-kiyomi.groups.1.label',
          layout: { rows: [{ count: 3, scale: 4.5 }] },  // 2.5 → 4.5 大幅放大
          images: [
            { src: `${PHASE05_BASE}/kv/kiyomi/group-02/A4 - 20.png`, label: 'K02-1' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-02/A4 - 21.png`, label: 'K02-2' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-02/A4 - 22.png`, label: 'K02-3' }
          ]
        },
        {
          label: 'Performance Scene Poster 功能场景海报',
          labelKey: 'case.phases.phase-05.screens.kv-kiyomi.groups.2.label',
          layout: { rows: [{ count: 5, scale: 4 }], colGap: '0px', mainScale: 1.2 },
          images: [
            { src: `${PHASE05_BASE}/kv/kiyomi/group-03/A4 - 5.png`, label: 'K03-1' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-03/A4 - 84.png`, label: 'K03-2' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-03/A4 - 106.png`, label: 'K03-3' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-03/A4 - 112.png`, label: 'K03-4' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-03/A4 - 113.png`, label: 'K03-5' }
          ]
        },
        {
          label: 'Creative Campaign Visual 创意传播视觉',
          labelKey: 'case.phases.phase-05.screens.kv-kiyomi.groups.3.label',
          layout: { rows: [{ count: 4, scale: 4.0 }] },  // 2.3 → 4.0 大幅放大
          images: [
            { src: `${PHASE05_BASE}/kv/kiyomi/group-04/A4 - 83.png`, label: 'K04-1' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-04/A4 - 114.png`, label: 'K04-2' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-04/A4 - 115.png`, label: 'K04-3' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-04/A4 - 116.png`, label: 'K04-4' }
          ]
        },
        {
          label: 'SKU Flavor Card 标准口味识别卡',
          labelKey: 'case.phases.phase-05.screens.kv-kiyomi.groups.4.label',
          layout: { rows: [{ count: 7, scale: 3 }], colGap: '0px', mainScale: 1.4 },
          images: [
            { src: `${PHASE05_BASE}/kv/kiyomi/group-05/A4 - 82.png`, label: 'K05-1' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-05/A4 - 85.png`, label: 'K05-2' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-05/A4 - 86.png`, label: 'K05-3' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-05/A4 - 87.png`, label: 'K05-4' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-05/A4 - 88.png`, label: 'K05-5' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-05/A4 - 89.png`, label: 'K05-6' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-05/A4 - 90.png`, label: 'K05-7' }
          ]
        },
        {
          label: 'Flavor Lineup Poster 全系列展示海报',
          labelKey: 'case.phases.phase-05.screens.kv-kiyomi.groups.5.label',
          layout: { rows: [{ count: 3, scale: 4.5 }] },  // 2.5 → 4.5 大幅放大
          images: [
            { src: `${PHASE05_BASE}/kv/kiyomi/group-06/A4 - 12.png`, label: 'K06-1' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-06/A4 - 107.png`, label: 'K06-2' },
            { src: `${PHASE05_BASE}/kv/kiyomi/group-06/A4 - 117.png`, label: 'K06-3' }
          ]
        }
      ]
    },
    
    // Screen 03: KV - 尼古丁糖（上5下7，分版本展示）
    {
      id: 'kv-nicotine-drops',
      type: 'two-row-static',
      categoryLabel: 'KV / 尼古丁糖',
      sticky: true,
      stickyHeight: 200,
      sequentialPopup: true,
      showItemCount: false,
      scrollBehavior: { sticky: true, length: 'normal', intensity: 'medium' },
      contentKey: 'case.phases.phase-05.screens.kv-nicotine-drops.content',
      layout: {
        rows: [
          { count: 5, scale: 1.4, aspectRatio: 0.71 },  // 上行：第一版（5张），A4竖版比例
          { count: 7, scale: 1.4, aspectRatio: 0.71 }   // 下行：第二版（7张），同等高度
        ]
      },
      images: [
        // 第一版（上行）
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-1/A4 - 43.png`, label: 'ND-V1-1' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-1/A4 - 44.png`, label: 'ND-V1-2' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-1/A4 - 55.png`, label: 'ND-V1-3' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-1/A4 - 56.png`, label: 'ND-V1-4' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-1/A4 - 101.png`, label: 'ND-V1-5' },
        // 第二版（下行）
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-2/A4 - 42.png`, label: 'ND-V2-1' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-2/A4 - 47.png`, label: 'ND-V2-2' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-2/A4 - 60.png`, label: 'ND-V2-3' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-2/A4 - 61.png`, label: 'ND-V2-4' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-2/A4 - 62.png`, label: 'ND-V2-5' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-2/A4 - 103.png`, label: 'ND-V2-6' },
        { src: `${PHASE05_BASE}/kv/nicotine-drops/version-2/A4 - 104.png`, label: 'ND-V2-7' }
      ]
    },
    
    // Screen 04: KV 混合网格（CUBE + SPARK + MOTOR，3列自然滚动视差）
    {
      id: 'kv-mixed-grid',
      type: 'natural-parallax-grid',
      categoryLabel: 'KV / 混合系列',
      maxWidth: '100%',
      columns: 6,
      gap: '8px',
      paddingTop: 0,
      parallaxIntensity: 0,
      groupScrollHeight: 120,
      disableSticky: true,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      groups: [
        {
          label: 'CUBE SERIES',
          images: [
            { src: `${PHASE05_BASE}/kv/cube/A4 - 2.png`, label: 'Cube-1' },
            { src: `${PHASE05_BASE}/kv/cube/A4 - 6.png`, label: 'Cube-2' },
            { src: `${PHASE05_BASE}/kv/cube/A4 - 13.png`, label: 'Cube-3' },
            { src: `${PHASE05_BASE}/kv/cube/A4 - 14.png`, label: 'Cube-4' },
            { src: `${PHASE05_BASE}/kv/cube/A4 - 48.png`, label: 'Cube-5' },
            { src: `${PHASE05_BASE}/kv/cube/A4 - 92.png`, label: 'Cube-6' }
          ]
        },
        {
          label: 'SPARK SERIES',
          images: [
            { src: `${PHASE05_BASE}/kv/spark/中东1.png`, label: 'Spark-ME1' },
            { src: `${PHASE05_BASE}/kv/spark/中东2.png`, label: 'Spark-ME2' },
            { src: `${PHASE05_BASE}/kv/spark/非洲1.png`, label: 'Spark-AF1' },
            { src: `${PHASE05_BASE}/kv/spark/非洲2.png`, label: 'Spark-AF2' },
            { src: `${PHASE05_BASE}/kv/spark/非洲3.png`, label: 'Spark-AF3' },
            { src: `${PHASE05_BASE}/kv/spark/非洲4.png`, label: 'Spark-AF4' }
          ]
        },
        {
          label: 'MOTOR SERIES',
          images: [
            { src: `${PHASE05_BASE}/kv/motor/A4 - 15.png`, label: 'Motor-1' },
            { src: `${PHASE05_BASE}/kv/motor/A4 - 16.png`, label: 'Motor-2' },
            { src: `${PHASE05_BASE}/kv/motor/A4 - 17.png`, label: 'Motor-3' },
            { src: `${PHASE05_BASE}/kv/motor/A4 - 18.png`, label: 'Motor-4' },
            { src: `${PHASE05_BASE}/kv/motor/A4 - 95.png`, label: 'Motor-5' },
            { src: `${PHASE05_BASE}/kv/motor/A.jpg`, label: 'Motor-6' }
          ]
        }
      ]
    },
    
    // Screen 07: KV - M1/R15/烟油混合（KIYOMI 风格分组展示）
    {
      id: 'kv-marquee-mix',
      type: 'grouped-carousel',
      categoryLabel: 'KV / M1·R15·烟油',
      showGroupLabel: false,
      showItemCount: false,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      groups: [
        {
          label: 'M1 SERIES',
          labelKey: 'case.phases.phase-05.screens.kv-marquee-mix.groups.0.label',
          layout: { rows: [{ count: 4, scale: 4.0 }] },  // 4张图，放大4倍
          images: [
            { src: `${PHASE05_BASE}/kv/m1/A4 - 50.png`, label: 'M1-1' },
            { src: `${PHASE05_BASE}/kv/m1/A4 - 51.png`, label: 'M1-2' },
            { src: `${PHASE05_BASE}/kv/m1/A4 - 96.png`, label: 'M1-3' },
            { src: `${PHASE05_BASE}/kv/m1/A4 - 97.png`, label: 'M1-4' }
          ]
        },
        {
          label: 'R15 SERIES',
          labelKey: 'case.phases.phase-05.screens.kv-marquee-mix.groups.1.label',
          layout: { rows: [{ count: 4, scale: 4.0 }] },  // 4张图，放大4倍
          images: [
            { src: `${PHASE05_BASE}/kv/r15/A4 - 59.png`, label: 'R15-1' },
            { src: `${PHASE05_BASE}/kv/r15/A4 - 98.png`, label: 'R15-2' },
            { src: `${PHASE05_BASE}/kv/r15/A4 - 99.png`, label: 'R15-3' },
            { src: `${PHASE05_BASE}/kv/r15/A4 - 100.png`, label: 'R15-4' }
          ]
        },
        {
          label: 'E-LIQUID SERIES',
          labelKey: 'case.phases.phase-05.screens.kv-marquee-mix.groups.2.label',
          layout: { rows: [{ count: 4, scale: 4.0 }] },  // 4张图，放大4倍
          images: [
            { src: `${PHASE05_BASE}/kv/e-liquid/A4 - 7.png`, label: 'Oil-1' },
            { src: `${PHASE05_BASE}/kv/e-liquid/A4 - 8.png`, label: 'Oil-2' },
            { src: `${PHASE05_BASE}/kv/e-liquid/A4 - 93.png`, label: 'Oil-3' },
            { src: `${PHASE05_BASE}/kv/e-liquid/A4 - 94.png`, label: 'Oil-4' }
          ]
        }
      ]
    },
    
    // Screen 06: 文字过渡条（上下白线边框分隔，文字淡入浮现）
    {
      id: 'scroll-text-intro-cube',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-05.screens.photo-cube.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 08: 实拍 - cube 产品（5×3网格）
    {
      id: 'photo-cube',
      type: 'square-grid',
      categoryLabel: '实拍 / CUBE',
      columns: 5,
      parallaxOffset: -100,  
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      images: [
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02q6_fcd6ca2a-8de7-4571-9989-03dffecb102g 1.png`, label: 'Cube-P1' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02q8_672f6ada-9467-4cb4-8518-d5873af73e5g 1.png`, label: 'Cube-P2' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02q8_28810cc9-0b79-4a5e-9aa5-af73eb4089bg 1.png`, label: 'Cube-P3' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02q8_a11be66c-7ec0-4ddd-be1a-15b9e8b08ccg 1.png`, label: 'Cube-P4' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02q8_ae0b77d3-dffa-4c51-8829-d1fa58db4bag 1.png`, label: 'Cube-P5' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02q8_b78f8fc3-5af7-42d4-83f0-1b26701c699g 1.png`, label: 'Cube-P6' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02r5_d5ce4b06-9c4c-411e-b2ce-cc054bc98dfg 1.png`, label: 'Cube-P7' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02ro_4f31a9e6-c822-4391-9051-d160eb38464g 1.png`, label: 'Cube-P8' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02ro_a4a383c1-7d84-4214-98ef-ebc4725b026g 1.png`, label: 'Cube-P9' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02ro_d8bd7d3c-6181-4a21-a230-709379c6aecg 1.png`, label: 'Cube-P10' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02ro_da743e75-d630-42ac-8782-f5e3d22f378g 1.png`, label: 'Cube-P11' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02rp_6eee99ff-19e9-4caa-9727-f6245b77fb7g 1.png`, label: 'Cube-P12' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02rp_70494222-d9f1-4a78-a7f9-c32070f3f72g 1.png`, label: 'Cube-P13' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02rp_aa03b8b6-7321-40d2-a501-a8a75872d54g 1.png`, label: 'Cube-P14' },
        { src: `${PHASE05_BASE}/photo/cube/img_v3_02rp_ac116a05-208c-4d7f-b8db-eb0e1644bbfg 1.png`, label: 'Cube-P15' }
      ]
    },
    
    // Screen 09: 文字过渡条 - MOTOR
    {
      id: 'scroll-text-intro-motor',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-05.screens.photo-motor.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 10: 实拍 - motor 产品（3×2网格）
    {
      id: 'photo-motor',
      type: 'square-grid',
      categoryLabel: '实拍 / MOTOR',
      columns: 3,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'medium' },
      images: [
        { src: `${PHASE05_BASE}/photo/motor/img_v3_02ro_77b34125-e5a7-49fb-9ffb-7f7083f6c91g 1.png`, label: 'Motor-P1' },
        { src: `${PHASE05_BASE}/photo/motor/img_v3_02ro_4716b1ff-ffc3-4b93-aac4-851ad292550g 1.png`, label: 'Motor-P2' },
        { src: `${PHASE05_BASE}/photo/motor/img_v3_02ro_a9d4f672-a61d-4903-a0f9-84ebdb80f3dg 1.png`, label: 'Motor-P3' },
        { src: `${PHASE05_BASE}/photo/motor/img_v3_02ro_d08101b0-f6d1-4117-8e5d-6b34519da7dg 1.png`, label: 'Motor-P4' },
        { src: `${PHASE05_BASE}/photo/motor/img_v3_02ro_e622acd1-6dc2-400d-b040-4c0a5f1f09dg 1.png`, label: 'Motor-P5' },
        { src: `${PHASE05_BASE}/photo/motor/img_v3_02ro_ffd236b1-4fa1-4812-8e16-00e7906d726g 1.png`, label: 'Motor-P6' }
      ]
    },
    
    // Screen 10: 实拍 - 展架（KIYOMI 风格分组展示：横4 + 竖8）
    {
      id: 'photo-display',
      type: 'grouped-carousel',
      categoryLabel: '实拍 / 展架',
      contentKey: 'case.phases.phase-05.screens.photo-display.content',
      showGroupLabel: false,
      showItemCount: false,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      groups: [
        {
          label: 'DISPLAY - HORIZONTAL',
          labelKey: 'case.phases.phase-05.screens.photo-display.groups.0.label',
          layout: { rows: [{ count: 4, scale: 3.5 }] },  // 4张横图，放大3.5倍
          images: [
            { src: `${PHASE05_BASE}/photo/display-stand/horizontal/img_v3_02pg_4ee36845-3ed4-4742-99b6-139219c18e7g 1.png`, label: 'Display-H1' },
            { src: `${PHASE05_BASE}/photo/display-stand/horizontal/img_v3_02rv_1108cf29-6c1c-4a68-9c65-f267e396f78g 1.png`, label: 'Display-H2' },
            { src: `${PHASE05_BASE}/photo/display-stand/horizontal/img_v3_02s5_4fb3c0b2-72d2-4026-aaed-8f5906f3c55g 1.png`, label: 'Display-H3' },
            { src: `${PHASE05_BASE}/photo/display-stand/horizontal/img_v3_02tc_824d2d60-200c-4dbf-8636-8ef494e16ebg 1.png`, label: 'Display-H4' }
          ]
        },
        {
          label: 'DISPLAY - VERTICAL',
          labelKey: 'case.phases.phase-05.screens.photo-display.groups.1.label',
          layout: { 
            rows: [
              { count: 4, scale: 0.9 },  // 上行4张
              { count: 4, scale: 0.9 }   // 下行4张
            ],
            rowGap: '2px',
            colGap: '2px',
            mainScale: 0.92
          },
          images: [
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02mu_4331f3f7-2aee-4f67-a9b4-b2cd1de2fa9g 1.png`, label: 'Display-V1' },
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02pr_403b4e36-8fe4-45ec-b2bc-a2a9d337142g 1.png`, label: 'Display-V2' },
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02ra_0e9ab48e-6a3d-4a61-b096-f2ee835fa86g 1.png`, label: 'Display-V3' },
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02ra_f545f6a7-7eb5-4557-8e43-bf61616e6b6g 1.png`, label: 'Display-V4' },
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02rb_b3e8dbb6-3cca-4b26-b488-ef8a06406c3g 1.png`, label: 'Display-V5' },
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02rb_d960bb1f-1eaf-4797-b4dc-9869548c03fg 1.png`, label: 'Display-V6' },
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02rv_2b6abf77-ccb6-42c9-96ac-a0ab4d77d1eg 1.png`, label: 'Display-V7' },
            { src: `${PHASE05_BASE}/photo/display-stand/vertical/img_v3_02t9_0809d7b1-823d-4b5e-b537-c8b82eb741cg 1.png`, label: 'Display-V8' }
          ]
        }
      ]
    },
    
    // Screen 11: 实拍 - 店面（KIYOMI 风格分组展示：横9 + 竖3）
    {
      id: 'photo-store',
      type: 'grouped-carousel',
      categoryLabel: '实拍 / 店面',
      contentKey: 'case.phases.phase-05.screens.photo-store.content',
      showGroupLabel: false,
      showItemCount: false,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      rowGap: '11px',  // 自定义行间距：11px (45% of default 24px)
      groups: [
        {
          label: 'STORE - HORIZONTAL',
          labelKey: 'case.phases.phase-05.screens.photo-store.groups.0.label',
          layout: { 
            rows: [
              { count: 5, scale: 3.2 },  // 上行5张，放大3.2倍
              { count: 4, scale: 3.2 }   // 下行4张，放大3.2倍
            ],
            rowGap: '4px',        // 两行间距减小到 4px
            multiRowScale: 0.85   // 图片放大到 85%（默认 70%）
          },
          images: [
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02ok_96fee373-fd9a-4402-98d9-6f0fd6eda1eg 1.png`, label: 'Store-H1' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02ok_a6662106-718c-41b5-aa1e-c8d1a293e68g 1.png`, label: 'Store-H2' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02ok_c176f344-1da1-4be4-9825-9f3b8596cfeg 1.png`, label: 'Store-H3' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02ok_e9aa5c39-d41f-4c6c-b65a-9f74e97e2a6g 1.png`, label: 'Store-H4' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02p1_26bef36f-71d4-488b-975a-8eda613d31bg 1.png`, label: 'Store-H5' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02pp_88151d18-6e69-4bad-8a0f-2accc89711eg 1.png`, label: 'Store-H6' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02pp_d2e064f3-b87a-4cb1-98db-7f52f0187e9g 1.png`, label: 'Store-H7' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02pp_f294c519-962d-470a-b068-991af527261g 1.png`, label: 'Store-H8' },
            { src: `${PHASE05_BASE}/photo/store/horizontal/img_v3_02pr_2653183e-c2b2-4082-b5c4-beb4f002d79g 1.png`, label: 'Store-H9' }
          ]
        },
        {
          label: 'STORE - VERTICAL',
          labelKey: 'case.phases.phase-05.screens.photo-store.groups.1.label',
          layout: { rows: [{ count: 3, scale: 4.5 }] },  // 3张竖图，放大4.5倍
          images: [
            { src: `${PHASE05_BASE}/photo/store/vertical/img_v3_02pa_1a6cc14c-8b9f-4560-9331-874d4f86d55g 1.png`, label: 'Store-V1' },
            { src: `${PHASE05_BASE}/photo/store/vertical/img_v3_02ps_e6c13de7-8bbf-44be-81cc-7ca3948ea06g 1.png`, label: 'Store-V2' },
            { src: `${PHASE05_BASE}/photo/store/vertical/img_v3_02pv_53f650e4-7676-4c4a-9e99-5a47160095dg 1.png`, label: 'Store-V3' }
          ]
        }
      ]
    },
    
    // Screen 10: 实拍 - 包装（3组KV，3列呈现 - 紧凑间距）
    {
      id: 'photo-packaging',
      type: 'natural-parallax-grid',
      categoryLabel: '实拍 / 包装',
      contentKey: 'case.phases.phase-05.screens.photo-packaging.content',
      columns: 3,
      gap: '24px',
      rowGap: '4px',
      paddingTop: 30,
      parallaxIntensity: 0.3,
      compactMode: true,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      groups: [
        {
          label: 'PACKAGING COLLECTION',
          images: [
            { src: `${PHASE05_BASE}/photo/packaging/IMG_20260126_103830_edit_292227773485616 1.png`, label: 'Pkg-1' },
            { src: `${PHASE05_BASE}/photo/packaging/IMG_20260126_104345_edit_292325401480914 1.png`, label: 'Pkg-2' },
            { src: `${PHASE05_BASE}/photo/packaging/IMG_20260126_104453_edit_292348157471535 1.png`, label: 'Pkg-3' },
            { src: `${PHASE05_BASE}/photo/packaging/IMG_20260126_104755_edit_292364704911116 1.png`, label: 'Pkg-4' },
            { src: `${PHASE05_BASE}/photo/packaging/IMG_20260126_112639_edit_293234890828171 1.png`, label: 'Pkg-5' },
            { src: `${PHASE05_BASE}/photo/packaging/img_v3_02sf_b4cca58e-abae-4a8c-b6c3-eb1af093ee7g 1.png`, label: 'Pkg-6' },
            { src: `${PHASE05_BASE}/photo/packaging/img_v3_02t1_7440c7b3-6e0b-4194-9bf8-4e057ca4980g 1.png`, label: 'Pkg-7' },
            { src: `${PHASE05_BASE}/photo/packaging/img_v3_02t1_e68a6bd0-d6bc-4e83-85ca-e136cb50125g 1.png`, label: 'Pkg-8' },
            { src: `${PHASE05_BASE}/photo/packaging/img_v3_02tc_9df44ca7-60f7-4cc8-9c92-11730ecd457g 1.png`, label: 'Pkg-9' }
          ]
        }
      ]
    },
    
    // Screen 12: 文字过渡条 - 展会
    {
      id: 'scroll-text-intro-expo',
      type: 'scroll-text-bar',
      contentKey: 'case.phases.phase-05.screens.photo-expo.content',
      padding: '40px 24px 40px 24px'
    },
    
    // Screen 13: 实拍 - 展会（横向切换展示）
    {
      id: 'photo-expo',
      type: 'popup-sequence',
      categoryLabel: '实拍 / 展会',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE05_BASE}/photo/expo/56cd0386f2a6e96d2f94fc2743dfc9bb 1.png`, label: 'Expo-1' },
        { src: `${PHASE05_BASE}/photo/expo/acc0dc973c3e4d2bd0de6423b74e2820 1.png`, label: 'Expo-2' },
        { src: `${PHASE05_BASE}/photo/expo/img_v3_02li_0fbfdd72-72df-455f-988e-254b9ca515ag 1.png`, label: 'Expo-3' }
      ]
    },
    
    // Screen 12: 效果图（3组KV，3列呈现 - 紧凑间距，限制9图）
    {
      id: 'mockups',
      type: 'natural-parallax-grid',
      categoryLabel: '效果图',
      contentKey: 'case.phases.phase-05.screens.mockups.content',
      columns: 3,
      gap: '24px',
      rowGap: '4px',
      paddingTop: 30,
      parallaxIntensity: 0.3,
      compactMode: true,
      scrollBehavior: { sticky: false, length: 'long', intensity: 'medium' },
      groups: [
        {
          label: 'MOCKUP COLLECTION',
          images: [
            { src: `${PHASE05_BASE}/mockups/4fe086c50cfa001b5fa8e0b117ec394b 1.png`, label: 'Mock-1' },
            { src: `${PHASE05_BASE}/mockups/4fe086c50cfa001b5fa8e0b117ec394b 2.png`, label: 'Mock-2' },
            { src: `${PHASE05_BASE}/mockups/4fe086c50cfa001b5fa8e0b117ec394b 3.png`, label: 'Mock-3' },
            { src: `${PHASE05_BASE}/mockups/4fe086c50cfa001b5fa8e0b117ec394b 4.png`, label: 'Mock-4' },
            { src: `${PHASE05_BASE}/mockups/4088168f25a7f357327953c0baf794f2 1.png`, label: 'Mock-5' },
            { src: `${PHASE05_BASE}/mockups/4088168f25a7f357327953c0baf794f2 2.png`, label: 'Mock-6' },
            { src: `${PHASE05_BASE}/mockups/4088168f25a7f357327953c0baf794f2 4.png`, label: 'Mock-7' },
            { src: `${PHASE05_BASE}/mockups/Group 447.png`, label: 'Mock-8' },
            { src: `${PHASE05_BASE}/mockups/Group 502.png`, label: 'Mock-9' }
          ]
        }
      ]
    },
    
    // Screen 15: Closing - 收束与导航
    {
      id: 'closing',
      type: 'phase-closing',
      categoryLabel: '收尾',
      sticky: true,
      stickyHeight: 200,
      scrollBehavior: { sticky: true, length: 'normal', intensity: 'low' },
      bgImage: `${PHASE05_BASE}/cover/hero.png`
    }
  ]
};

const PHASE06_BASE = '/images/phase-06';

// Phase 06: 文案可视化 (21屏 = 1个intro + 20个产品展示屏)
// 支持产品分类：cube, nicotine-sugar, motor
export const phase06Config = {
  id: 'phase-06',
  number: '06',
  titleEn: 'Copywriting Visualization',
  titleKey: 'case.phases.phase-06.title',
  prev: 'phase-05',
  next: null, // 最后一个 Phase
  totalScreens: 21,
  bgColor: '#0a0a0a', // 统一背景色 - 深黑
  // 产品分类配置
  products: ['cube', 'nicotine-sugar', 'motor'],
  screens: [
    // Screen 01: Intro - 引导屏（所有产品共用）
    {
      id: 'intro',
      type: 'intro',
      categoryLabel: '引言',
      product: null,
      imageHint: 'Copywriting Visualization',
      bgImage: `${MOBILE_COVER_BASE}/Desktop - 6.png`,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    
    // ========== Cube 产品 (01-06) ==========
    // Screen 02: 文件夹 01
    {
      id: 'folder-01',
      type: 'auto-sequence-popup',
      categoryLabel: 'cube / 01',
      product: 'cube',
      contentKey: 'case.phases.phase-06.screens.folder-01.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/1/Frame 1.png`, label: 'Frame 01' },
        { src: `${PHASE06_BASE}/1/Frame 2.png`, label: 'Frame 02' },
        { src: `${PHASE06_BASE}/1/Frame 3.png`, label: 'Frame 03' },
        { src: `${PHASE06_BASE}/1/Frame 4.png`, label: 'Frame 04' },
        { src: `${PHASE06_BASE}/1/Frame 5.png`, label: 'Frame 05' }
      ]
    },
    // Screen 03: 文件夹 02（测试自动弹出）
    {
      id: 'folder-02',
      type: 'auto-sequence-popup',
      categoryLabel: 'cube / 02',
      product: 'cube',
      contentKey: 'case.phases.phase-06.screens.folder-02.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/2/Frame 6.png`, label: 'Frame 06' },
        { src: `${PHASE06_BASE}/2/Frame 7.png`, label: 'Frame 07' },
        { src: `${PHASE06_BASE}/2/Frame 8.png`, label: 'Frame 08' },
        { src: `${PHASE06_BASE}/2/Frame 9.png`, label: 'Frame 09' },
        { src: `${PHASE06_BASE}/2/Frame 10.png`, label: 'Frame 10' }
      ]
    },
    // Screen 04: 文件夹 03
    {
      id: 'folder-03',
      type: 'auto-sequence-popup',
      categoryLabel: 'cube / 03',
      product: 'cube',
      contentKey: 'case.phases.phase-06.screens.folder-03.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/3/Frame 12.png`, label: 'Frame 12' },
        { src: `${PHASE06_BASE}/3/Frame 13.png`, label: 'Frame 13' },
        { src: `${PHASE06_BASE}/3/Frame 14.png`, label: 'Frame 14' }
      ]
    },
    // Screen 05: 文件夹 04
    {
      id: 'folder-04',
      type: 'auto-sequence-popup',
      categoryLabel: 'cube / 04',
      product: 'cube',
      contentKey: 'case.phases.phase-06.screens.folder-04.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/4/Frame 15.png`, label: 'Frame 15' },
        { src: `${PHASE06_BASE}/4/Frame 16.png`, label: 'Frame 16' },
        { src: `${PHASE06_BASE}/4/Frame 17.png`, label: 'Frame 17' },
        { src: `${PHASE06_BASE}/4/Frame 18.png`, label: 'Frame 18' },
        { src: `${PHASE06_BASE}/4/Frame 19.png`, label: 'Frame 19' }
      ]
    },
    // Screen 06: 文件夹 05
    {
      id: 'folder-05',
      type: 'auto-sequence-popup',
      categoryLabel: 'cube / 05',
      product: 'cube',
      contentKey: 'case.phases.phase-06.screens.folder-05.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/5/Frame 20.png`, label: 'Frame 20' },
        { src: `${PHASE06_BASE}/5/Frame 21.png`, label: 'Frame 21' },
        { src: `${PHASE06_BASE}/5/Frame 22.png`, label: 'Frame 22' },
        { src: `${PHASE06_BASE}/5/Frame 23.png`, label: 'Frame 23' }
      ]
    },
    // Screen 07: 文件夹 06
    {
      id: 'folder-06',
      type: 'auto-sequence-popup',
      categoryLabel: 'cube / 06',
      product: 'cube',
      contentKey: 'case.phases.phase-06.screens.folder-06.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/6/Frame 24.png`, label: 'Frame 24' },
        { src: `${PHASE06_BASE}/6/Frame 25.png`, label: 'Frame 25' },
        { src: `${PHASE06_BASE}/6/Frame 26.png`, label: 'Frame 26' }
      ]
    },
    
    // ========== 尼古丁糖产品 (07-12) ==========
    // Screen 08: 文件夹 07
    {
      id: 'folder-07',
      type: 'auto-sequence-popup',
      categoryLabel: 'oi / 01',
      product: 'nicotine-sugar',
      contentKey: 'case.phases.phase-06.screens.folder-07.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/7/Frame 27.png`, label: 'Frame 27' },
        { src: `${PHASE06_BASE}/7/Frame 28.png`, label: 'Frame 28' },
        { src: `${PHASE06_BASE}/7/Frame 29.png`, label: 'Frame 29' },
        { src: `${PHASE06_BASE}/7/Frame 30.png`, label: 'Frame 30' },
        { src: `${PHASE06_BASE}/7/Frame 31.png`, label: 'Frame 31' }
      ]
    },
    // Screen 09: 文件夹 08
    {
      id: 'folder-08',
      type: 'auto-sequence-popup',
      categoryLabel: 'oi / 02',
      product: 'nicotine-sugar',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/8/Frame 32.png`, label: 'Frame 32' },
        { src: `${PHASE06_BASE}/8/Frame 33.png`, label: 'Frame 33' },
        { src: `${PHASE06_BASE}/8/Frame 34.png`, label: 'Frame 34' }
      ]
    },
    // Screen 10: 文件夹 09
    {
      id: 'folder-09',
      type: 'auto-sequence-popup',
      categoryLabel: 'oi / 03',
      product: 'nicotine-sugar',
      contentKey: 'case.phases.phase-06.screens.folder-09.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/9/Frame 35.png`, label: 'Frame 35' },
        { src: `${PHASE06_BASE}/9/Frame 36.png`, label: 'Frame 36' },
        { src: `${PHASE06_BASE}/9/Frame 37.png`, label: 'Frame 37' },
        { src: `${PHASE06_BASE}/9/Frame 38.png`, label: 'Frame 38' },
        { src: `${PHASE06_BASE}/9/Frame 39.png`, label: 'Frame 39' }
      ]
    },
    // Screen 11: 文件夹 10
    {
      id: 'folder-10',
      type: 'auto-sequence-popup',
      categoryLabel: 'oi / 04',
      product: 'nicotine-sugar',
      contentKey: 'case.phases.phase-06.screens.folder-10.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/10/Frame 40.png`, label: 'Frame 40' },
        { src: `${PHASE06_BASE}/10/Frame 41.png`, label: 'Frame 41' },
        { src: `${PHASE06_BASE}/10/Frame 42.png`, label: 'Frame 42' },
        { src: `${PHASE06_BASE}/10/Frame 43.png`, label: 'Frame 43' },
        { src: `${PHASE06_BASE}/10/Frame 44.png`, label: 'Frame 44' },
        { src: `${PHASE06_BASE}/10/Frame 45.png`, label: 'Frame 45' }
      ]
    },
    // Screen 12: 文件夹 11
    {
      id: 'folder-11',
      type: 'auto-sequence-popup',
      categoryLabel: 'oi / 05',
      product: 'nicotine-sugar',
      contentKey: 'case.phases.phase-06.screens.folder-11.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/11/Frame 46.png`, label: 'Frame 46' },
        { src: `${PHASE06_BASE}/11/Frame 47.png`, label: 'Frame 47' },
        { src: `${PHASE06_BASE}/11/Frame 48.png`, label: 'Frame 48' },
        { src: `${PHASE06_BASE}/11/Frame 49.png`, label: 'Frame 49' },
        { src: `${PHASE06_BASE}/11/Frame 50.png`, label: 'Frame 50' },
        { src: `${PHASE06_BASE}/11/Frame 51.png`, label: 'Frame 51' },
        { src: `${PHASE06_BASE}/11/Frame 52.png`, label: 'Frame 52' },
        { src: `${PHASE06_BASE}/11/Frame 53.png`, label: 'Frame 53' },
        { src: `${PHASE06_BASE}/11/Frame 54.png`, label: 'Frame 54' }
      ]
    },
    // Screen 13: 文件夹 12
    {
      id: 'folder-12',
      type: 'auto-sequence-popup',
      categoryLabel: 'oi / 06',
      product: 'nicotine-sugar',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/12/Frame 55.png`, label: 'Frame 55' },
        { src: `${PHASE06_BASE}/12/Frame 56.png`, label: 'Frame 56' },
        { src: `${PHASE06_BASE}/12/Frame 57.png`, label: 'Frame 57' },
        { src: `${PHASE06_BASE}/12/Frame 58.png`, label: 'Frame 58' }
      ]
    },
    
    // ========== Motor 产品 (13-20) ==========
    // Screen 14: 文件夹 13
    {
      id: 'folder-13',
      type: 'auto-sequence-popup',
      categoryLabel: 'motor / 01',
      product: 'motor',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/13/Frame 59.png`, label: 'Frame 59' },
        { src: `${PHASE06_BASE}/13/Frame 60.png`, label: 'Frame 60' },
        { src: `${PHASE06_BASE}/13/Frame 61.png`, label: 'Frame 61' },
        { src: `${PHASE06_BASE}/13/Frame 62.png`, label: 'Frame 62' },
        { src: `${PHASE06_BASE}/13/Frame 63.png`, label: 'Frame 63' }
      ]
    },
    // Screen 15: 文件夹 14
    {
      id: 'folder-14',
      type: 'auto-sequence-popup',
      categoryLabel: 'motor / 02',
      product: 'motor',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/14/Frame 64.png`, label: 'Frame 64' },
        { src: `${PHASE06_BASE}/14/Frame 65.png`, label: 'Frame 65' },
        { src: `${PHASE06_BASE}/14/Frame 66.png`, label: 'Frame 66' },
        { src: `${PHASE06_BASE}/14/Frame 67.png`, label: 'Frame 67' },
        { src: `${PHASE06_BASE}/14/Frame 68.png`, label: 'Frame 68' }
      ]
    },
    // Screen 16: 文件夹 15
    {
      id: 'folder-15',
      type: 'auto-sequence-popup',
      categoryLabel: 'Motor / 03',
      product: 'motor',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/15/Frame 69.png`, label: 'Frame 69' },
        { src: `${PHASE06_BASE}/15/Frame 70.png`, label: 'Frame 70' },
        { src: `${PHASE06_BASE}/15/Frame 71.png`, label: 'Frame 71' }
      ]
    },
    // Screen 17: 文件夹 16
    {
      id: 'folder-16',
      type: 'auto-sequence-popup',
      categoryLabel: 'Motor / 04',
      product: 'motor',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/16/Frame 72.png`, label: 'Frame 72' },
        { src: `${PHASE06_BASE}/16/Frame 73.png`, label: 'Frame 73' },
        { src: `${PHASE06_BASE}/16/Frame 74.png`, label: 'Frame 74' }
      ]
    },
    // Screen 18: 文件夹 17
    {
      id: 'folder-17',
      type: 'auto-sequence-popup',
      categoryLabel: 'motor / 05',
      product: 'motor',
      contentKey: 'case.phases.phase-06.screens.folder-17.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/17/Frame 75.png`, label: 'Frame 75' },
        { src: `${PHASE06_BASE}/17/Frame 76.png`, label: 'Frame 76' },
        { src: `${PHASE06_BASE}/17/Frame 77.png`, label: 'Frame 77' },
        { src: `${PHASE06_BASE}/17/Frame 78.png`, label: 'Frame 78' }
      ]
    },
    // Screen 19: 文件夹 18
    {
      id: 'folder-18',
      type: 'auto-sequence-popup',
      categoryLabel: 'motor / 06',
      product: 'motor',
      contentKey: 'case.phases.phase-06.screens.folder-18.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/18/Frame 79.png`, label: 'Frame 79' },
        { src: `${PHASE06_BASE}/18/Frame 80.png`, label: 'Frame 80' },
        { src: `${PHASE06_BASE}/18/Frame 81.png`, label: 'Frame 81' },
        { src: `${PHASE06_BASE}/18/Frame 82.png`, label: 'Frame 82' },
        { src: `${PHASE06_BASE}/18/Frame 83.png`, label: 'Frame 83' }
      ]
    },
    // Screen 20: 文件夹 19
    {
      id: 'folder-19',
      type: 'auto-sequence-popup',
      categoryLabel: 'motor / 07',
      product: 'motor',
      contentKey: 'case.phases.phase-06.screens.folder-19.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/19/Frame 84.png`, label: 'Frame 84' },
        { src: `${PHASE06_BASE}/19/Frame 85.png`, label: 'Frame 85' },
        { src: `${PHASE06_BASE}/19/Frame 86.png`, label: 'Frame 86' },
        { src: `${PHASE06_BASE}/19/Frame 87.png`, label: 'Frame 87' }
      ]
    },
    // Screen 21: 文件夹 20
    {
      id: 'folder-20',
      type: 'auto-sequence-popup',
      categoryLabel: 'motor / 08',
      product: 'motor',
      contentKey: 'case.phases.phase-06.screens.folder-20.content',
      interval: 300,
      duration: 0.6,
      images: [
        { src: `${PHASE06_BASE}/20/Frame 88.png`, label: 'Frame 88' },
        { src: `${PHASE06_BASE}/20/Frame 89.png`, label: 'Frame 89' }
      ]
    }
  ]
};

// 汇总配置
export const phasesConfig = {
  'phase-01': phase01Config,
  'phase-02': phase02Config,
  'phase-03': phase03Config,
  'phase-04': phase04Config,
  'phase-05': phase05Config,
  'phase-06': phase06Config
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