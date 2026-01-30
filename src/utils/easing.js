/**
 * 缓动函数工具
 * 用于平滑进度条动画
 */

/**
 * easeOutCubic - 先快后慢的缓动（推荐）
 * @param {number} t - 输入值 (0-1)
 * @returns {number} - 输出值 (0-1)
 */
export const easeOutCubic = (t) => {
  return 1 - Math.pow(1 - t, 3);
};

/**
 * easeOutQuad - 温和的减速
 * @param {number} t - 输入值 (0-1)
 * @returns {number} - 输出值 (0-1)
 */
export const easeOutQuad = (t) => {
  return 1 - (1 - t) * (1 - t);
};

/**
 * easeInOutCubic - 先慢后快再慢
 * @param {number} t - 输入值 (0-1)
 * @returns {number} - 输出值 (0-1)
 */
export const easeInOutCubic = (t) => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * 映射真实进度到显示进度
 * 将真实加载进度 0-50% 映射到显示进度 0-100%
 * 使用缓动函数让动画更流畅
 * 
 * @param {number} realProgress - 真实加载进度（0-100）
 * @param {number} threshold - 映射阈值（默认 50，即 50% 映射到 100%）
 * @param {Function} easingFn - 缓动函数（默认 easeOutCubic）
 * @returns {number} - 显示进度（0-100）
 */
export const mapProgressWithEasing = (
  realProgress, 
  threshold = 50, 
  easingFn = easeOutCubic
) => {
  // 如果真实进度超过阈值，则显示 100%
  if (realProgress >= threshold) {
    return 100;
  }
  
  // 将 0-threshold 映射到 0-1
  const normalizedProgress = realProgress / threshold;
  
  // 应用缓动函数
  const easedProgress = easingFn(normalizedProgress);
  
  // 映射回 0-100
  return Math.round(easedProgress * 100);
};

/**
 * 平滑进度更新（避免跳跃）
 * @param {number} currentProgress - 当前显示进度
 * @param {number} targetProgress - 目标进度
 * @param {number} maxStep - 最大单步增长（默认 2%）
 * @returns {number} - 新的显示进度
 */
export const smoothProgress = (currentProgress, targetProgress, maxStep = 2) => {
  const diff = targetProgress - currentProgress;
  
  if (Math.abs(diff) <= maxStep) {
    return targetProgress;
  }
  
  return currentProgress + Math.sign(diff) * maxStep;
};
