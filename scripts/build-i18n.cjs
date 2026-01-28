/**
 * i18n 构建脚本
 * 将 CSV 表格转换为 JSON 翻译文件
 * 
 * 使用方法: node scripts/build-i18n.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONTENT_DIR = path.join(__dirname, '../src/i18n/content');
const OUTPUT_DIR = path.join(__dirname, '../src/locales');
const LANGUAGES = ['zh', 'en'];

/**
 * 解析 CSV 内容为对象数组
 * @param {string} csvContent - CSV 文件内容
 * @returns {Array} 解析后的对象数组
 */
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] || '';
      });
      result.push(row);
    }
  }
  
  return result;
}

/**
 * 解析单行 CSV（处理逗号在引号内的情况）
 * @param {string} line - CSV 行
 * @returns {Array} 字段数组
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * 将点分隔的 key 设置到嵌套对象中
 * 支持数组语法，如 "items[0]"
 * @param {Object} obj - 目标对象
 * @param {string} key - 点分隔的 key，如 "about.expertise.strategy.title"
 * @param {any} value - 要设置的值
 */
function setNestedValue(obj, key, value) {
  const parts = key.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    let part = parts[i];
    let arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      const arrayIndex = parseInt(arrayMatch[2]);
      
      if (!current[arrayKey]) {
        current[arrayKey] = [];
      }
      if (!current[arrayKey][arrayIndex]) {
        current[arrayKey][arrayIndex] = {};
      }
      current = current[arrayKey][arrayIndex];
    } else {
      if (!current[part]) {
        // 检查下一个 part 是否是数组索引
        const nextPart = parts[i + 1];
        if (nextPart && nextPart.match(/^\[?\d+\]?$|^.+\[\d+\]$/)) {
          current[part] = [];
        } else {
          current[part] = {};
        }
      }
      current = current[part];
    }
  }
  
  // 处理最后一个 part
  let lastPart = parts[parts.length - 1];
  let lastArrayMatch = lastPart.match(/^(.+)\[(\d+)\]$/);
  
  if (lastArrayMatch) {
    const arrayKey = lastArrayMatch[1];
    const arrayIndex = parseInt(lastArrayMatch[2]);
    
    if (!current[arrayKey]) {
      current[arrayKey] = [];
    }
    current[arrayKey][arrayIndex] = value;
  } else {
    current[lastPart] = value;
  }
}

/**
 * 读取所有 CSV 文件并合并为翻译对象
 * @returns {Object} { zh: {...}, en: {...} }
 */
function buildTranslations() {
  const translations = {};
  LANGUAGES.forEach(lang => {
    translations[lang] = {};
  });
  
  // 读取所有 CSV 文件
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.csv'));
  
  console.log(`\n📂 发现 ${files.length} 个 CSV 文件:\n`);
  
  files.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCSV(content);
    
    console.log(`  ✓ ${file} (${rows.length} 条翻译)`);
    
    rows.forEach(row => {
      const key = row.key;
      if (!key) return;
      
      LANGUAGES.forEach(lang => {
        const value = row[lang];
        if (value !== undefined && value !== '') {
          setNestedValue(translations[lang], key, value);
        }
      });
    });
  });
  
  return translations;
}

/**
 * 输出翻译文件
 * @param {Object} translations - 翻译对象
 */
function writeTranslations(translations) {
  console.log('\n📝 生成翻译文件:\n');
  
  LANGUAGES.forEach(lang => {
    const langDir = path.join(OUTPUT_DIR, lang);
    
    // 确保目录存在
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    const outputPath = path.join(langDir, 'translation.json');
    const content = JSON.stringify(translations[lang], null, 2);
    
    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`  ✓ ${outputPath}`);
  });
}

/**
 * 主函数
 */
function main() {
  console.log('🌐 i18n 构建工具');
  console.log('================');
  
  // 检查内容目录是否存在
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ 内容目录不存在: ${CONTENT_DIR}`);
    process.exit(1);
  }
  
  try {
    const translations = buildTranslations();
    writeTranslations(translations);
    
    console.log('\n✅ 构建完成!\n');
  } catch (error) {
    console.error('\n❌ 构建失败:', error.message);
    process.exit(1);
  }
}

main();