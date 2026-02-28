import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';
import ScrollIndicator from '../ScrollIndicator';

// ============================================
// 屏幕: 阶段总结 Grid Reveal 展示 (SummaryTextHighlightScreen)
// 方案 B: 网格板块渐显
// ============================================
// ============================================
// 辅助组件: 「」关键词橙色高亮渲染
// ============================================
const HighlightText = ({ text = '', fontSize, fontWeight = 300, opacity = 1 }) => {
  const parsed = useMemo(() => {
    const result = [];
    const regex = /「([^」]+)」/g;
    let currentIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const plain = text.slice(currentIndex, match.index);
      if (plain) result.push({ text: plain, highlight: false });
      result.push({ text: match[0], highlight: true });
      currentIndex = match.index + match[0].length;
    }
    if (currentIndex < text.length) {
      result.push({ text: text.slice(currentIndex), highlight: false });
    }
    return result;
  }, [text]);

  return (
    <p style={{
      margin: 0,
      fontSize: fontSize || 'clamp(1.1rem, 2.2vw, 1.5rem)',
      fontWeight,
      letterSpacing: '0.03em',
      lineHeight: 1.7,
      color: `rgba(255,255,255,${opacity})`,
    }}>
      {parsed.map((segment, i) => (
        <span
          key={i}
          style={{
            color: segment.highlight ? '#FF5722' : `rgba(255,255,255,${opacity})`,
            fontWeight: segment.highlight ? 500 : fontWeight,
          }}
        >
          {segment.text}
        </span>
      ))}
    </p>
  );
};

