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

// Phase 02 素材基础路径
const PHASE02_BASE = '/images/Phase 02 — Product A · From Concept to Launch';

// Phase 02: Product A · From Concept to Launch (8屏)
export const phase02Config = {
  id: 'phase-02',
  number: '02',
  titleEn: 'Product A · From Concept to Launch',
  titleKey: 'case.phases.phase-02.title',
  prev: 'phase-01',
  next: 'phase-03',
  totalScreens: 8,
  screens: [
    // Screen 01: Intro - 建立语境
    {
      id: 'intro',
      type: 'intro',
      imageHint: 'Concept to Launch',
      bgImage: `${PHASE02_BASE}/01/Group 670.png`,
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'low' }
    },
    // Screen 02: Boundaries - 提出张力
    {
      id: 'boundaries',
      type: 'boundaries', // 新组件类型
      images: [
        { src: `${PHASE02_BASE}/02/Group 664.png`, label: '资源边界' },
        { src: `${PHASE02_BASE}/02/Group 665.png`, label: '市场边界' },
        { src: `${PHASE02_BASE}/02/Group 666.png`, label: '目标边界' }
      ],
      scrollBehavior: { sticky: false, length: 'longer', intensity: 'low' }
    },
    // Screen 03: CMF - 制造偏差 (Sticky)
    {
      id: 'cmf',
      type: 'sticky-scroll',
      scrollBehavior: { sticky: true, length: 'medium-long', intensity: 'medium' },
      images: [
        // Group 系列 - 主要展示
        { src: `${PHASE02_BASE}/03/Group 362.png`, type: 'wide', label: 'Color Exploration' },
        { src: `${PHASE02_BASE}/03/Group 363.png`, type: 'wide', label: 'Material Logic' },
        { src: `${PHASE02_BASE}/03/Group 364.png`, type: 'wide', label: 'Finish Texture' },
        { src: `${PHASE02_BASE}/03/Group 365.png`, type: 'wide', label: 'Light Interaction' },
        { src: `${PHASE02_BASE}/03/Group 366.png`, type: 'wide', label: 'Surface Treatment' },
        { src: `${PHASE02_BASE}/03/Group 367.png`, type: 'wide', label: 'Color Gradient' },
        { src: `${PHASE02_BASE}/03/Group 368.png`, type: 'wide', label: 'Texture Detail' },
        { src: `${PHASE02_BASE}/03/Group 369.png`, type: 'wide', label: 'Material Sample' },
        { src: `${PHASE02_BASE}/03/Group 370.png`, type: 'wide', label: 'Finish Comparison' },
        { src: `${PHASE02_BASE}/03/Group 371.png`, type: 'wide', label: 'Final Selection' },
        // 纹理细节
        { src: `${PHASE02_BASE}/03/1ff9c36d43e2aa290dc6b82f83702922 1.png`, type: 'square', label: 'Texture A' },
        { src: `${PHASE02_BASE}/03/883d02f3e57829b58a6e58487c64264b 1.png`, type: 'square', label: 'Texture B' },
        { src: `${PHASE02_BASE}/03/b33233ec45553682aa3146562850098f 1.png`, type: 'square', label: 'Texture C' },
        { src: `${PHASE02_BASE}/03/f32de9a079e26ec7f77dea82e078a312 1.png`, type: 'square', label: 'Texture D' }
      ],
      // 颜色序列 - 可用于动画
      colorSequence: [
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 1.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 2.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 3.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 4.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 5.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 6.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 7.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 8.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 9.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 10.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 11.png`,
        `${PHASE02_BASE}/03/11b6c338c4d938bf67cfe7e44425c1de 12.png`
      ]
    },
    // Screen 04: Manufacturing - 认知反转 (强制 Sticky)
    {
      id: 'manufacturing',
      type: 'sticky-scroll',
      scrollBehavior: { sticky: true, length: 'long', intensity: 'high' },
      images: [
        { src: `${PHASE02_BASE}/04/Group 671.png`, type: 'wide', label: 'Design Validation' },
        { src: `${PHASE02_BASE}/04/Group 672.png`, type: 'wide', label: 'Mold Flow Analysis' },
        { src: `${PHASE02_BASE}/04/Group 673.png`, type: 'wide', label: 'Assembly Testing' },
        { src: `${PHASE02_BASE}/04/Group 674.png`, type: 'wide', label: 'Tolerance Check' }
      ]
    },
    // Screen 05: Priority - 重建理解
    {
      id: 'priority',
      type: 'priority-grid', // 新组件类型
      scrollBehavior: { sticky: false, length: 'medium', intensity: 'medium' },
      images: [
        { src: `${PHASE02_BASE}/05/CUBE.png`, label: 'Base' },
        { src: `${PHASE02_BASE}/05/CUBE-2.png`, label: 'Variant 2' },
        { src: `${PHASE02_BASE}/05/CUBE-3.png`, label: 'Variant 3' },
        { src: `${PHASE02_BASE}/05/CUBE-4.png`, label: 'Variant 4' },
        { src: `${PHASE02_BASE}/05/CUBE-5.png`, label: 'Variant 5' },
        { src: `${PHASE02_BASE}/05/CUBE-6.png`, label: 'Variant 6' },
        { src: `${PHASE02_BASE}/05/CUBE-7.png`, label: 'Variant 7' },
        { src: `${PHASE02_BASE}/05/CUBE-07.png`, label: 'Variant 07' },
        { src: `${PHASE02_BASE}/05/CUBE-8.png`, label: 'Variant 8' },
        { src: `${PHASE02_BASE}/05/CUBE-08.png`, label: 'Variant 08' },
        { src: `${PHASE02_BASE}/05/CUBE-9.png`, label: 'Variant 9' },
        { src: `${PHASE02_BASE}/05/CUBE-09.png`, label: 'Variant 09' },
        { src: `${PHASE02_BASE}/05/CUBE-10.png`, label: 'Variant 10' },
        { src: `${PHASE02_BASE}/05/CUBE-010.png`, label: 'Variant 010' }
      ],
      bgAlt: true
    },
    // Screen 06: Packaging - 系统扩展
    {
      id: 'packaging',
      type: 'packaging-gallery', // 新组件类型
      scrollBehavior: { sticky: false, length: 'normal-long', intensity: 'low' },
      images: [
        { src: `${PHASE02_BASE}/06/Group 675.png`, label: 'Package Design 1' },
        { src: `${PHASE02_BASE}/06/Group 676.png`, label: 'Package Design 2' },
        { src: `${PHASE02_BASE}/06/Group 677.png`, label: 'Package Design 3' },
        { src: `${PHASE02_BASE}/06/Group 678.png`, label: 'Package Design 4' },
        { src: `${PHASE02_BASE}/06/Group 679.png`, label: 'Package Design 5' },
        { src: `${PHASE02_BASE}/06/Group 680.png`, label: 'Package Design 6' },
        { src: `${PHASE02_BASE}/06/Group 681.png`, label: 'Package Design 7' },
        { src: `${PHASE02_BASE}/06/Group 682.png`, label: 'Package Design 8' },
        { src: `${PHASE02_BASE}/06/Group 683.png`, label: 'Package Design 9' },
        { src: `${PHASE02_BASE}/06/Group 684.png`, label: 'Package Design 10' }
      ]
    },
    // Screen 07: Consistency - 方法论内化
    {
      id: 'consistency',
      type: 'consistency-mosaic', // 新组件类型
      scrollBehavior: { sticky: false, length: 'short', intensity: 'low' },
      images: [
        { src: `${PHASE02_BASE}/07/image 438.png`, label: 'Application 1' },
        { src: `${PHASE02_BASE}/07/image 439.png`, label: 'Application 2' },
        { src: `${PHASE02_BASE}/07/image 440.png`, label: 'Application 3' },
        { src: `${PHASE02_BASE}/07/image 441.png`, label: 'Application 4' },
        { src: `${PHASE02_BASE}/07/image 442.png`, label: 'Application 5' },
        { src: `${PHASE02_BASE}/07/8a0eed244fce156891537ba43bc925c3 1.png`, label: 'Detail A' },
        { src: `${PHASE02_BASE}/07/197e2c4a26993b96f408fd662e3edd34 1.png`, label: 'Detail B' },
        { src: `${PHASE02_BASE}/07/a154da4cef07fdccb067466df02d5914 1.png`, label: 'Detail C' },
        { src: `${PHASE02_BASE}/07/fdbf13941b94a3afcf2b9f22f15356ed 1.png`, label: 'Detail D' }
      ],
      bgAlt: true
    },
    // Screen 08: Closing - 收束与行动意图
    {
      id: 'closing',
      type: 'phase-closing',
      scrollBehavior: { sticky: false, length: 'normal', intensity: 'none' },
      images: [
        { src: `${PHASE02_BASE}/08/Group 685.png`, label: 'Final Overview' },
        { src: `${PHASE02_BASE}/08/image 443.png`, label: 'Product Shot' }
      ],
      bgImage: `${PHASE02_BASE}/08/Group 685.png`
    }
  ]
};

// Phase 03: Product B · Consistency with Controlled Variation (7屏)
export const phase03Config = {
  id: 'phase-03',
  number: '03',
  titleEn: 'Product B · Consistency with Variation',
  titleKey: 'case.phases.phase-03.title',
  prev: 'phase-02',
  next: 'phase-04',
  totalScreens: 7,
  screens: [
    {
      id: 'intro',
      type: 'intro',
      imageHint: 'Product B 整体形象 (Hero Shot) / 更冷静克制'
    },
    {
      id: 'comparison',
      type: 'comparison',
      leftHint: 'Product A / 同视角同比例',
      rightHint: 'Product B / 同视角同比例',
      leftLabel: 'Product A',
      rightLabel: 'Product B',
      bgAlt: true
    },
    {
      id: 'consistency',
      type: 'content',
      imageHint: '品牌核心元素叠加: Logo位置 / 主色 / 结构语言',
      reverse: false
    },
    {
      id: 'variation',
      type: 'comparison',
      leftHint: 'Product A CMF',
      rightHint: 'Product B CMF (明度/饱和度/材料差异)',
      leftLabel: 'A 的 CMF',
      rightLabel: 'B 的差异',
      bgAlt: true
    },
    {
      id: 'efficiency',
      type: 'content',
      imageHint: '设计流程对比: Phase 02 vs Phase 03 / 收敛路径',
      reverse: true
    },
    {
      id: 'sequence',
      type: 'comparison',
      leftHint: 'Product A',
      rightHint: 'Product B',
      leftLabel: '',
      rightLabel: '',
      bgAlt: true
    },
    {
      id: 'summary',
      type: 'summary',
      imageHint: '两款产品最终组合 / 产品序列 + 营销暗示'
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