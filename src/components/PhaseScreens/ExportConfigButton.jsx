/**
 * ============================================
 * 配置导出工具 (ExportConfigButton)
 * ============================================
 * 
 * 将 Leva 调试面板中调整的配置导出为可用的 JS 代码
 * 直接复制粘贴到 transitionConfig.js 即可
 */

import { useControls, button } from 'leva';

// 将 Leva 面板的值转换为配置代码
const generateConfigCode = () => {
  // 从 localStorage 读取 Leva 保存的值
  const getLevaValue = (folder, key) => {
    try {
      const stored = localStorage.getItem(`leva__${folder}.${key}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return null;
  };

  // 辅助函数：格式化数组
  const formatArray = (arr) => {
    if (!arr) return '[]';
    const items = arr.map(v => typeof v === 'string' ? `'${v}'` : v);
    return `[${items.join(', ')}]`;
  };

  // 辅助函数：从 range 控件值创建配置
  const rangeToConfig = (range, valueRange) => {
    if (!range) return null;
    return `{
      scrollRange: ${formatArray(range)},
      valueRange: ${formatArray(valueRange)},
    }`;
  };

  // 构建配置代码
  const configs = {
    intro: {
      maskReveal: getLevaValue('1. IntroScreen', 'maskReveal'),
      breathingLayer: getLevaValue('1. IntroScreen', 'breathingLayer'),
      textExitY: getLevaValue('1. IntroScreen', 'textExitY'),
      textExitOpacity: getLevaValue('1. IntroScreen', 'textExitOpacity'),
      parallax: getLevaValue('1. IntroScreen', 'parallax'),
    },
    corePrinciples: {
      nodeCenter: getLevaValue('2. CorePrinciples', 'nodeCenter'),
      nodeTop: getLevaValue('2. CorePrinciples', 'nodeTop'),
      nodeLeft: getLevaValue('2. CorePrinciples', 'nodeLeft'),
      nodeRight: getLevaValue('2. CorePrinciples', 'nodeRight'),
      pathCenterToTop: getLevaValue('2. CorePrinciples', 'pathCenterToTop'),
      pathCenterToLeft: getLevaValue('2. CorePrinciples', 'pathCenterToLeft'),
      pathCenterToRight: getLevaValue('2. CorePrinciples', 'pathCenterToRight'),
      pathBorder: getLevaValue('2. CorePrinciples', 'pathBorder'),
      phase1Scale: getLevaValue('2. CorePrinciples', 'phase1Scale'),
      phase1Exit: getLevaValue('2. CorePrinciples', 'phase1Exit'),
      phase2Entry: getLevaValue('2. CorePrinciples', 'phase2Entry'),
      phase2Scale: getLevaValue('2. CorePrinciples', 'phase2Scale'),
      identityStep1: getLevaValue('2. CorePrinciples', 'identityStep1'),
      identityStep2: getLevaValue('2. CorePrinciples', 'identityStep2'),
      identityStep3: getLevaValue('2. CorePrinciples', 'identityStep3'),
      identityStep4: getLevaValue('2. CorePrinciples', 'identityStep4'),
      identityStep5: getLevaValue('2. CorePrinciples', 'identityStep5'),
    },
    stabilityMessage: {
      line1Progress: getLevaValue('3. StabilityMessage', 'line1Progress'),
      line2Progress: getLevaValue('3. StabilityMessage', 'line2Progress'),
      line3Progress: getLevaValue('3. StabilityMessage', 'line3Progress'),
      stabilityOpacityIn: getLevaValue('3. StabilityMessage', 'stabilityOpacityIn'),
      stabilityOpacityOut: getLevaValue('3. StabilityMessage', 'stabilityOpacityOut'),
      stabilityScale: getLevaValue('3. StabilityMessage', 'stabilityScale'),
      conclusionOpacityIn: getLevaValue('3. StabilityMessage', 'conclusionOpacityIn'),
      conclusionY: getLevaValue('3. StabilityMessage', 'conclusionY'),
      linesExitOpacity: getLevaValue('3. StabilityMessage', 'linesExitOpacity'),
      containerExitOpacity: getLevaValue('3. StabilityMessage', 'containerExitOpacity'),
    },
    logoMarquee: {
      marqueeX: getLevaValue('6. LogoMarquee', 'marqueeX'),
      titleEntryOpacity: getLevaValue('6. LogoMarquee', 'titleEntryOpacity'),
      titleEntryY: getLevaValue('6. LogoMarquee', 'titleEntryY'),
      containerExitOpacity: getLevaValue('6. LogoMarquee', 'containerExitOpacity'),
      progressWidth: getLevaValue('6. LogoMarquee', 'progressWidth'),
    },
  };

  // 生成 JS 代码字符串
  let code = `// 从 Leva 调试面板导出的配置
// 生成时间: ${new Date().toLocaleString()}
// 
// 将此内容替换到 src/config/transitionConfig.js 的 SCREEN_TRANSITIONS 对象中

`;

  // IntroScreen
  if (Object.values(configs.intro).some(v => v !== null)) {
    code += `'intro': {
  scrollHeight: '250vh',
  maskReveal: ${rangeToConfig(configs.intro.maskReveal, ['0%', '150%']) || '// 未修改'},
  breathingLayer: ${rangeToConfig(configs.intro.breathingLayer, [1, 0]) || '// 未修改'},
  textExitY: ${rangeToConfig(configs.intro.textExitY, ["'0%'", "'-50%'"]) || '// 未修改'},
  textExitOpacity: ${rangeToConfig(configs.intro.textExitOpacity, [1, 0]) || '// 未修改'},
  parallax: ${rangeToConfig(configs.intro.parallax, ["'0%'", "'10%'"]) || '// 未修改'},
},

`;
  }

  // 更多屏幕配置...
  code += `// ... 其他屏幕配置请手动合并 ...\n`;

  return code;
};

// 导出按钮组件
export const ExportConfigButton = () => {
  useControls('📋 导出工具', {
    '生成配置代码': button(() => {
      const code = generateConfigCode();
      
      // 创建一个模态框显示代码
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="
          position: fixed; 
          inset: 0; 
          background: rgba(0,0,0,0.8); 
          z-index: 99999; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          padding: 40px;
        " onclick="this.remove()">
          <div style="
            background: #1a1a1a; 
            border-radius: 12px; 
            padding: 24px; 
            max-width: 800px; 
            width: 100%; 
            max-height: 80vh; 
            overflow: auto;
            border: 1px solid #333;
          " onclick="event.stopPropagation()">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="margin: 0; color: #fff;">导出的配置代码</h3>
              <button onclick="navigator.clipboard.writeText(document.getElementById('export-code').textContent).then(() => alert('已复制!'))" style="
                background: #FF4600; 
                color: #fff; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 6px; 
                cursor: pointer;
                font-weight: 500;
              ">📋 复制代码</button>
            </div>
            <pre id="export-code" style="
              background: #0a0a0a; 
              padding: 16px; 
              border-radius: 8px; 
              color: #ddd; 
              font-size: 12px; 
              line-height: 1.5; 
              overflow: auto;
              margin: 0;
            ">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            <p style="color: #888; font-size: 12px; margin-top: 12px;">
              点击外部区域关闭此窗口
            </p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }),
    
    '复制原始 JSON': button(() => {
      const levaData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('leva__')) {
          try {
            levaData[key.replace('leva__', '')] = JSON.parse(localStorage.getItem(key));
          } catch (e) {}
        }
      }
      
      navigator.clipboard.writeText(JSON.stringify(levaData, null, 2))
        .then(() => alert('✅ 原始 JSON 已复制到剪贴板!'))
        .catch(() => alert('❌ 复制失败，请手动复制'));
    }),
    
    '下载配置文件': button(() => {
      const levaData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('leva__')) {
          try {
            levaData[key.replace('leva__', '')] = JSON.parse(localStorage.getItem(key));
          } catch (e) {}
        }
      }
      
      const blob = new Blob([JSON.stringify(levaData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transition-config-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }),
    
    '重置所有参数': button(() => {
      if (confirm('确定要重置所有参数到默认值吗？')) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('leva__')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        alert('✅ 已重置! 请刷新页面');
        window.location.reload();
      }
    }),
  });

  return null;
};

export default ExportConfigButton;