export const SummaryTextHighlightScreen = ({
  title,
  content
}) => {
  const containerRef = useRef(null);
  const [revealedCharCount, setRevealedCharCount] = React.useState(0);
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]    // 滚动范围: 元素顶部对齐视口顶部 → 元素底部对齐视口底部
  });

  // 合并文案 & 解析「」高亮
  const fullText = `${title}${content ? '，' + content : ''}`;
  const parsedCaption = useMemo(() => {
    const result = [];
    const regex = /「([^」]+)」/g;
    let currentIndex = 0;
    let match;
    while ((match = regex.exec(fullText)) !== null) {
      const plain = fullText.slice(currentIndex, match.index);
      if (plain) for (const char of plain) result.push({ char, highlight: false });
      for (const char of match[0]) result.push({ char, highlight: true });
      currentIndex = match.index + match[0].length;
    }
    if (currentIndex < fullText.length) {
      for (const char of fullText.slice(currentIndex)) result.push({ char, highlight: false });
    }
    return result;
  }, [fullText]);

  const totalChars = parsedCaption.length;

  // 滚动前 20% 逐字揭示文案
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const progress = Math.min(v / 0.2, 1);
      setRevealedCharCount(Math.floor(progress * totalChars));
    });
    return unsubscribe;
  }, [scrollYProgress, totalChars]);

  // ============================================
  // 【目录数据配置】
  // ============================================
  
  /**
   * 目录结构 - 按列分组
   * - Column 1: 1.0 标识
   * - Column 2: 2.0 色彩, 3.0 字体, 4.0 图形
   * - Column 3: 5.0 应用
   * 
   * 共 5 个组，随滚动依次高亮
   * 可调整内容和结构
   */
  const columns = [
    {
      id: 'col-1',
      groups: [
        {
          section: "1.0 标识",
          items: [
            "1.1 标识", "1.2 标识颜色", "1.3 安全距离与最小尺寸", "1.4 背景控制",
            "1.5 使用准则", "1.6 Slogan组合", "1.7 特殊工艺", "1.8 标志联合",
            "1.9 版面位置", "1.10 常规应用尺寸", "1.11 视频落版"
          ]
        }
      ]
    },
    {
      id: 'col-2',
      groups: [
        {
          section: "2.0 色彩",
          items: ["2.1 品牌色彩", "2.2 包装系列配色原则"]
        },
        {
          section: "3.0 字体",
          items: ["3.1 品牌中文字体", "3.2 品牌英文字体"]
        },
        {
          section: "4.0 图形",
          items: ["4.1 超级符号", "4.2 辅助图形"]
        }
      ]
    },
    {
      id: 'col-3',
      groups: [
        {
          section: "5.0 应用",
          items: [
            "5.1 工牌", "5.2 名片", "5.3 贴纸、胶带", "5.4 Banner",
            "5.5 电子邮件签名", "5.6 贺卡", "5.7 社交媒体头像", "5.8 手提袋"
          ]
        }
      ]
    }
  ];

  // ============================================
  // 【动画时间线设计】(总滚动高度 250vh)
  // ============================================
  // 滚动进度均匀分配给 5 个组:
  // 0.0 - 0.2: Group 0 (1.0 标识) 激活
  // 0.2 - 0.4: Group 1 (2.0 色彩) 激活
  // 0.4 - 0.6: Group 2 (3.0 字体) 激活
  // 0.6 - 0.8: Group 3 (4.0 图形) 激活
  // 0.8 - 1.0: Group 4 (5.0 应用) 激活
  // ============================================
  
  /**
   * 总组数
   * - 用于计算每个组的激活区间
   * - 可调参数: 修改 columns 数据后需同步更新
   */
  const totalGroups = 5;
  
  /** 组索引计数器 (用于渲染时分配唯一索引) */
  let groupIndexCounter = 0;

  return (
    <section 
      ref={containerRef} 
      style={{ 
        minHeight: '250vh', // 足够的高度以支持滚动切换
        background: '#0a0a0a', 
        color: '#fff',
        position: 'relative'
      }}
    >
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 24px'
      }}>
        
        {/* 顶部文案区 — 滚动逐字打字 + 「」橙色高亮，完全对齐 PopupSequence caption */}
        <div style={{
          width: '100%',
          padding: '0 24px 40px',
          flexShrink: 0,
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{
              margin: 0,
              color: '#fff',
              fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
              fontWeight: 300,
              letterSpacing: '0.04em',
              lineHeight: 1.7,
            }}>
              {parsedCaption.map((item, i) => {
                const isRevealed = i < revealedCharCount;
                return (
                  <span
                    key={i}
                    style={{
                      display: 'inline',
                      color: item.highlight ? '#FF5722' : '#fff',
                      fontWeight: item.highlight ? 600 : 300,
                      opacity: isRevealed ? 1 : 0,
                      transition: 'opacity 0.4s ease-out, color 0.3s ease',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {item.char}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        {/* 网格布局 */}
        <div style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '60px',
          width: '100%',
          maxWidth: '1100px',
          textAlign: 'left',
          transform: 'translateX(8%)',
        }}>
          {columns.map((col, colIndex) => (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {col.groups.map((group, gIndex) => {
                // 为每个组分配一个唯一的索引 (0-4)
                const currentIndex = groupIndexCounter++;
                
                // 计算激活区间
                // 0.0 - 0.2: Group 0 Active
                // 0.2 - 0.4: Group 1 Active
                // ...
                const step = 1 / totalGroups;
                const start = currentIndex * step;
                const end = start + step;
                
                // 动画逻辑：
                // 在激活区间内：opacity 1, scale 1.05
                // 非激活区间：opacity 0.3, scale 1
                const opacity = useTransform(
                  scrollYProgress, 
                  [start - 0.1, start, end, end + 0.1], 
                  [0.3, 1, 1, 0.3]
                );
                
                // 颜色变化：高亮时为品牌色或白色，非高亮为灰色
                const color = useTransform(
                  scrollYProgress,
                  [start - 0.1, start, end, end + 0.1],
                  ['#666', '#fff', '#fff', '#666']
                );

                return (
                  <motion.div 
                    key={group.section}
                    style={{ opacity, color }}
                  >
                    <h3 style={{ 
                      fontSize: '1.35rem', 
                      fontWeight: 'bold', 
                      marginBottom: '20px',
                      color: 'inherit',
                      fontFamily: 'var(--font-serif)'
                    }}>
                      {group.section}
                    </h3>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      {group.items.map((item, i) => (
                        <li key={i} style={{ 
                          fontSize: '1.05rem', 
                          opacity: 0.8,
                          fontFamily: 'var(--font-sans)'
                        }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
        </div>

        {/* 底部提示 */}
        <ScrollIndicator
          variant="review"
          position="bottom-center"
          color="rgba(255,255,255,0.5)"
          size="small"
        />

      </div>
    </section>
  );
};