# 添加新作品指南

> 一步步教你如何向 Gallery 添加新的艺术作品

---

## 📋 目录

- [快速开始](#快速开始)
- [详细步骤](#详细步骤)
- [实战示例](#实战示例)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### **5步添加新作品**

1. 📁 **上传图片** → `public/gallery/{module}/{subcategory}/`
2. 🔄 **更新 Manifest** → 运行扫描脚本
3. ✏️ **添加配置** → 编辑对应的 `*Works.js`
4. ✅ **验证** → 运行验证脚本
5. 🎉 **测试** → 在浏览器中查看

---

## 📖 详细步骤

### **步骤1：准备图片文件**

#### **1.1 文件命名规范**

```
格式: {prefix}-{subcategory-num}-{index}.{ext}

示例:
✅ banhua-01-001.png  (板绘1的第1张)
✅ banhua-01-002.png  (板绘1的第2张)
✅ xieyi-renwu-001.png  (写意人物的第1张)

❌ 板绘001.png  (不要使用中文)
❌ image1.jpg  (缺少分类标识)
```

#### **1.2 文件要求**

| 要求 | 说明 | 推荐值 |
|------|------|--------|
| **格式** | PNG / JPG | PNG（质量更好） |
| **尺寸** | 宽度或高度 | 1000-2000px |
| **大小** | 文件大小 | <500KB |
| **命名** | 小写字母+数字 | 遵循规范 |

#### **1.3 上传位置**

```bash
# 目录结构
public/gallery/
├── material-texture/
│   ├── 板绘1/
│   │   ├── banhua-01-001.png  # ← 新图片放这里
│   │   └── banhua-01-002.png
│   └── 板绘2/
├── form-structure/
│   ├── 写意人物/
│   └── ...
└── narrative-imagery/
    └── ...
```

**上传新图片：**
```bash
# 例如：添加板绘1的第3张图片
copy 你的图片.png public\gallery\material-texture\板绘1\banhua-01-003.png
```

---

### **步骤2：更新 Manifest**

#### **2.1 运行扫描脚本**

```bash
# 方法1：扫描所有模块（推荐）
python scripts/scan-gallery.py

# 方法2：只扫描特定模块
python scripts/scan-gallery.py --module material-texture
```

#### **2.2 验证 Manifest**

```bash
# 检查 manifest 是否正确
python scripts/validate-manifest.py

# 预期输出:
# ✓ manifest-texture: 50 images  (增加了1张)
# ✓ form-structure: 39 images
# ✓ narrative-imagery: 46 images
# ✅ 验证通过！
```

---

### **步骤3：添加作品配置**

#### **3.1 编辑配置文件**

根据模块选择对应的配置文件：

| 模块 | 配置文件 |
|------|----------|
| Material & Texture | `src/data/materialTextureWorks.js` |
| Form & Structure | `src/data/formStructureWorks.js` |
| Narrative Imagery | `src/data/narrativeImageryWorks.js` |

#### **3.2 添加新配置项**

```javascript
// src/data/materialTextureWorks.js

const MODULE_NAME = 'material-texture';

export const materialTextureWorks = [
  // ... 已有作品 ...
  
  // 板绘1 (原来2张，现在3张)
  {
    id: 1,
    title: '板绘·01',
    category: '板绘1',
    media: '板绘',
    year: '2023',
    imageRef: {
      module: MODULE_NAME,
      subcategory: '板绘1',
      index: 1
    }
  },
  {
    id: 2,
    title: '板绘·02',
    category: '板绘1',
    media: '板绘',
    year: '2023',
    imageRef: {
      module: MODULE_NAME,
      subcategory: '板绘1',
      index: 2
    }
  },
  // ⬇️ 新添加的作品
  {
    id: 50,  // 注意：ID要按顺序递增
    title: '板绘·03',
    category: '板绘1',
    media: '板绘',
    year: '2024',  // 当前年份
    imageRef: {
      module: MODULE_NAME,
      subcategory: '板绘1',
      index: 3  // 新图片的索引
    }
  },
  
  // ... 其他作品 ...
];
```

#### **3.3 配置字段说明**

| 字段 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `id` | ✅ | 唯一标识，递增编号 | `50` |
| `title` | ✅ | 作品标题 | `'板绘·03'` |
| `category` | ✅ | 子分类名称 | `'板绘1'` |
| `media` | ✅ | 主媒介类型 | `'板绘'` |
| `year` | ✅ | 创作年份 | `'2024'` |
| `imageRef` | ✅ | 图片引用对象 | 见下方 |

**imageRef 结构：**
```javascript
imageRef: {
  module: MODULE_NAME,      // 模块名（使用常量）
  subcategory: '板绘1',      // 子分类（与文件夹名一致）
  index: 3                   // 图片索引（从1开始）
}
```

---

### **步骤4：验证配置**

#### **4.1 检查配置语法**

```javascript
// 常见检查项
✓ ID 是否唯一且连续
✓ imageRef.subcategory 是否与文件夹名匹配
✓ imageRef.index 是否正确
✓ 是否缺少逗号或括号
```

#### **4.2 运行验证脚本**

```bash
# 验证配置与 manifest 是否匹配
python scripts/validate-config.py

# 预期输出:
# ✓ materialTextureWorks: 50 items
# ✓ 所有 imageRef 都有效
# ✓ ID 连续无重复
# ✅ 验证通过！
```

---

### **步骤5：测试**

#### **5.1 启动开发服务器**

```bash
npm run dev
# 或
npm start
```

#### **5.2 浏览器测试**

访问对应的模块页面：
- Material & Texture: `http://localhost:3000/gallery/material-texture`
- Form & Structure: `http://localhost:3000/gallery/form-structure`
- Narrative Imagery: `http://localhost:3000/gallery/narrative-imagery`

#### **5.3 检查清单**

- [ ] ✅ 新作品在列表中显示
- [ ] ✅ 图片正确加载
- [ ] ✅ 标题、媒介信息正确
- [ ] ✅ 筛选功能正常工作
- [ ] ✅ 点击图片可以查看大图
- [ ] ✅ 控制台无错误

---

## 🎯 实战示例

### **示例1：添加一张新的板绘作品**

**场景：** 为 Material & Texture 模块的"板绘2"分类添加第5张图片

**步骤：**

```bash
# 1. 上传图片
copy my-artwork.png public\gallery\material-texture\板绘2\banhua-02-005.png

# 2. 更新 manifest
python scripts/scan-gallery.py --module material-texture

# 3. 编辑配置文件
# 打开: src/data/materialTextureWorks.js
```

```javascript
// 在 "板绘2" 分类的最后添加:
{
  id: 50,  // 假设之前最大ID是49
  title: '板绘·25',  // 板绘系列的第25个
  category: '板绘2',
  media: '板绘',
  year: '2024',
  imageRef: {
    module: MODULE_NAME,
    subcategory: '板绘2',
    index: 5  // 板绘2的第5张
  }
},
```

```bash
# 4. 验证
python scripts/validate-manifest.py

# 5. 测试
npm run dev
# 访问: http://localhost:3000/gallery/material-texture
```

---

### **示例2：添加新的子分类**

**场景：** 为 Material & Texture 添加新的"板绘6"分类

**步骤：**

```bash
# 1. 创建新文件夹
mkdir public\gallery\material-texture\板绘6

# 2. 上传图片到新文件夹
copy artwork1.png public\gallery\material-texture\板绘6\banhua-06-001.png
copy artwork2.png public\gallery\material-texture\板绘6\banhua-06-002.png

# 3. 更新 manifest
python scripts/scan-gallery.py

# 4. 更新 MEDIA_CATEGORIES
```

```javascript
// src/data/materialTextureWorks.js

export const MEDIA_CATEGORIES = {
  '板绘': ['板绘1', '板绘2', '板绘3', '板绘4', '板绘5', '板绘6'],  // ← 添加
  '水彩': ['水彩1', '水彩2'],
  '色粉': ['色粉1', '色粉2', '色粉3', '色粉4', '色粉5']
};

// 添加新作品配置
export const materialTextureWorks = [
  // ... 已有作品 ...
  
  // 板绘6 (2张)  ← 新分类
  {
    id: 50,
    title: '板绘·26',
    category: '板绘6',  // 新分类
    media: '板绘',
    year: '2024',
    imageRef: {
      module: MODULE_NAME,
      subcategory: '板绘6',  // 新分类
      index: 1
    }
  },
  {
    id: 51,
    title: '板绘·27',
    category: '板绘6',
    media: '板绘',
    year: '2024',
    imageRef: {
      module: MODULE_NAME,
      subcategory: '板绘6',
      index: 2
    }
  },
];
```

---

## ❓ 常见问题

### **Q1: 图片不显示怎么办？**

**检查步骤：**
1. 确认图片已上传到正确位置
2. 检查文件名是否与 manifest 一致
3. 验证 imageRef 的 index 是否正确
4. 查看浏览器控制台是否有404错误

```bash
# 验证图片路径
python scripts/validate-manifest.py --verbose
```

---

### **Q2: ID应该用什么数字？**

**推荐方案：**
```javascript
// 方法1：找到当前最大ID +1
// 假设最后一个作品是 id: 49
{ id: 50, ... }  // 新作品

// 方法2：按分类范围分配
// 板绘1: 1-2
// 板绘2: 3-6
// 板绘3: 7-... (预留空间)
```

---

### **Q3: 如何批量添加多个作品？**

**使用工具脚本：**

```python
# 创建批量添加脚本 (scripts/batch-add-works.py)
# 提供CSV或JSON输入，自动生成配置
python scripts/batch-add-works.py --input works.csv
```

或手动复制粘贴：
```javascript
// 模板
{
  id: XX,
  title: 'XXX',
  category: 'XXX',
  media: 'XXX',
  year: '2024',
  imageRef: { module: MODULE_NAME, subcategory: 'XXX', index: X }
},
```

---

### **Q4: 需要重启开发服务器吗？**

**是的！** 修改配置文件后需要重启：

```bash
# Ctrl+C 停止
# 然后重新运行
npm run dev
```

---

### **Q5: 怎么确保不出错？**

**最佳实践：**
1. ✅ 始终使用验证脚本
2. ✅ 一次只添加1-2个作品测试
3. ✅ 提交前在浏览器中测试
4. ✅ 使用 Git 版本控制

```bash
# Git 工作流程
git checkout -b add-new-works
# ... 添加作品 ...
git add .
git commit -m "feat: 添加3个新的板绘作品"
# 测试通过后
git push
```

---

## 🔗 相关资源

- [配置格式详解](./config-format.md) - imageRef 详细说明
- [工具使用参考](./tools-reference.md) - 脚本使用方法
- [迁移总览](./migration-overview.md) - 系统架构

---

## 💡 提示

- 📸 **图片优化：** 使用 [TinyPNG](https://tinypng.com/) 压缩图片
- 📝 **命名一致：** 确保文件名、分类名完全一致
- ✅ **勤验证：** 每次修改后都运行验证脚本
- 🔄 **小步迭代：** 一次添加少量作品，逐步验证

---

**最后更新：** 2026-02-02  
**维护者：** Gallery Team
