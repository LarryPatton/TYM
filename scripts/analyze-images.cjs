const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

// 分析指定目录下所有图片的尺寸和比例
function analyzeImages(baseDir) {
  const results = [];
  
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relPath = path.join(relativePath, item.name);
      
      if (item.isDirectory()) {
        scanDirectory(fullPath, relPath);
      } else if (item.isFile() && /\.(png|jpg|jpeg|gif|webp)$/i.test(item.name)) {
        try {
          const buffer = fs.readFileSync(fullPath);
          const dimensions = imageSize(buffer);
          const ratio = dimensions.height / dimensions.width;
          let aspectType;
          
          if (ratio > 1.1) {
            aspectType = 'portrait'; // 长图
          } else if (ratio < 0.9) {
            aspectType = 'landscape'; // 宽图
          } else {
            aspectType = 'square'; // 正方形
          }
          
          results.push({
            path: relPath.replace(/\\/g, '/'),
            width: dimensions.width,
            height: dimensions.height,
            ratio: ratio.toFixed(2),
            aspectType: aspectType
          });
        } catch (error) {
          console.error(`Error reading ${relPath}:`, error.message);
        }
      }
    }
  }
  
  scanDirectory(baseDir);
  return results;
}

// 主函数
function main() {
  const module2Dir = path.join(__dirname, '../public/gallery/material-texture');
  const module3Dir = path.join(__dirname, '../public/gallery/narrative-imagery');
  
  console.log('🔍 开始分析模块二和模块三的图片尺寸...\n');
  
  // 分析模块二
  console.log('📂 模块二：Material & Texture');
  console.log('=====================================');
  const module2Results = analyzeImages(module2Dir);
  
  console.log(`\n总计：${module2Results.length} 张图片\n`);
  
  let module2Portrait = 0;
  let module2Landscape = 0;
  let module2Square = 0;
  
  module2Results.forEach((img, index) => {
    const icon = img.aspectType === 'portrait' ? '📏' : (img.aspectType === 'landscape' ? '📐' : '⬜');
    console.log(`${index + 1}. ${icon} ${img.path}`);
    console.log(`   尺寸: ${img.width} × ${img.height} | 比例: ${img.ratio} | 类型: ${img.aspectType}`);
    
    if (img.aspectType === 'portrait') module2Portrait++;
    else if (img.aspectType === 'landscape') module2Landscape++;
    else module2Square++;
  });
  
  console.log(`\n统计：长图 ${module2Portrait} 张 | 宽图 ${module2Landscape} 张 | 正方形 ${module2Square} 张\n`);
  
  // 分析模块三
  console.log('\n📂 模块三：Narrative & Imagery');
  console.log('=====================================');
  const module3Results = analyzeImages(module3Dir);
  
  console.log(`\n总计：${module3Results.length} 张图片\n`);
  
  let module3Portrait = 0;
  let module3Landscape = 0;
  let module3Square = 0;
  
  module3Results.forEach((img, index) => {
    const icon = img.aspectType === 'portrait' ? '📏' : (img.aspectType === 'landscape' ? '📐' : '⬜');
    console.log(`${index + 1}. ${icon} ${img.path}`);
    console.log(`   尺寸: ${img.width} × ${img.height} | 比例: ${img.ratio} | 类型: ${img.aspectType}`);
    
    if (img.aspectType === 'portrait') module3Portrait++;
    else if (img.aspectType === 'landscape') module3Landscape++;
    else module3Square++;
  });
  
  console.log(`\n统计：长图 ${module3Portrait} 张 | 宽图 ${module3Landscape} 张 | 正方形 ${module3Square} 张\n`);
  
  // 保存结果为 JSON
  const outputDir = path.join(__dirname, '../docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'image-analysis-module2.json'),
    JSON.stringify(module2Results, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'image-analysis-module3.json'),
    JSON.stringify(module3Results, null, 2)
  );
  
  console.log('\n✅ 分析完成！');
  console.log(`结果已保存到：`);
  console.log(`  - docs/image-analysis-module2.json`);
  console.log(`  - docs/image-analysis-module3.json`);
}

// 检查依赖
try {
  require.resolve('image-size');
  main();
} catch (e) {
  console.error('❌ 缺少依赖包 image-size');
  console.log('请运行：npm install image-size');
  process.exit(1);
}
