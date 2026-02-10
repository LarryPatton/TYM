/**
 * About 页面常量配置
 * 包含颜色、动画变体、表单端点等配置
 */

// 导航栏高度
export const NAV_HEIGHT = 65;

// 表单提交端点
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgbqjeg';

/**
 * 获取主题颜色配置
 * @param {boolean} isDark - 是否为深色主题
 * @returns {Object} 颜色配置对象
 */
export const getColors = (isDark) => ({
  bg: isDark ? '#0a0a0a' : '#fafafa',
  bgAlt: isDark ? '#111' : 'rgba(255,255,255,0.85)',
  text: isDark ? '#fff' : '#111',
  textMuted: isDark ? '#aaa' : '#555',      // 深色模式提亮: #888 → #aaa
  textLight: isDark ? '#888' : '#666',      // 深色模式提亮: #555 → #888
  border: isDark ? '#333' : '#bbb',
  accent: isDark ? '#fff' : '#111',
  cardBg: isDark ? '#1a1a1a' : 'rgba(255,255,255,0.95)',
  inputBg: isDark ? '#1a1a1a' : '#fff',
  inputBorder: isDark ? '#333' : '#aaa',
});

/**
 * 内容区动画变体
 */
export const contentVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -40, 
    transition: { duration: 0.4 } 
  }
};

/**
 * 获取数据配置（能力、工作经历、教育背景）
 * @param {Function} t - i18n 翻译函数
 * @returns {Object} 数据配置对象
 */
export const getAboutData = (t) => ({
  // Section 配置
  sections: [
    { id: 'intro', name: t('about.sectionIntro') },
    { id: 'expertise-journey', name: `${t('about.sectionExpertise')} & ${t('about.sectionJourney')}` },
    { id: 'contact', name: t('about.sectionContact') }
  ],
  
  // 移动端屏幕配置
  mobileScreens: [
    { id: 'intro', name: t('about.sectionIntro') },
    { id: 'journey', name: t('about.sectionJourney') },
    { id: 'skills', name: t('about.skillsOverview.title') },
    { id: 'contact', name: t('about.sectionContact') }
  ],

  // 能力数据
  capabilities: [
    { title: t('about.expertise.strategy.title'), items: t('about.expertise.strategy.items', { returnObjects: true }) },
    { title: t('about.expertise.design.title'), items: t('about.expertise.design.items', { returnObjects: true }) },
    { title: t('about.expertise.development.title'), items: t('about.expertise.development.items', { returnObjects: true }) }
  ],

  // 工作经历（保留原结构，供其他组件使用）
  workExperience: [
    { period: t('about.work.item1.period'), role: t('about.work.item1.role'), company: t('about.work.item1.company') },
    { period: t('about.work.item2.period'), role: t('about.work.item2.role'), company: t('about.work.item2.company') },
    { period: t('about.work.item3.period'), role: t('about.work.item3.role'), company: t('about.work.item3.company') },
  ],

  // 教育背景（保留原结构，供其他组件使用）
  education: [
    { period: t('about.education.item1.period'), degree: t('about.education.item1.degree'), school: t('about.education.item1.school') },
    { period: t('about.education.item2.period'), degree: t('about.education.item2.degree'), school: t('about.education.item2.school') },
  ],

  // 合并的职业历程（按时间倒序排列）
  // 类型：work(工作) | education(教育)
  // 使用起止年份格式，如 "2024 – 至今"
  journey: [
    { 
      type: 'work', 
      period: t('about.work.item1.period'), 
      title: t('about.work.item1.role'), 
      subtitle: t('about.work.item1.company'),
      sortKey: 2024.1 // 用于排序
    },
    { 
      type: 'work', 
      period: t('about.work.item2.period'), 
      title: t('about.work.item2.role'), 
      subtitle: t('about.work.item2.company'),
      sortKey: 2023.2
    },
    { 
      type: 'education', 
      period: t('about.education.item1.period'), 
      title: t('about.education.item1.degree'), 
      subtitle: t('about.education.item1.school'),
      sortKey: 2023.1
    },
    { 
      type: 'work', 
      period: t('about.work.item3.period'), 
      title: t('about.work.item3.role'), 
      subtitle: t('about.work.item3.company'),
      sortKey: 2022.2
    },
    { 
      type: 'education', 
      period: t('about.education.item2.period'), 
      title: t('about.education.item2.degree'), 
      subtitle: t('about.education.item2.school'),
      sortKey: 2018.1
    },
  ].sort((a, b) => b.sortKey - a.sortKey), // 按时间倒序

  // 类型标签
  typeLabels: {
    work: t('about.typeLabel.work'),
    education: t('about.typeLabel.education')
  },

  // 类型颜色配置（根据主题调整）
  // 深色模式使用黑白色调（白色标签）
  // 浅色模式使用彩色
  getTypeColors: (isDark) => ({
    work: isDark ? '#ffffff' : '#4a7ab0',      // 深色模式白色，浅色模式蓝色
    education: isDark ? '#ffffff' : '#3d9a6a', // 深色模式白色，浅色模式绿色
  }),

  // 默认类型颜色（保持向后兼容）
  typeColors: {
    work: '#4a7ab0',     // 蓝色
    education: '#3d9a6a' // 绿色
  },

  // 能力模块数据
  skillsOverview: {
    title: t('about.skillsOverview.title'),
    intro: t('about.skillsOverview.intro'),
    modules: [
      {
        key: 'brandVisual',
        title: t('about.skillsOverview.modules.brandVisual.title'),
        desc: t('about.skillsOverview.modules.brandVisual.desc'),
        deliverables: t('about.skillsOverview.modules.brandVisual.deliverables'),
      },
      {
        key: 'cmfPackaging',
        title: t('about.skillsOverview.modules.cmfPackaging.title'),
        desc: t('about.skillsOverview.modules.cmfPackaging.desc'),
        deliverables: t('about.skillsOverview.modules.cmfPackaging.deliverables'),
      },
      {
        key: 'ecommerce',
        title: t('about.skillsOverview.modules.ecommerce.title'),
        desc: t('about.skillsOverview.modules.ecommerce.desc'),
        deliverables: t('about.skillsOverview.modules.ecommerce.deliverables'),
      },
      {
        key: 'kvPoster',
        title: t('about.skillsOverview.modules.kvPoster.title'),
        desc: t('about.skillsOverview.modules.kvPoster.desc'),
        deliverables: t('about.skillsOverview.modules.kvPoster.deliverables'),
      },
      {
        key: 'localization',
        title: t('about.skillsOverview.modules.localization.title'),
        desc: t('about.skillsOverview.modules.localization.desc'),
        deliverables: t('about.skillsOverview.modules.localization.deliverables'),
      },
    ],
    proof: {
      label: t('about.skillsOverview.proof.label'),
      items: t('about.skillsOverview.proof.items'),
    },
    tools: {
      label: t('about.skillsOverview.tools.label'),
      professional: {
        label: t('about.skillsOverview.tools.professional.label'),
        items: t('about.skillsOverview.tools.professional.items', { returnObjects: true }),
      },
      efficiency: {
        label: t('about.skillsOverview.tools.efficiency.label'),
        items: t('about.skillsOverview.tools.efficiency.items', { returnObjects: true }),
      },
    },
    deliverableLabel: t('about.skillsOverview.deliverableLabel'),
  },
});
