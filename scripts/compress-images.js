#!/usr/bin/env node

/**
 * 图片压缩脚本
 * 在 Git commit 前自动压缩图片，保持高质量
 * 支持: JPG, PNG, GIF, SVG
 */

import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import { promises as fs } from 'fs';
import path from 'path';

// 获取命令行参数（由 lint-staged 传入）
const filesToCompress = process.argv.slice(2);

if (filesToCompress.length === 0) {
  console.log('ℹ️  没有需要压缩的图片');
  process.exit(0);
}

console.log(`\n🎨 开始压缩 ${filesToCompress.length} 个图片文件...\n`);

/**
 * 压缩单个图片文件
 */
async function compressImage(filePath) {
  const originalStats = await fs.stat(filePath);
  const originalSize = originalStats.size;
  const ext = path.extname(filePath).toLowerCase();

  try {
    // 根据文件类型选择压缩插件
    const plugins = [];
    
    if (['.jpg', '.jpeg'].includes(ext)) {
      plugins.push(
        imageminMozjpeg({
          quality: 85, // 高质量，肉眼几乎无损
          progressive: true, // 渐进式加载
        })
      );
    } else if (ext === '.png') {
      plugins.push(
        imageminPngquant({
          quality: [0.85, 0.95], // 高质量范围
          speed: 1, // 最慢速度，最佳质量
        })
      );
    } else if (ext === '.gif') {
      plugins.push(
        imageminGifsicle({
          optimizationLevel: 3, // 最高优化级别
          colors: 256,
        })
      );
    } else if (ext === '.svg') {
      plugins.push(
        imageminSvgo({
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        })
      );
    }

    if (plugins.length === 0) {
      console.log(`⚠️  跳过不支持的格式: ${path.basename(filePath)}`);
      return;
    }

    // 执行压缩
    const result = await imagemin([filePath], {
      destination: path.dirname(filePath),
      plugins,
    });

    if (result && result[0]) {
      const compressedStats = await fs.stat(filePath);
      const compressedSize = compressedStats.size;
      const savedBytes = originalSize - compressedSize;
      const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

      if (savedBytes > 0) {
        console.log(
          `✅ ${path.basename(filePath).padEnd(40)} ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (省 ${savedPercent}%)`
        );
      } else {
        console.log(
          `ℹ️  ${path.basename(filePath).padEnd(40)} 已是最优大小`
        );
      }
    }
  } catch (error) {
    console.error(`❌ 压缩失败: ${path.basename(filePath)}`, error.message);
    // 不抛出错误，允许提交继续
  }
}

/**
 * 格式化字节数为可读格式
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * 主函数
 */
async function main() {
  const startTime = Date.now();
  
  // 并发压缩所有图片（最多同时处理 5 个）
  const concurrency = 5;
  for (let i = 0; i < filesToCompress.length; i += concurrency) {
    const batch = filesToCompress.slice(i, i + concurrency);
    await Promise.all(batch.map(compressImage));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✨ 压缩完成！耗时 ${duration}s\n`);
}

main().catch((error) => {
  console.error('压缩过程出错:', error);
  process.exit(0); // 即使出错也允许提交
});
