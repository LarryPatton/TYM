/**
 * 转换绝对路径为带 BASE_URL 的路径
 * @param {string} path - 原始路径（可能以 / 开头）
 * @returns {string} - 转换后的路径
 */
export const getAssetPath = (path) => {
  if (!path) return '';
  
  // 如果路径以 / 开头，说明是绝对路径，需要添加 BASE_URL
  if (path.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${path.substring(1)}`;
  }
  
  // 如果是完整的 URL（http/https），直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 否则认为是相对路径，也添加 BASE_URL
  return `${import.meta.env.BASE_URL}${path}`;
};
