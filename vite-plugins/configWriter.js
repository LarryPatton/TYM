/**
 * Vite Plugin: Config Writer
 * 
 * 允许前端调试面板直接写入配置到 phaseConfig.js
 * 仅在开发环境生效
 */

import fs from 'fs';
import path from 'path';

export function configWriterPlugin() {
  return {
    name: 'vite-plugin-config-writer',
    
    configureServer(server) {
      // 添加中间件处理配置保存请求
      server.middlewares.use('/api/save-screen-config', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const { phaseId, screenId, params } = JSON.parse(body);
            
            if (!phaseId || !screenId || !params) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing required fields' }));
              return;
            }

            // 读取 phaseConfig.js
            const configPath = path.resolve(process.cwd(), 'src/config/phaseConfig.js');
            let configContent = fs.readFileSync(configPath, 'utf-8');

            // 查找目标 screen 配置块
            // 策略：找到 id: 'screenId' 所在的对象块，更新其中的参数
            const result = updateScreenConfig(configContent, phaseId, screenId, params);
            
            if (result.success) {
              // 写入文件
              fs.writeFileSync(configPath, result.content, 'utf-8');
              
              console.log(`\n✅ [ConfigWriter] 已更新配置：`);
              console.log(`   Phase: ${phaseId}`);
              console.log(`   Screen: ${screenId}`);
              console.log(`   参数:`, params);
              console.log('');
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                success: true, 
                message: '配置已保存',
                updatedParams: Object.keys(params)
              }));
            } else {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: result.error }));
            }
          } catch (error) {
            console.error('[ConfigWriter] Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      });

      console.log('\n🔧 [ConfigWriter] 配置写入 API 已启用: /api/save-screen-config\n');
    }
  };
}

/**
 * 更新屏幕配置
 * 使用正则匹配找到目标 screen 对象，更新其中的参数
 */
function updateScreenConfig(content, phaseId, screenId, params) {
  try {
    // 策略1：精确匹配 id: 'screenId' 并更新同一对象内的参数
    // 这是一个简化实现，处理常见情况
    
    // 找到 screen 对象的起始位置
    // 匹配 { ... id: 'screenId' ... }
    const screenIdPattern = new RegExp(
      `(\\{[^{}]*id:\\s*['"]${escapeRegExp(screenId)}['"][^{}]*)\\}`,
      'g'
    );
    
    let match;
    let updated = false;
    let newContent = content;
    
    // 遍历所有匹配（可能有多个同名 screen，需要验证 phase）
    while ((match = screenIdPattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const beforeId = match[1];
      
      // 检查这个 screen 是否属于目标 phase
      // 简单策略：检查 match 之前的内容是否包含 phase-xx:
      const contentBefore = content.substring(0, match.index);
      const lastPhaseMatch = contentBefore.match(/'(phase-\d+)':\s*\{[^]*$/);
      
      if (lastPhaseMatch && lastPhaseMatch[1] === phaseId) {
        // 找到目标 screen，更新参数
        let updatedBlock = beforeId;
        
        for (const [key, value] of Object.entries(params)) {
          // 检查参数是否已存在
          const existingParamPattern = new RegExp(`${key}:\\s*[^,}]+`);
          const valueStr = formatValue(value);
          
          if (existingParamPattern.test(updatedBlock)) {
            // 更新已存在的参数
            updatedBlock = updatedBlock.replace(existingParamPattern, `${key}: ${valueStr}`);
          } else {
            // 添加新参数（在 id 后面添加）
            const idPattern = new RegExp(`(id:\\s*['"]${escapeRegExp(screenId)}['"],?)`);
            updatedBlock = updatedBlock.replace(idPattern, `$1\n      ${key}: ${valueStr},`);
          }
        }
        
        newContent = newContent.replace(fullMatch, updatedBlock + '}');
        updated = true;
        break;
      }
    }
    
    if (!updated) {
      // 策略2：使用更宽松的匹配
      // 直接搜索 screenId 并在其对象块中添加/更新参数
      const loosePattern = new RegExp(
        `(id:\\s*['"]${escapeRegExp(screenId)}['"])`,
        'g'
      );
      
      if (loosePattern.test(content)) {
        // 找到 id 声明的位置
        const idMatch = content.match(loosePattern);
        if (idMatch) {
          const idIndex = content.indexOf(idMatch[0]);
          // 从 id 位置向后查找该对象块的范围
          let braceCount = 0;
          let startIndex = idIndex;
          // 向前找到对象开始的 {
          for (let i = idIndex; i >= 0; i--) {
            if (content[i] === '{') {
              if (braceCount === 0) {
                startIndex = i;
                break;
              }
              braceCount--;
            } else if (content[i] === '}') {
              braceCount++;
            }
          }
          
          // 向后找到对象结束的 }
          braceCount = 1;
          let endIndex = idIndex;
          for (let i = startIndex + 1; i < content.length; i++) {
            if (content[i] === '{') {
              braceCount++;
            } else if (content[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIndex = i;
                break;
              }
            }
          }
          
          // 提取对象块
          let objectBlock = content.substring(startIndex, endIndex + 1);
          
          // 更新参数
          for (const [key, value] of Object.entries(params)) {
            const existingParamPattern = new RegExp(`(${key}:\\s*)([^,}\\n]+)`);
            const valueStr = formatValue(value);
            
            if (existingParamPattern.test(objectBlock)) {
              objectBlock = objectBlock.replace(existingParamPattern, `$1${valueStr}`);
            } else {
              // 在 type: 后面添加新参数
              const typePattern = /(type:\s*['"][^'"]+['"],?)/;
              if (typePattern.test(objectBlock)) {
                objectBlock = objectBlock.replace(typePattern, `$1\n      ${key}: ${valueStr},`);
              }
            }
          }
          
          newContent = content.substring(0, startIndex) + objectBlock + content.substring(endIndex + 1);
          updated = true;
        }
      }
    }
    
    if (updated) {
      return { success: true, content: newContent };
    } else {
      return { success: false, error: `未找到 screen: ${screenId} in phase: ${phaseId}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatValue(value) {
  if (typeof value === 'string') {
    return `'${value}'`;
  } else if (typeof value === 'boolean') {
    return value.toString();
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (value === null || value === undefined) {
    return 'null';
  } else {
    return JSON.stringify(value);
  }
}

export default configWriterPlugin;
