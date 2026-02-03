# 图片压缩工具使用指南

本项目使用 **手动批量压缩** 方式处理图片文件，完全保留 PNG 透明通道，避免自动压缩导致的质量损失。

## 🎯 功能特性

- ✅ **手动触发**：按需批量压缩，完全可控
- ✅ **保留透明通道**：PNG 文件使用无损优化，100% 保留 alpha 通道
- ✅ **多格式支持**：JPG、PNG
- ✅ **实时反馈**：显示压缩前后对比和统计信息
- ✅ **多线程处理**：快速处理大量文件
- ✅ **智能跳过**：小文件自动跳过

---

## 📦 压缩配置

### JPG/JPEG
- **质量**: 85%（肉眼几乎无损）
- **渐进式加载**: 启用
- **平均压缩率**: 40-60%

### PNG
- **模式**: **无损优化** 🔒
- **方法**: `optimize=True` + `compress_level=9`
- **透明通道**: **完全保留** ✅
- **平均压缩率**: 10-30%（无损）

> ⚠️ **重要**：PNG 文件使用无损压缩，完全保留 RGBA 透明通道。不使用 pngquant 等有损压缩工具，避免透明通道损坏。

---

## 🚀 使用方法

### 批量压缩所有图片

使用提供的批处理脚本一键压缩：

```bash
# Windows
compress-fast.bat

# 或直接运行 Python 脚本
python scripts/compress-images-fast.py
```

**输出示例**：
```
======================================================================
                      📊 图片批量压缩工具
======================================================================

🔍 扫描目录: public
📊 总计: 150 个文件

🔄 开始压缩...

✅ images/hero.jpg              1.2 MB → 520.5 KB    (省 56.7%)
✅ images/product.png           850 KB → 780 KB      (省 8.2%)
⚠️  images/icon.png             15 KB (小文件跳过)

======================================================================
📈 压缩统计
======================================================================
✅ 成功:    148 个文件
⏭️  跳过:    2 个文件 (小于 50KB)
❌ 失败:    0 个文件
📊 总节省:  25.3 MB
======================================================================
```

### 压缩特定目录

修改 `scripts/compress-images-fast.py` 中的路径配置：

```python
# 修改源目录
SOURCE_DIR = "public/images/phase-02"  # 仅压缩特定目录
```

---

## 🔧 配置文件说明

### 1. compress-fast.bat

Windows 批处理启动脚本：

```batch
@echo off
python scripts/compress-images-fast.py
pause
```

### 2. scripts/compress-images-fast.py

核心压缩逻辑，使用 Pillow 库：

```python
# PNG - 无损优化，完全保留透明通道
img.save(output_path, 'PNG', optimize=True, compress_level=9)

# JPG - 高质量有损压缩
img.save(output_path, 'JPEG', quality=85, optimize=True, progressive=True)
```

---

## ⚙️ 自定义配置

如果需要调整压缩设置，编辑 `scripts/compress-images-fast.py`：

```python
# JPG 质量（0-100）
quality = 85  # 调整此值：数字越大质量越好，文件越大

# PNG 压缩级别（1-9）
compress_level = 9  # 最高压缩级别，无损

# 跳过小文件阈值（字节）
MIN_SIZE_KB = 50  # 小于此大小的文件自动跳过
```

### 推荐质量设置

| 场景 | JPG 质量 | PNG 模式 | 说明 |
|------|---------|---------|------|
| **高质量**（当前） | 85 | 无损 optimize | 肉眼几乎无损，适合设计作品 |
| 平衡 | 75 | 无损 optimize | 轻微质量损失，文件更小 |
| 小文件优先 | 60 | 无损 optimize | JPG 损失明显，PNG 依然无损 |

> ⚠️ **注意**：PNG 始终使用无损压缩，不要使用有损工具（如 pngquant）以避免透明通道损坏。

---

## 📊 压缩效果示例

### 实际案例

