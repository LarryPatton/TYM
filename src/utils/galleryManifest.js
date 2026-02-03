/**
 * Gallery Manifest 工具函数
 * 
 * 功能：从 gallery-manifest.json 动态读取图片路径和元数据
 * 
 * 这个文件是新创建的工具库，不会修改现有配置文件。
 * 可用于未来的配置重构，消除硬编码路径。
 */

// Manifest 数据缓存
let manifestCache = null;

/**
 * 加载 gallery manifest
 * @returns {Promise<Object>} manifest 对象
 */
export async function loadManifest() {
  if (manifestCache) {
    return manifestCache;
  }
  
  try {
    const response = await fetch('/gallery-manifest.json');
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.status}`);
    }
    manifestCache = await response.json();
    return manifestCache;
  } catch (error) {
    console.error('Error loading gallery manifest:', error);
    throw error;
  }
}

/**
 * 获取指定模块的所有文件
 * @param {string} moduleName - 模块名称（如 'material-texture'）
 * @returns {Promise<Array>} 文件列表
 */
export async function getModuleFiles(moduleName) {
  const manifest = await loadManifest();
  const module = manifest.modules[moduleName];
  
  if (!module) {
    console.warn(`Module not found: ${moduleName}`);
    return [];
  }
  
  const files = [];
  Object.entries(module.subcategories).forEach(([subcatName, subcatData]) => {
    subcatData.files.forEach(file => {
      files.push({
        ...file,
        module: moduleName,
        subcategory: subcatName
      });
    });
  });
  
  return files;
}

/**
 * 获取指定子分类的所有文件
 * @param {string} moduleName - 模块名称
 * @param {string} subcategoryName - 子分类名称
 * @returns {Promise<Array>} 文件列表
 */
export async function getSubcategoryFiles(moduleName, subcategoryName) {
  const manifest = await loadManifest();
  const module = manifest.modules[moduleName];
  
  if (!module) {
    console.warn(`Module not found: ${moduleName}`);
    return [];
  }
  
  const subcategory = module.subcategories[subcategoryName];
  if (!subcategory) {
    console.warn(`Subcategory not found: ${moduleName}/${subcategoryName}`);
    return [];
  }
  
  return subcategory.files.map(file => ({
    ...file,
    module: moduleName,
    subcategory: subcategoryName
  }));
}

/**
 * 获取单个图片的路径
 * @param {string} moduleName - 模块名称
 * @param {string} subcategoryName - 子分类名称
 * @param {number} index - 文件索引（从1开始）
 * @returns {Promise<string|null>} 图片路径
 */
export async function getImagePath(moduleName, subcategoryName, index) {
  const files = await getSubcategoryFiles(moduleName, subcategoryName);
  const file = files.find(f => f.index === index);
  return file ? file.path : null;
}

/**
 * 获取单个图片的完整信息
 * @param {string} moduleName - 模块名称
 * @param {string} subcategoryName - 子分类名称  
 * @param {number} index - 文件索引（从1开始）
 * @returns {Promise<Object|null>} 图片信息对象
 */
export async function getImageInfo(moduleName, subcategoryName, index) {
  const files = await getSubcategoryFiles(moduleName, subcategoryName);
  return files.find(f => f.index === index) || null;
}

/**
 * 按文件名搜索图片
 * @param {string} filename - 文件名（可以是部分匹配）
 * @returns {Promise<Array>} 匹配的文件列表
 */
export async function searchByFilename(filename) {
  const manifest = await loadManifest();
  const results = [];
  
  Object.entries(manifest.modules).forEach(([moduleName, moduleData]) => {
    Object.entries(moduleData.subcategories).forEach(([subcatName, subcatData]) => {
      subcatData.files.forEach(file => {
        if (file.filename.includes(filename)) {
          results.push({
            ...file,
            module: moduleName,
            subcategory: subcatName
          });
        }
      });
    });
  });
  
  return results;
}

/**
 * 获取所有横向/竖向/方形图片
 * @param {string} orientation - 方向：'landscape' | 'portrait' | 'square'
 * @returns {Promise<Array>} 匹配的文件列表
 */
export async function getImagesByOrientation(orientation) {
  const manifest = await loadManifest();
  const results = [];
  
  Object.entries(manifest.modules).forEach(([moduleName, moduleData]) => {
    Object.entries(moduleData.subcategories).forEach(([subcatName, subcatData]) => {
      subcatData.files.forEach(file => {
        if (file.orientation === orientation) {
          results.push({
            ...file,
            module: moduleName,
            subcategory: subcatName
          });
        }
      });
    });
  });
  
  return results;
}

/**
 * 获取统计信息
 * @returns {Promise<Object>} 统计数据
 */
export async function getStatistics() {
  const manifest = await loadManifest();
  return manifest.statistics;
}

/**
 * 重新加载 manifest（清除缓存）
 * @returns {Promise<Object>} 新的 manifest 对象
 */
export async function reloadManifest() {
  manifestCache = null;
  return await loadManifest();
}

/**
 * 辅助函数：格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
export function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// 默认导出所有函数
export default {
  loadManifest,
  getModuleFiles,
  getSubcategoryFiles,
  getImagePath,
  getImageInfo,
  searchByFilename,
  getImagesByOrientation,
  getStatistics,
  reloadManifest,
  formatFileSize
};
