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
  totalScreens: 7,
  screens: [
    {
      id: 'intro',
      type: 'intro',
      imageHint: '品牌标志单独展示 / 标志 + 视觉关键词',
      // 使用 encodeURI 处理路径中的特殊字符
      bgImage: '/images/Phase%2001%20%E2%80%94%20Brand%20Identity%200%E2%80%931/01/01.png'
    },
    {
      id: 'brand-identity',
      type: 'brand-identity'
    },
    {
      id: 'logo',
      type: 'content',
      imageHint: 'Logo 结构示意 / 网格 / 比例 / 核心构成',
      reverse: false
    },
    {
      id: 'color',
      type: 'content',
      imageHint: '主色 + 辅助色逻辑示意 / 色彩比例规则',
      reverse: true,
      bgAlt: true
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
        { hint: '最小应用场景 1: 包装雏形', label: '包装验证' },
        { hint: '最小应用场景 2: 页面/物料', label: '物料验证' }
      ],
      bgAlt: true
    },
    {
      id: 'summary',
      type: 'summary',
      imageHint: '系统元素总览 / 产品方向暗示'
    }
  ]
};

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
    {
      id: 'intro',
      type: 'intro',
      imageHint: '产品 A 整体形象 (Hero Shot) / 产品 + 包装'
    },
    {
      id: 'positioning',
      type: 'content',
      imageHint: '品牌核心关键词 vs 产品 A 功能/气质关键词',
      reverse: false
    },
    {
      id: 'cmf-explore',
      type: 'gallery',
      columns: 2,
      images: [
        { hint: 'CMF 探索: 色彩范围对比', label: '色彩探索' },
        { hint: 'CMF 探索: 材料/表面处理', label: '材质探索' }
      ],
      bgAlt: true
    },
    {
      id: 'cmf-final',
      type: 'content',
      imageHint: '最终 CMF 方案 / 色彩材质质感 / 局部特写',
      reverse: true
    },
    {
      id: 'packaging',
      type: 'content',
      imageHint: '包装与产品整体关系 / 包装结构 + 视觉组合',
      reverse: false,
      bgAlt: true
    },
    {
      id: 'consistency',
      type: 'comparison',
      leftHint: '产品 A 实物展示',
      rightHint: '品牌基础元素 (Logo/色彩/字体)',
      leftLabel: 'Product A',
      rightLabel: 'Brand Elements'
    },
    {
      id: 'realworld',
      type: 'gallery',
      columns: 2,
      images: [
        { hint: '实拍场景 1: 真实光线环境', label: '场景 A' },
        { hint: '实拍场景 2: 使用状态', label: '场景 B' }
      ],
      bgAlt: true
    },
    {
      id: 'summary',
      type: 'summary',
      imageHint: '产品 A 最终形态 / 下一产品方向暗示'
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
