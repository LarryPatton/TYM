import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';

/**
 * 自定义语言管理 Hook
 * 提供语言状态、切换方法和相关工具函数
 * 
 * @returns {Object} 语言管理对象
 * @property {string} currentLanguage - 当前语言代码
 * @property {Object} currentLanguageInfo - 当前语言的完整信息
 * @property {Array} languages - 支持的语言列表
 * @property {Function} changeLanguage - 切换语言函数
 * @property {Function} toggleLanguage - 在中英文之间切换
 * @property {boolean} isZh - 当前是否为中文
 * @property {boolean} isEn - 当前是否为英文
 * @property {Function} t - 翻译函数
 */
export function useLanguage() {
  const { t, i18n } = useTranslation();
  
  // 当前语言代码
  const currentLanguage = i18n.language;
  
  // 当前语言的完整信息
  const currentLanguageInfo = useMemo(() => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) 
      || supportedLanguages[0];
  }, [currentLanguage]);
  
  // 切换到指定语言
  const changeLanguage = useCallback((languageCode) => {
    if (supportedLanguages.some(lang => lang.code === languageCode)) {
      i18n.changeLanguage(languageCode);
    } else {
      console.warn(`Language "${languageCode}" is not supported`);
    }
  }, [i18n]);
  
  // 在中英文之间切换
  const toggleLanguage = useCallback(() => {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  }, [currentLanguage, i18n]);
  
  // 语言判断快捷方式
  const isZh = currentLanguage === 'zh' || currentLanguage?.startsWith('zh');
  const isEn = currentLanguage === 'en' || currentLanguage?.startsWith('en');
  
  // 获取指定语言的翻译（用于预览其他语言的文本）
  const getTranslation = useCallback((key, language) => {
    return i18n.getFixedT(language)(key);
  }, [i18n]);
  
  return {
    // 语言状态
    currentLanguage,
    currentLanguageInfo,
    languages: supportedLanguages,
    
    // 语言判断
    isZh,
    isEn,
    
    // 语言操作
    changeLanguage,
    toggleLanguage,
    
    // 翻译函数
    t,
    getTranslation,
    
    // 原始 i18n 实例（高级用法）
    i18n
  };
}

export default useLanguage;
