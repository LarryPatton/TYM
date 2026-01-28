import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import zhTranslation from '../locales/zh/translation.json';
import enTranslation from '../locales/en/translation.json';

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh', name: '中文', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' }
];

// 翻译资源
const resources = {
  zh: {
    translation: zhTranslation
  },
  en: {
    translation: enTranslation
  }
};

// 语言检测配置选项
const detectionOptions = {
  // 检测顺序：localStorage -> navigator -> htmlTag
  order: ['localStorage', 'navigator', 'htmlTag'],
  // 缓存用户语言偏好的 key
  lookupLocalStorage: 'i18nextLng',
  // 缓存到 localStorage
  caches: ['localStorage'],
  // 排除缓存的语言
  excludeCacheFor: ['cimode']
};

// 初始化 i18n
i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 绑定 react-i18next
  .use(initReactI18next)
  // 初始化配置
  .init({
    resources,
    // 回退语言（当检测到的语言没有对应翻译时）
    fallbackLng: 'zh',
    // 默认语言
    lng: undefined, // 让 LanguageDetector 来检测
    // 支持的语言列表
    supportedLngs: ['zh', 'en'],
    // 语言检测配置
    detection: detectionOptions,
    // 插值配置
    interpolation: {
      // React 已经安全处理了 XSS，所以不需要转义
      escapeValue: false
    },
    // 调试模式（生产环境应设为 false）
    debug: import.meta.env.DEV,
    // React 配置
    react: {
      // 使用 Suspense 等待翻译加载
      useSuspense: true,
      // 绑定 i18n 事件到 React
      bindI18n: 'languageChanged loaded',
      // 绑定 i18n store 事件
      bindI18nStore: 'added removed',
      // 转换空字符串
      transEmptyNodeValue: '',
      // 嵌套转换
      transSupportBasicHtmlNodes: true,
      // 允许的 HTML 标签
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span']
    }
  });

// 语言变化时更新 HTML lang 属性
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
  // 更新文档方向（如需支持 RTL 语言）
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});

// 初始化时设置 HTML lang 属性
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('lang', i18n.language || 'zh');
}

export default i18n;

// 导出常用工具函数
export const getCurrentLanguage = () => i18n.language;
export const changeLanguage = (lng) => i18n.changeLanguage(lng);
export const t = (key, options) => i18n.t(key, options);