```
原始图片                    压缩后               节省        备注
hero-banner.jpg     2.5 MB  →  1.1 MB      (省 56%)    有损压缩
product-photo.png   1.8 MB  →  1.6 MB      (省 11%)    无损优化
icon-alpha.png      450 KB  →  420 KB      (省 7%)     透明通道完整保留
small-icon.png      25 KB   →  跳过                     小文件自动跳过
```

### 透明通道保护验证

所有 PNG 文件压缩后：
- ✅ RGBA 模式完整保留
- ✅ Alpha 通道数据不变
- ✅ 透明区域显示正常
- ✅ 无白色底色问题

---

## 🛠️ 故障排除

### 问题 1: 压缩后 PNG 出现白色背景

**原因**：使用了有损压缩工具（如 pngquant）破坏了透明通道

**解决方案**：
1. 使用本项目提供的 `compress-fast.bat`（已修复）
2. 运行透明通道检测工具：
   ```bash
   python scripts/detect-transparent-loss.py
   ```
3. 从备份恢复受影响的文件：
   ```bash
   python scripts/restore-transparent-images.py
   ```

### 问题 2: Python 未安装或版本过低

**原因**：系统未安装 Python 3.6+

**解决方案**：
```bash
# 检查 Python 版本
python --version

# 下载安装：https://www.python.org/downloads/
# 安装 Pillow 依赖
pip install Pillow
```

### 问题 3: 某些图片被跳过

**原因**：文件小于 50KB（跳过阈值）

这是正常的！小文件压缩收益有限，自动跳过可节省时间。

### 问题 4: 压缩失败

**原因**：图片文件损坏或格式不支持

**解决方案**：
- 查看错误日志，找出具体失败的文件
- 使用图片编辑工具重新保存该文件
- 检查文件扩展名是否正确

---

## � 透明通道检测工具

### 检测丢失透明通道的 PNG 文件

```bash
python scripts/detect-transparent-loss.py
```

**输出**：
- 扫描所有 PNG 文件
- 检测哪些文件丢失了透明通道（RGB/L/P 模式）
- 生成详细报告：`scripts/transparent-loss-report.json`

### 批量恢复透明通道

如果发现文件丢失透明通道，从备份恢复：

```bash
python scripts/restore-transparent-images.py
```

> 📝 **前置条件**：需要有备份目录，并在脚本中配置备份路径。

---

## 📚 技术栈

- **Python 3.6+**: 脚本运行环境
- **Pillow (PIL)**: 图片处理库
  - PNG 无损优化（optimize + compress_level）
  - JPG 高质量压缩（quality + progressive）
  - 透明通道完整保留

---

## 💡 最佳实践

1. **压缩前备份**
   - 重要项目建议先备份 `public` 目录
   - 或使用 Git 版本控制，随时可回退

2. **分批压缩**
   - 首次压缩建议分目录进行
   - 验证效果后再进行全量压缩

3. **验证透明通道**
   - 压缩后运行检测脚本验证
   - 确保所有 PNG 透明通道完好

4. **定期压缩**
   - 添加大量新图片后及时压缩
   - 保持项目文件大小可控

5. **不要使用自动压缩**
   - ❌ 避免使用 Git hooks 自动压缩
   - ❌ 避免使用 pngquant 等有损 PNG 工具
   - ✅ 使用项目提供的无损压缩脚本

---

## 🔗 相关资源

- [Pillow 官方文档](https://pillow.readthedocs.io/)
- [PNG 优化原理](https://optipng.sourceforge.net/)
- [最佳实践文档](./BEST-PRACTICES.md) _(推荐阅读)_

---

## 📖 相关文档

- [最佳实践指南](./BEST-PRACTICES.md) - 图片处理常见问题和解决方案
- [开发指南](./DEVELOPMENT.md) - 项目开发规范
- [文档导航](./README.md) - 所有文档索引

---

**最后更新**: 2026-01-30  
**维护者**: 项目团队  
**变更说明**: 
- 移除了基于 lint-staged 的自动压缩（会破坏 PNG 透明通道）
- 改用 Python 手动批量压缩，完全保留透明通道
- 新增透明通道检测和恢复工具