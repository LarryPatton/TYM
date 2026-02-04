import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LayoutDebugPanel - 布局调试浮窗
 * 
 * 功能：
 * 1. 实时调整当前屏幕的布局参数
 * 2. 预览效果
 * 3. 一键复制配置代码
 * 
 * 仅在开发环境启用
 */

// 参数类型定义
const PARAM_TYPES = {
  // 布局参数
  columns: { type: 'range', min: 1, max: 8, step: 1, label: '列数' },
  gap: { type: 'text', label: '间距 (如: 24px, 1rem)' },
  rowGap: { type: 'text', label: '行间距' },
  columnGap: { type: 'text', label: '列间距' },
  
  // 尺寸参数
  imageScale: { type: 'range', min: 0.3, max: 2, step: 0.05, label: '图片缩放' },
  imageHeight: { type: 'text', label: '图片高度 (如: 50vh)' },
  maxWidth: { type: 'text', label: '最大宽度 (如: 1400px)' },
  
  // 间距参数
  paddingTop: { type: 'range', min: 0, max: 200, step: 10, label: '顶部内边距 (px)' },
  paddingX: { type: 'text', label: '水平内边距' },
  paddingBottom: { type: 'range', min: 0, max: 200, step: 10, label: '底部内边距 (px)' },
  
  // 动画参数
  parallaxIntensity: { type: 'range', min: 0, max: 1, step: 0.05, label: '视差强度' },
  interval: { type: 'range', min: 100, max: 1000, step: 50, label: '弹出间隔 (ms)' },
  duration: { type: 'range', min: 0.2, max: 2, step: 0.1, label: '动画时长 (s)' },
  
  // 位移参数
  imageOffsetY: { type: 'range', min: -200, max: 200, step: 10, label: '图片Y偏移 (px)' },
  imageOffsetX: { type: 'range', min: -200, max: 200, step: 10, label: '图片X偏移 (px)' },
  
  // 开关参数
  noBorder: { type: 'checkbox', label: '无边框模式' },
  showGradient: { type: 'checkbox', label: '显示渐变' },
  bgAlt: { type: 'checkbox', label: '备选背景色' },
  reverse: { type: 'checkbox', label: '反向布局' },
  
  // 颜色参数
  bgColor: { type: 'text', label: '背景色 (如: #000, rgba...)' },
};

// 根据组件类型返回可调参数列表
const getEditableParams = (screenType) => {
  const typeParamsMap = {
    // 网格类组件
    'square-grid': ['columns', 'imageScale', 'gap', 'rowGap', 'columnGap', 'noBorder', 'maxWidth'],
    'gallery': ['columns', 'gap', 'rowGap', 'columnGap', 'maxWidth', 'bgAlt'],
    'factory-gallery': ['columns', 'gap', 'maxWidth', 'bgAlt'],
    'packaging-gallery': ['columns', 'gap', 'maxWidth'],
    
    // 轮播/跑马灯组件
    'grouped-carousel': ['rowGap', 'maxWidth'],
    'three-row-marquee': ['showGradient', 'gap'],
    'panorama-marquee': ['gap', 'maxWidth'],
    
    // 飞入/弹出组件
    'fly-in-gallery': ['imageHeight', 'gap', 'maxWidth'],
    'popup-sequence': ['maxWidth', 'paddingTop', 'paddingBottom'],
    'auto-sequence-popup': ['interval', 'duration', 'maxWidth', 'bgColor'],
    'row-by-row-popup': ['columns', 'gap', 'maxWidth'],
    
    // 视差组件
    'natural-parallax-grid': ['columns', 'gap', 'paddingTop', 'parallaxIntensity', 'maxWidth'],
    
    // 配对/分行组件
    'two-row-static': ['gap', 'maxWidth', 'paddingTop'],
    'product-pair-scroll': ['gap', 'maxWidth'],
    'paired-document-grid': ['gap', 'maxWidth'],
    
    // 幻灯片组件
    'slide-grid': ['gap', 'maxWidth', 'columns'],
    'document-focus-lens': ['gap', 'maxWidth'],
    
    // 对比/内容组件
    'comparison': ['imageOffsetY', 'gap', 'maxWidth', 'bgAlt'],
    'content': ['maxWidth', 'paddingX', 'reverse', 'bgAlt'],
    
    // 全屏/封面组件
    'intro': ['paddingTop', 'paddingBottom'],
    'fullscreen-image': [],
    'panorama-full': ['maxWidth'],
    'phase-closing': [],
    
    // 特殊组件
    'boundaries': ['gap', 'maxWidth'],
    'component-showcase': ['gap', 'maxWidth'],
    'consistency-mosaic': ['gap', 'maxWidth'],
    'priority-grid': ['columns', 'gap', 'maxWidth'],
    'strip-row': ['gap', 'maxWidth'],
    'component-assembly': ['maxWidth'],
    
    // Logo/品牌组件
    'logo-marquee': ['gap'],
    'logo-structure': ['maxWidth'],
    'logo-focus-lens': [],
    'color-reveal': [],
    'core-principles': [],
    'stability-message': [],
  };
  
  // 返回对应类型的参数列表，如果未定义则返回通用参数
  return typeParamsMap[screenType] || ['gap', 'maxWidth'];
};

