/**
 * ScrollIndicator - 统一的向下滚动提示组件
 * 
 * 功能：
 * - 统一的视觉样式（↓ + 文字）
 * - 支持国际化（CSV 驱动）
 * - 支持多种变体（默认、探索、揭示等）
 * - 支持自定义位置和样式
 * - 箭头动画效果
 */

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * 滚动提示组件
 * 
 * @param {Object} props
 * @param {string} [props.variant='default'] - 变体类型：
 *   - 'default': 继续向下 / Scroll Down
 *   - 'explore': 向下探索 / Scroll to Explore
 *   - 'reveal': 向下揭示 / Scroll to Reveal
 *   - 'compare': 滚动对比 / Scroll to Compare
 *   - 'read': 滚动阅读 / Scroll to Read
 *   - 'control': 滚动控制 / Scroll to Control
 *   - 'interact': 滚动互动 / Scroll to Interact
 *   - 'effect': 滚动查看效果 / Scroll to See Effect
 *   - 'depth': 滚动查看景深 / Scroll to See Depth
 *   - 'morph': 滚动变形 / Scroll to Morph
 *   - 'curtain': 滚动揭幕 / Scroll to Lift Curtain
 *   - 'review': 滚动查看 / Scroll to Review
 * @param {string} [props.color] - 文字颜色，默认继承
 * @param {string} [props.position='bottom-center'] - 位置：
 *   - 'bottom-center': 底部居中
 *   - 'bottom-left': 底部左侧
 *   - 'bottom-right': 底部右侧
 *   - 'inline': 行内模式（不使用绝对定位）
 * @param {string} [props.size='medium'] - 尺寸：'small' | 'medium' | 'large'
 * @param {boolean} [props.showArrow=true] - 是否显示箭头
 * @param {boolean} [props.arrowOnly=false] - 仅显示箭头
 * @param {'vertical' | 'horizontal'} [props.layout='horizontal'] - 布局方向
 * @param {number} [props.opacity=1] - 透明度
 * @param {Object} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义类名
 */
const ScrollIndicator = ({
  variant = 'default',
  color,
  position = 'bottom-center',
  size = 'medium',
  showArrow = true,
  arrowOnly = false,
  layout = 'horizontal',
  opacity = 1,
  style = {},
  className = '',
}) => {
  const { t } = useTranslation();

  // 变体到翻译 key 的映射
  const variantKeyMap = {
    default: 'common.scroll',
    explore: 'common.scrollToExplore',
    reveal: 'common.scrollToReveal',
    compare: 'common.scrollToCompare',
    read: 'common.scrollToRead',
    control: 'common.scrollToControl',
    interact: 'common.scrollToInteract',
    effect: 'common.scrollToSeeEffect',
    depth: 'common.scrollToSeeDepth',
    morph: 'common.scrollToMorph',
    curtain: 'common.scrollToLiftCurtain',
    review: 'common.scrollToReview',
  };

  // 尺寸配置
  const sizeConfig = {
    small: {
      fontSize: '0.7rem',
      gap: '6px',
      arrowSize: '0.8rem',
      letterSpacing: '1px',
    },
    medium: {
      fontSize: '0.8rem',
      gap: '8px',
      arrowSize: '1rem',
      letterSpacing: '1.5px',
    },
    large: {
      fontSize: '0.9rem',
      gap: '10px',
      arrowSize: '1.2rem',
      letterSpacing: '2px',
    },
  };

  // 位置配置
  const positionStyles = {
    'bottom-center': {
      position: 'absolute',
      bottom: 'clamp(30px, 5vh, 50px)',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    'bottom-left': {
      position: 'absolute',
      bottom: 'clamp(30px, 5vh, 50px)',
      left: 'clamp(40px, 6vw, 80px)',
    },
    'bottom-right': {
      position: 'absolute',
      bottom: 'clamp(30px, 5vh, 50px)',
      right: 'clamp(40px, 6vw, 80px)',
    },
    inline: {
      position: 'relative',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;
  const translationKey = variantKeyMap[variant] || variantKeyMap.default;
  const text = t(translationKey);

  // 箭头动画
  const arrowAnimation = {
    animate: { y: [0, 5, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  };

  // 容器样式
  const containerStyle = {
    ...positionStyles[position],
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    alignItems: 'center',
    gap: currentSize.gap,
    color: color || 'inherit',
    fontSize: currentSize.fontSize,
    letterSpacing: currentSize.letterSpacing,
    textTransform: 'uppercase',
    opacity,
    ...style,
  };

  return (
    <motion.div
      className={`scroll-indicator ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      style={containerStyle}
    >
      {/* 箭头在前 (垂直布局时在上) */}
      {showArrow && layout === 'vertical' && (
        <motion.span
          {...arrowAnimation}
          style={{ fontSize: currentSize.arrowSize }}
        >
          ↓
        </motion.span>
      )}

      {/* 文字 */}
      {!arrowOnly && <span>{text}</span>}

      {/* 箭头在后 (水平布局时在右) */}
      {showArrow && layout === 'horizontal' && (
        <motion.span
          {...arrowAnimation}
          style={{ fontSize: currentSize.arrowSize }}
        >
          ↓
        </motion.span>
      )}
    </motion.div>
  );
};

export default ScrollIndicator;
