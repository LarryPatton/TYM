const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size').default;

// 图片目录
const imageDir = path.join(__dirname, '../public/gallery/form-structure');

// 判断图片比例类型
const getAspectType = (width, height) => {
  const ratio = height / width;
  if (ratio > 1.1) return 'portrait'; // 长图
  if (ratio < 0.9) return 'landscape'; // 宽图
  return 'square'; // 正方形
};

// 递归读取所有图片文件
const getAllImages = (dir, baseDir = dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllImages(filePath, baseDir, fileList);
    } else if (/\.(png|jpg|jpeg|gif|webp)$/i.test(file)) {
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
      fileList.push({
        path: relativePath,
        fullPath: filePath
      });
    }
  });
  
  return fileList;
};

// 检测所有图片
console.log('🔍 开始检测图片尺寸...\n');

const images = getAllImages(imageDir);
const results = [];

images.forEach(img => {
  try {
    const buffer = fs.readFileSync(img.fullPath);
    const dimensions = sizeOf(buffer);
    const aspectType = getAspectType(dimensions.width, dimensions.height);
    
    results.push({
      path: img.path,
      width: dimensions.width,
      height: dimensions.height,
      ratio: (dimensions.height / dimensions.width).toFixed(2),
      aspectType: aspectType
    });
    
    console.log(`✓ ${img.path}`);
    console.log(`  尺寸: ${dimensions.width}×${dimensions.height}`);
    console.log(`  比例: ${aspectType} (${(dimensions.height / dimensions.width).toFixed(2)})\n`);
  } catch (error) {
    console.error(`✗ 无法读取: ${img.path}`);
    console.error(`  错误: ${error.message}\n`);
  }
});

// 统计
const portraitCount = results.filter(r => r.aspectType === 'portrait').length;
const landscapeCount = results.filter(r => r.aspectType === 'landscape').length;
const squareCount = results.filter(r => r.aspectType === 'square').length;

console.log('📊 统计结果:');
console.log(`   长图 (portrait): ${portraitCount}`);
console.log(`   宽图 (landscape): ${landscapeCount}`);
console.log(`   正方形 (square): ${squareCount}`);
console.log(`   总计: ${results.length}\n`);

// 保存结果到 JSON 文件
const outputPath = path.join(__dirname, 'imageAspects.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`💾 结果已保存到: ${outputPath}`);
