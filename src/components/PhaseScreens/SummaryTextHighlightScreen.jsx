// ... existing code ...
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PADDING, MAX_WIDTH_WIDE, itemVariants } from './Common';

// ============================================
// 屏幕: 阶段总结 Grid Reveal 展示 (SummaryTextHighlightScreen)
// 方案 B: 网格板块渐显
// ============================================
export const SummaryTextHighlightScreen = ({
  title,
  content
}) => {
  const containerRef = useRef(null);
  
  // ============================================
  // 【滚动监听配置】
  // ============================================
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]    // 滚动范围: 元素顶部对齐视口顶部 → 元素底部对齐视口底部
  });

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
        padding: '0 50px'
      }}>
        
        {/* 顶部标题 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '60px', width: '100%', maxWidth: MAX_WIDTH_WIDE }}
        >
          <div style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '16px'
          }}>
            Phase Summary
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            fontWeight: '400',
            margin: 0,
            color: '#fff'
          }}>
            {title}
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            marginTop: '16px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {content}
          </p>
        </motion.div>

        {/* 网格布局 */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '60px',
          width: '100%',
          maxWidth: '1200px',
          textAlign: 'left'
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
                      fontSize: '1.2rem', 
                      fontWeight: 'bold', 
                      marginBottom: '20px',
                      color: 'inherit', // 继承 motion 的 color
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
                      gap: '8px'
                    }}>
                      {group.items.map((item, i) => (
                        <li key={i} style={{ 
                          fontSize: '0.95rem', 
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

        {/* 底部提示 */}
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '40px', 
            opacity: 0.5, 
            fontSize: '0.8rem',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to Review Deliverables
        </motion.div>

      </div>
    </section>
  );
};