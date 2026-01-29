# 自动图片压缩配置

本项目已配置自动图片压缩功能，在每次 `git commit` 时自动压缩图片文件。

## 🎯 功能特性

- ✅ **自动触发**：每次 `git commit` 前自动压缩
- ✅ **高质量**：保持高质量（JPG 85%、PNG 85-95%）
- ✅ **多格式支持**：JPG、PNG、GIF、SVG
- ✅ **实时反馈**：显示压缩前后对比
- ✅ **并发处理**：快速处理多个文件
- ✅ **智能跳过**：已优化的图片自动跳过

## 📦 压缩配置

### JPG/JPEG
- **质量**: 85%（肉眼几乎无损）
- **渐进式加载**: 启用
- **平均压缩率**: 40-60%

### PNG
- **质量范围**: 85-95%
- **速度**: 最慢（最佳质量）
- **平均压缩率**: 30-70%

### GIF
- **优化级别**: 3（最高）
- **颜色数**: 256
- **平均压缩率**: 20-40%

### SVG
- **清理 ID**: 启用
- **移除未使用命名空间**: 启用
- **保留 ViewBox**: 启用

---

## 🚀 使用方法

### 正常使用（自动触发）

```bash
# 1. 添加文件（包括图片）
git add .

# 2. 提交时会自动压缩
git commit -m "Add new images"

# 输出示例：
# 🎨 开始压缩 3 个图片文件...
# 
# ✅ banner.jpg          1.2 MB → 520.5 KB (省 56.7%)
# ✅ hero.png            850.3 KB → 680.1 KB (省 20.0%)
# ℹ️  logo.svg           已是最优大小
# 
# ✨ 压缩完成！耗时 1.23s

# 3. 推送到远程
git push
```

### 手动压缩图片

如果需要手动压缩特定图片：

```bash
# 压缩单个图片
node scripts/compress-images.js public/images/example.jpg

# 压缩多个图片
node scripts/compress-images.js public/images/*.jpg public/images/*.png
```

---

## 🔧 配置文件说明

### 1. package.json

```json
{
  "scripts": {
    "prepare": "husky || true"
  },
  "lint-staged": {
    "**/*.{jpg,jpeg,png,gif,svg}": [
      "node scripts/compress-images.js"
    ]
  }
}
```

### 2. .husky/pre-commit

```bash
npx lint-staged
```

### 3. scripts/compress-images.js

核心压缩逻辑，使用 imagemin 系列插件。

---

## ⚙️ 自定义配置

如果需要调整压缩质量，编辑 `scripts/compress-images.js`：

```js
// JPG 质量（0-100）
imageminMozjpeg({
  quality: 85,  // 调整此值：数字越大质量越好，文件越大
  progressive: true,
})

// PNG 质量（0-1）
imageminPngquant({
  quality: [0.85, 0.95],  // [最小值, 最大值]
  speed: 1,  // 1-11，数字越小质量越好但速度越慢
})
```

### 推荐质量设置

| 场景 | JPG | PNG | 说明 |
|------|-----|-----|------|
| **高质量**（当前） | 85 | 85-95 | 肉眼几乎无损，适合设计作品 |
| 平衡 | 75 | 70-85 | 轻微质量损失，文件更小 |
| 小文件 | 60 | 60-70 | 明显质量损失，文件最小 |

---

## 📊 压缩效果示例

### 实际案例

```
原始图片                    压缩后               节省
hero-banner.jpg     2.5 MB  →  1.1 MB      (省 56%)
product-photo.png   1.8 MB  →  1.2 MB      (省 33%)
icon-sprite.svg     45 KB   →  28 KB       (省 38%)
animation.gif       850 KB  →  620 KB      (省 27%)
```

---

## 🛠️ 故障排除

### 问题 1: 提交时没有压缩

**原因**：Husky 未正确安装

**解决方案**：
```bash
npm run prepare
```

### 问题 2: 压缩失败

**原因**：依赖包未安装

**解决方案**：
```bash
npm install
```

### 问题 3: 某些图片被跳过

这是正常的！如果图片已经是最优大小，会自动跳过。

### 问题 4: 压缩太慢

**原因**：图片太多或太大

**解决方案**：
- 脚本已配置并发处理（最多同时 5 个）
- 考虑先手动压缩超大图片（>5MB）

---

## 🚫 禁用自动压缩

### 临时禁用（单次提交）

```bash
git commit --no-verify -m "Skip image compression"
```

### 永久禁用

删除或重命名 `.husky/pre-commit` 文件：

```bash
# Windows
rename .husky\pre-commit pre-commit.disabled

# Mac/Linux
mv .husky/pre-commit .husky/pre-commit.disabled
```

---

## 📚 技术栈

- **husky**: Git hooks 管理
- **lint-staged**: 暂存文件处理
- **imagemin**: 图片压缩核心
- **imagemin-mozjpeg**: JPG 压缩（Mozilla JPEG）
- **imagemin-pngquant**: PNG 压缩（量化）
- **imagemin-gifsicle**: GIF 压缩
- **imagemin-svgo**: SVG 优化

---

## 💡 最佳实践

1. **提交前检查**
   - 查看压缩日志，确认效果满意
   - 如果某图片压缩率过高（>80%），检查原图质量

2. **大文件建议**
   - 超过 5MB 的图片，考虑先手动压缩
   - 使用在线工具（TinyPNG、Squoosh）预处理

3. **版本控制**
   - 压缩后的图片会自动添加到同一次提交
   - 无需额外操作

4. **团队协作**
   - 团队成员首次克隆后运行 `npm install`
   - Husky 会自动安装 Git hooks

---

## 🔗 相关资源

- [imagemin 文档](https://github.com/imagemin/imagemin)
- [TinyPNG 在线工具](https://tinypng.com)
- [Squoosh 图片压缩](https://squoosh.app)

---

**最后更新**: 2024-01
**维护者**: 项目团队