// 获取参数的默认值
const getDefaultValue = (paramName, screenConfig) => {
  const defaults = {
    columns: 4,
    gap: '24px',
    rowGap: null,
    columnGap: null,
    imageScale: 1,
    paddingTop: 60,
    paddingX: '48px',
    maxWidth: '1400px',
    parallaxIntensity: 0.3,
    imageHeight: '50vh',
    noBorder: false,
    showGradient: true,
    imageOffsetY: 0,
  };
  
  // 优先使用配置中的值
  if (screenConfig && screenConfig[paramName] !== undefined) {
    return screenConfig[paramName];
  }
  
  return defaults[paramName];
};

export const LayoutDebugPanel = ({ 
  currentScreenConfig, 
  phaseId,
  onParamsChange,
  visible = true 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [params, setParams] = useState({});
  const [appliedParams, setAppliedParams] = useState({}); // 已应用的参数
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [hasChanges, setHasChanges] = useState(false); // 是否有未应用的修改
  
  // 当屏幕切换时，重置参数
  useEffect(() => {
    if (!currentScreenConfig) return;
    
    const editableParams = getEditableParams(currentScreenConfig.type);
    const initialParams = {};
    
    editableParams.forEach(paramName => {
      initialParams[paramName] = getDefaultValue(paramName, currentScreenConfig);
    });
    
    setParams(initialParams);
    setAppliedParams({}); // 清空已应用参数
    setHasChanges(false);
    
    // 重置预览
    if (onParamsChange) {
      onParamsChange({});
    }
  }, [currentScreenConfig?.id, currentScreenConfig?.type]);
  
  // 检测是否有未应用的修改
  useEffect(() => {
    const editableParams = getEditableParams(currentScreenConfig?.type);
    let changed = false;
    
    editableParams.forEach(paramName => {
      const currentValue = params[paramName];
      const appliedValue = appliedParams[paramName];
      const originalValue = getDefaultValue(paramName, currentScreenConfig);
      
      // 如果当前值与已应用值不同，或者与原始值不同且未应用
      if (appliedValue !== undefined) {
        if (currentValue !== appliedValue) changed = true;
      } else {
        if (currentValue !== originalValue) changed = true;
      }
    });
    
    setHasChanges(changed);
  }, [params, appliedParams, currentScreenConfig]);
  
  // 更新单个参数
  const updateParam = useCallback((name, value) => {
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // 生成配置代码
  const generateConfigCode = useCallback(() => {
    if (!currentScreenConfig) return '';
    
    const changedParams = {};
    const editableParams = getEditableParams(currentScreenConfig.type);
    
    editableParams.forEach(paramName => {
      const currentValue = params[paramName];
      const defaultValue = getDefaultValue(paramName, null); // 不传 config 获取纯默认值
      const configValue = currentScreenConfig[paramName];
      
      // 只输出与默认值不同的参数，或者配置中已有的参数
      if (currentValue !== defaultValue || configValue !== undefined) {
        changedParams[paramName] = currentValue;
      }
    });
    
    // 生成代码片段
    const lines = Object.entries(changedParams)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `  ${key}: '${value}',`;
        } else if (typeof value === 'boolean') {
          return `  ${key}: ${value},`;
        } else {
          return `  ${key}: ${value},`;
        }
      });
    
    return `// Phase: ${phaseId}, Screen: ${currentScreenConfig.id}
// Type: ${currentScreenConfig.type}
{
  id: '${currentScreenConfig.id}',
  type: '${currentScreenConfig.type}',
${lines.join('\n')}
  // ... 其他配置
}`;
  }, [params, currentScreenConfig, phaseId]);
  
  // 复制到剪贴板
  const copyConfig = useCallback(async () => {
    const code = generateConfigCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generateConfigCode]);
  
  // 重置为默认值
  const resetParams = useCallback(() => {
    if (!currentScreenConfig) return;
    
    const editableParams = getEditableParams(currentScreenConfig.type);
    const initialParams = {};
    
    editableParams.forEach(paramName => {
      initialParams[paramName] = getDefaultValue(paramName, currentScreenConfig);
    });
    
    setParams(initialParams);
  }, [currentScreenConfig]);

  // 保存到代码文件（通过 Vite 插件 API）
  const saveToCode = useCallback(async () => {
    if (!currentScreenConfig || !phaseId) return;
    
    setSaving(true);
    setSaveStatus(null);
    
    try {
      // 只保存有变化的参数
      const changedParams = {};
      const editableParams = getEditableParams(currentScreenConfig.type);
      
      editableParams.forEach(paramName => {
        const currentValue = params[paramName];
        const originalValue = currentScreenConfig[paramName];
        
        // 只保存与原配置不同的值
        if (currentValue !== originalValue && currentValue !== undefined && currentValue !== null) {
          changedParams[paramName] = currentValue;
        }
      });
      
      if (Object.keys(changedParams).length === 0) {
        setSaveStatus('no-change');
        setTimeout(() => setSaveStatus(null), 2000);
        setSaving(false);
        return;
      }
      
      const response = await fetch('/api/save-screen-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phaseId,
          screenId: currentScreenConfig.id,
          params: changedParams,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSaveStatus('success');
        console.log('✅ 配置已保存到代码:', result);
      } else {
        setSaveStatus('error');
        console.error('❌ 保存失败:', result.error);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('❌ 保存请求失败:', error);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  }, [currentScreenConfig, phaseId, params]);
  
  if (!visible || !currentScreenConfig) return null;
  
  const editableParams = getEditableParams(currentScreenConfig.type);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            width: isMinimized ? '200px' : '320px',
            background: 'rgba(20, 20, 25, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* 标题栏 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 70, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🎛️</span>
              <span style={{ fontWeight: 600 }}>布局调试</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isMinimized ? '▼' : '▲'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* 当前屏幕信息 */}
              <div style={{
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '4px'
                }}>
                  当前屏幕
                </div>
                <div style={{ 
                  fontWeight: 600,
                  color: '#FF4600'
                }}>
                  {currentScreenConfig.id}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'rgba(255, 255, 255, 0.4)',
                  marginTop: '2px'
                }}>
                  Type: {currentScreenConfig.type}
                </div>
              </div>
              
              {/* 参数编辑区 */}
              <div style={{
                padding: '16px',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                {editableParams.length === 0 ? (
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.4)',
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    该组件类型暂无可调参数
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {editableParams.map(paramName => {
                      const paramConfig = PARAM_TYPES[paramName] || { type: 'text', label: paramName };
                      const value = params[paramName];
                      
                      return (
                        <div key={paramName}>
                          <label style={{
                            display: 'block',
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {paramConfig.label}
                          </label>
                          
                          {paramConfig.type === 'range' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input
                                type="range"
                                min={paramConfig.min}
                                max={paramConfig.max}
                                step={paramConfig.step}
                                value={value ?? paramConfig.min}
                                onChange={(e) => updateParam(paramName, parseFloat(e.target.value))}
                                style={{
                                  flex: 1,
                                  accentColor: '#FF4600',
                                  height: '4px',
                                }}
                              />
                              <span style={{
                                minWidth: '50px',
                                textAlign: 'right',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                color: '#FF4600'
                              }}>
                                {value}
                              </span>
                            </div>
                          )}
                          
                          {paramConfig.type === 'text' && (
                            <input
                              type="text"
                              value={value ?? ''}
                              onChange={(e) => updateParam(paramName, e.target.value)}
                              placeholder={`例如: ${paramName === 'gap' ? '24px' : '1400px'}`}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '13px',
                                fontFamily: 'monospace',
                                outline: 'none',
                              }}
                            />
                          )}
                          
                          {paramConfig.type === 'checkbox' && (
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer'
                            }}>
                              <input
                                type="checkbox"
                                checked={value ?? false}
                                onChange={(e) => updateParam(paramName, e.target.checked)}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  accentColor: '#FF4600',
                                }}
                              />
                              <span style={{ color: value ? '#FF4600' : 'rgba(255,255,255,0.6)' }}>
                                {value ? '已启用' : '已禁用'}
                              </span>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* 操作按钮 */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {/* 第一行：应用预览 + 撤销修改 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      // 应用当前参数到预览
                      setAppliedParams({ ...params });
                      if (onParamsChange) {
                        onParamsChange(params);
                      }
                    }}
                    disabled={!hasChanges}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: hasChanges 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: 'none',
                      borderRadius: '8px',
                      color: hasChanges ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: hasChanges ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                    }}
                  >
                    👁️ 应用预览
                  </button>
                  <button
                    onClick={() => {
                      // 撤销所有修改，恢复原状
                      resetParams();
                      setAppliedParams({});
                      if (onParamsChange) {
                        onParamsChange({});
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  >
                    ↩️ 撤销修改
                  </button>
                </div>
                
                {/* 第二行：保存到代码 */}
                <button
                  onClick={saveToCode}
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: saving 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : saveStatus === 'success' 
                        ? '#22c55e' 
                        : saveStatus === 'error' 
                          ? '#ef4444' 
                          : saveStatus === 'no-change'
                            ? '#eab308'
                            : 'linear-gradient(135deg, #FF4600 0%, #FF7A3D 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: saving ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {saving ? (
                    <>⏳ 保存中...</>
                  ) : saveStatus === 'success' ? (
                    <>✅ 已保存到代码!</>
                  ) : saveStatus === 'error' ? (
                    <>❌ 保存失败</>
                  ) : saveStatus === 'no-change' ? (
                    <>⚠️ 无变化</>
                  ) : (
                    <>� 保存到代码</>
                  )}
                </button>
                
                {/* 第三行：复制配置 */}
                <button
                  onClick={copyConfig}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: copied ? '#22c55e' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: copied ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? '✓ 已复制配置代码' : '📋 复制配置代码'}
                </button>
              </div>
              
              {/* 配置预览 */}
              <details style={{ 
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <summary style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  userSelect: 'none',
                }}>
                  查看配置代码
                </summary>
                <pre style={{
                  margin: 0,
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  fontSize: '11px',
                  lineHeight: 1.5,
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Monaco, Consolas, monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {generateConfigCode()}
                </pre>
              </details>
            </>
          )}
        </motion.div>
      )}
      
      {/* 重新打开按钮 */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#FF4600',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255, 70, 0, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🎛️
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default LayoutDebugPanel;
