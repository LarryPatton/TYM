/**
 * Work Adapter - 作品配置适配器
 * 
 * 功能：将配置作品对象转换为包含实际图片路径的可用对象
 * 支持新格式（imageRef）和旧格式（image）的向后兼容
 */

import { getImagePath, getImageInfo } from './galleryManifest.js';

/**
 * 将单个作品配置转换为包含图片路径的作品对象
 * @param {Object} work - 配置作品对象
 * @returns {Promise<Object>} 包含图片路径的作品对象
 */
export async function enrichWork(work) {
  try {
    // 向后兼容：如果已有 image 字段（旧格式），直接返回
    if (work.image && !work.imageRef) {
      console.log(`[WorkAdapter] 使用旧格式 (work ${work.id}):`, work.image);
      return work;
    }

    // 新格式：从 imageRef 获取路径
    if (work.imageRef) {
      const imageInfo = await getImageInfo(
        work.imageRef.module,
        work.imageRef.subcategory,
        work.imageRef.index
      );

      if (!imageInfo) {
        console.error(`[WorkAdapter] 图片未找到 (work ${work.id}):`, work.imageRef);
        return {
          ...work,
          image: '/placeholder.png',
          error: true,
          errorMessage: 'Image not found in manifest'
        };
      }

      console.log(`[WorkAdapter] 使用新格式 (work ${work.id}):`, imageInfo.path);
      
      return {
        ...work,
        image: imageInfo.path,
        aspectType: imageInfo.orientation,
        dimensions: imageInfo.dimensions,
        fileSize: imageInfo.fileSize
      };
    }

    // 既没有 image 也没有 imageRef
    console.error(`[WorkAdapter] 作品配置缺少路径信息 (work ${work.id})`);
    return {
      ...work,
      image: '/placeholder.png',
      error: true,
      errorMessage: 'Missing image path'
    };

  } catch (error) {
    console.error(`[WorkAdapter] 处理作品时出错 (work ${work.id}):`, error);
    return {
      ...work,
      image: '/placeholder.png',
      error: true,
      errorMessage: error.message
    };
  }
}

/**
 * 批量转换作品数组
 * @param {Array} works - 配置作品数组
 * @returns {Promise<Array>} 包含图片路径的作品数组
 */
export async function enrichWorks(works) {
  console.log(`[WorkAdapter] 开始处理 ${works.length} 个作品配置`);
  const startTime = performance.now();
  
  const enrichedWorks = await Promise.all(works.map(enrichWork));
  
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  
  const newFormatCount = enrichedWorks.filter(w => w.imageRef).length;
  const oldFormatCount = enrichedWorks.filter(w => w.image && !w.imageRef).length;
  const errorCount = enrichedWorks.filter(w => w.error).length;
  
  console.log(`[WorkAdapter] 处理完成 (${duration}ms):`);
  console.log(`  - 新格式: ${newFormatCount} 个`);
  console.log(`  - 旧格式: ${oldFormatCount} 个`);
  console.log(`  - 错误: ${errorCount} 个`);
  
  return enrichedWorks;
}

/**
 * 同步获取作品路径（需要先预加载 manifest）
 * @param {Object} work - 配置作品对象
 * @returns {string} 图片路径
 */
export function getWorkImageSync(work) {
  if (work.image && !work.imageRef) {
    return work.image;
  }
  
  // 对于新格式，需要异步加载
  console.warn('[WorkAdapter] getWorkImageSync 不支持新格式，请使用 enrichWork');
  return '/placeholder.png';
}

export default {
  enrichWork,
  enrichWorks,
  getWorkImageSync
};
