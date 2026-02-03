# 图片处理最佳实践

本文档总结了项目中图片处理的最佳实践、常见问题和解决方案，帮助避免踩坑。

---

## 📖 目录

- [PNG 透明通道保护](#png-透明通道保护)
- [图片压缩指南](#图片压缩指南)
- [常见错误与陷阱](#常见错误与陷阱)
- [故障排查流程](#故障排查流程)
- [工具链推荐](#工具链推荐)

---

## 🛡️ PNG 透明通道保护

### 问题背景

PNG 文件支持透明通道（Alpha Channel），但很多压缩工具会在优化时破坏它：

```
原始 PNG (RGBA)  →  压缩工具  →  损坏 PNG (RGB/P)
✅ 透明背景         ❌ pngquant    ❌ 白色背景
```

### ⚠️ 危险工具列表

以下工具/配置**会破坏**透明通道：

| 工具 | 风险 | 原因 |
|------|------|------|
| `pngquant` | 🔴 高危 | 有损量化，可能丢失 alpha 通道 |
| `imagemin-pngquant` | 🔴 高危 | 基于 pngquant，同样有损 |
| Photoshop "Save for Web" | 🟡 中危 | 默认设置可能转换为索引色 |
| TinyPNG (有损模式) | 🟡 中危 | 强度过高时会损坏透明度 |
| Pillow `convert('RGB')` | 🔴 高危 | 强制转换模式，直接丢弃 alpha |

### ✅ 安全工具列表

| 工具 | 安全性 | 推荐用途 |
|------|--------|---------|
| Pillow `optimize=True` | ✅ 安全 | PNG 无损优化 |
| OptiPNG | ✅ 安全 | PNG 无损压缩 |
| pngcrush | ✅ 安全 | PNG 无损优化 |
| Squoosh (无损模式) | ✅ 安全 | 在线工具 |
| 本项目 `compress-fast.bat` | ✅ 安全 | 已验证安全 |

### 🔍 检测透明通道丢失

使用项目提供的检测脚本：

```bash
python scripts/detect-transparent-loss.py
```

**检测原理**：
- RGBA 模式 = ✅ 有透明通道
- RGB/L/P 模式 = ❌ 无透明通道或不完整

### 🔧 恢复透明通道

如果发现透明通道丢失：

1. **从备份恢复**（最佳方案）:
   ```bash
   python scripts/restore-transparent-images.py
   ```

2. **从 Git 历史恢复**:
   ```bash
   git log --oneline -- public/images/file.png
   git checkout <commit-hash> -- public/images/file.png
   ```

3. **重新导出原图**:
   - 在设计软件中重新导出
   - 确保选择 PNG-24 / RGBA 模式

---

## 📦 图片压缩指南

### 压缩策略选择

| 文件类型 | 压缩方式 | 质量损失 | 压缩率 | 推荐场景 |
|---------|---------|---------|--------|---------|
| **PNG（带透明）** | 无损 optimize | 0% | 10-30% | 所有场景 |
| **PNG（无透明）** | 可选有损 | 可控 | 30-70% | 非关键图片 |
| **JPG/JPEG** | 有损 quality=85 | 极小 | 40-60% | 照片、产品图 |
| **SVG** | 清理冗余 | 0% | 20-50% | 图标、矢量图 |

### 压缩前检查清单

- [ ] **已备份** - 重要项目先备份或提交到 Git
- [ ] **确认格式** - 透明图必须是 PNG，不能是 JPG
- [ ] **批量测试** - 先对少量文件测试压缩效果
- [ ] **验证效果** - 压缩后检查图片显示是否正常

### 压缩后验证清单

- [ ] **透明通道完整** - 运行 `detect-transparent-loss.py`
- [ ] **视觉质量** - 在浏览器中查看关键页面
- [ ] **文件大小** - 确认整体大小减少
- [ ] **Git 提交** - 压缩后立即提交，记录变更

---

## ⚠️ 常见错误与陷阱

### 错误 1: 使用 Git hooks 自动压缩

**错误示例**:
```json
// package.json
"lint-staged": {
  "**/*.png": ["pngquant --ext .png --force"]
}
```

**问题**:
- 每次 commit 自动运行，难以察觉
- pngquant 会破坏透明通道
- 错误累积，难以回溯

**正确做法**:
```json
// 移除 lint-staged 的图片压缩配置
// 使用手动批量压缩工具
```

### 错误 2: 强制转换 PNG 色彩模式

**错误示例**:
```python
from PIL import Image
img = Image.open('transparent.png')

# ❌ 错误：强制转 RGB
if img.mode == 'RGBA':
    img = img.convert('RGB')  # 透明区域变白色！
```

**正确做法**:
```python
# ✅ 正确：保持原始模式
if img.mode in ('RGBA', 'LA'):
    # 直接保存，Pillow 会保留透明通道
    img.save('output.png', 'PNG', optimize=True)
```

### 错误 3: 使用在线工具有损压缩

**错误示例**:
- TinyPNG 选择"Lossy"模式
- Squoosh 使用 WebP 或过度压缩
- CompressJPG 误用于 PNG

**正确做法**:
- 在线工具仅用于快速测试
- 生产环境使用项目脚本
- 明确选择"Lossless"模式

### 错误 4: 混淆 PNG-8 和 PNG-24

**概念区分**:

| 格式 | 色彩 | 透明度 | 适用 |
|------|------|--------|------|
| **PNG-8** | 256色索引 | 1-bit（全透/不透） | 简单图标 |
| **PNG-24** | 1670万色 | 无透明 | 照片 |
| **PNG-32** | 1670万色 | 8-bit alpha ✅ | **透明图片** |

**教训**：导出PNG时，选择 **PNG-32 (RGBA)** 以支持完整透明度。

---

## 🔍 故障排查流程

### 问题：PNG 图片显示白色背景

#### 1️⃣ 确认问题来源

```bash
# 检测 PNG 模式
python
>>> from PIL import Image
>>> img = Image.open('problematic.png')
>>> print(img.mode)  # 应该是 'RGBA'，如果是 'RGB' 或 'P' 则有问题
```

#### 2️⃣ 定位破坏时间

```bash
# 查看文件修改历史
git log --oneline --all -- path/to/image.png

# 对比不同版本
git diff <old-commit> <new-commit> -- path/to/image.png
```

#### 3️⃣ 批量检测受影响文件

```bash
# 运行检测脚本
python scripts/detect-transparent-loss.py

# 查看报告
type scripts\transparent-loss-report.json
```

#### 4️⃣ 恢复文件

```bash
# 方案 A: 从备份恢复
python scripts/restore-transparent-images.py

# 方案 B: 从 Git 恢复
git checkout <good-commit> -- path/to/image.png

# 方案 C: 重新导出原始文件
```

#### 5️⃣ 防止再次发生

- 移除自动压缩 Git hooks
- 使用安全的压缩工具
- 定期运行检测脚本

---

## 🛠️ 工具链推荐

### Python 环境

```bash
# 安装 Python 3.8+
https://www.python.org/downloads/

# 安装 Pillow
pip install Pillow

# 验证安装
python -c "from PIL import Image; print(Image.__version__)"
```

### 推荐工具组合

#### 开发环境
- **VSCode** + [Image Preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview) - 编辑器内预览
- **PixelSnap / ImageOptim** (Mac) - 拖拽式优化
- **XnView** (Windows) - 批量查看 / 转换

#### 压缩工具
- **本项目脚本** - 首选，已验证安全
- **Squoosh** (https://squoosh.app) - 在线工具，记得选无损
- **OptiPNG** - 命令行无损工具

#### 检测工具
- **本项目 detect-transparent-loss.py** - 批量检测
- **Pillow (Python)** - 编程式检测
- **ImageMagick identify** - 命令行查看模式

---

## 📋 快速参考

### 一键命令速查

```bash
# 压缩所有图片
compress-fast.bat

# 检测透明通道丢失
python scripts/detect-transparent-loss.py

# 从备份恢复
python scripts/restore-transparent-images.py

# 查看 PNG 模式
python -c "from PIL import Image; print(Image.open('file.png').mode)"
```

### 文件模式速查

| 模式 | 含义 | 透明度 | 备注 |
|------|------|--------|------|
| `RGBA` | RGB + Alpha | ✅ 完整 | 理想状态 |
| `LA` | 灰度 + Alpha | ✅ 完整 | 黑白透明图 |
| `PA` | 调色板 + Alpha | ⚠️ 有限 | 256色+透明 |
| `RGB` | 纯 RGB | ❌ 无 | 已损坏 |
| `P` | 索引色 | ❌ 无 | 已损坏 |
| `L` | 灰度 | ❌ 无 | 已损坏 |

---

## 🔗 相关链接

- [IMAGE-COMPRESSION.md](./IMAGE-COMPRESSION.md) - 压缩工具使用指南
- [Pillow 文档](https://pillow.readthedocs.io/) - 图片处理库
- [PNG 规范](http://www.libpng.org/pub/png/spec/) - 技术细节

---

## 💡 核心原则

1. **透明通道是刚需，不是可选项** - PNG 压缩必须无损
2. **自动化有风险** - 图片处理避免 Git hooks
3. **备份是生命线** - 压缩前务必备份
4. **验证是必须** - 压缩后立即检测验证
5. **工具要正确** - 选择明确安全的工具

---

**最后更新**: 2026-01-30  
**维护者**: 项目团队  
**经验来源**: 实际踩坑总结，327个文件透明通道恢复案例
