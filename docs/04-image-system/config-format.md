# 配置格式详解

> Gallery 作品配置的新旧格式对比与详细说明

---

## 📋 目录

- [格式对比](#格式对比)
- [imageRef 详解](#imageref-详解)
- [Manifest 格式](#manifest-格式)
- [配置文件结构](#配置文件结构)
- [最佳实践](#最佳实践)

---

## 🔄 格式对比

### **旧格式（硬编码）**

```javascript
// src/data/materialTextureWorks.js (Legacy)
export const materialTextureWorks = [
  {
    id: 1,
    title: '板绘·01',
    category: '板绘1',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘1/banhua-01-001.png',  // ❌ 硬编码路径
    aspectType: 'portrait'  // ❌ 手动维护
  },
  // ... 更多作品
];
```

**缺点：**
- ❌ 路径修改需要改每个配置
- ❌ 元数据（尺寸、aspect ratio）需手动维护
- ❌ 配置冗长，容易出错
- ❌ 扩展性差

---

### **新格式（imageRef 引用）**

```javascript
// src/data/materialTextureWorks.js (Modern)
const MODULE_NAME = 'material-texture';

export const materialTextureWorks = [
  {
    id: 1,
    title: '板绘·01',
    category: '板绘1',
    media: '板绘',
    year: '2023',
    imageRef: {  // ✅ 引用方式
      module: MODULE_NAME,
      subcategory: '板绘1',
      index: 1
    }
    // aspectType, width, height 自动从 manifest 获取
  },
  // ... 更多作品
];
```

**优点：**
- ✅ 路径集中管理
- ✅ 元数据自动获取
- ✅ 配置简洁清晰
- ✅ 易于扩展

---

## 🎯 imageRef 详解

### **结构定义**

```typescript
interface ImageRef {
  module: string;       // 模块名称
  subcategory: string;  // 子分类名称
  index: number;        // 图片索引（从1开始）
}
```

### **字段说明**

#### **1. module**
- **类型：** `string`
- **说明：** 模块标识符，对应 URL 路径和文件夹名
- **示例：** `'material-texture'`, `'form-structure'`, `'narrative-imagery'`

```javascript
// ✅ 正确
imageRef: {
  module: 'material-texture',
  // ...
}

// ❌ 错误：使用了驼峰命名
imageRef: {
  module: 'materialTexture',  // 错误！
  // ...
}
```

#### **2. subcategory**
- **类型：** `string`
- **说明：** 子分类名称，对应具体的作品系列
- **示例：** `'板绘1'`, `'写意人物'`, `'综合'`
- **注意：** 必须与文件夹名称完全匹配（包括中文字符）

```javascript
// ✅ 正确
imageRef: {
  module: 'material-texture',
  subcategory: '板绘1',  // 与文件夹名称一致
  // ...
}

// ❌ 错误：名称不匹配
imageRef: {
  module: 'material-texture',
  subcategory: 'banhua1',  // 文件夹是中文名
  // ...
}
```

#### **3. index**
- **类型：** `number`
- **说明：** 图片在子分类中的索引号，从 1 开始
- **示例：** `1`, `2`, `3`, ...
- **规则：** 必须连续，不能跳号

```javascript
// ✅ 正确
imageRef: { module: '...', subcategory: '...', index: 1 }
imageRef: { module: '...', subcategory: '...', index: 2 }
imageRef: { module: '...', subcategory: '...', index: 3 }

// ❌ 错误：跳号
imageRef: { module: '...', subcategory: '...', index: 1 }
imageRef: { module: '...', subcategory: '...', index: 3 }  // 缺少2
```

---

### **完整示例**

```javascript
// 案例1：Material & Texture 模块的第3个板绘作品
{
  id: 3,
  title: '板绘·03',
  category: '板绘2',
  media: '板绘',
  year: '2023',
  imageRef: {
    module: 'material-texture',
    subcategory: '板绘2',
    index: 1  // 板绘2分类的第1张
  }
}

// 案例2：Form & Structure 模块的写意人物
{
  id: 5,
  title: '写意人物·05',
  category: '写意人物',
  media: '国画',
  year: '2023',
  imageRef: {
    module: 'form-structure',
    subcategory: '写意人物',
    index: 5  // 写意人物的第5张
  }
}
```

---

## 📦 Manifest 格式

### **文件位置**
```
public/gallery-manifest.json
```

### **整体结构**

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-02-02T17:00:00+08:00",
  "modules": {
    "模块名1": { /* 模块数据 */ },
    "模块名2": { /* 模块数据 */ }
  }
}
```

### **模块结构**

```json
{
  "modules": {
    "material-texture": {
      "totalImages": 49,
      "subcategories": {
        "板绘1": {
          "count": 2,
          "files": [
            {
              "index": 1,
              "filename": "banhua-01-001.png",
              "path": "/gallery/material-texture/板绘1/banhua-01-001.png",
              "width": 1000,
              "height": 1400,
              "aspectRatio": "portrait"
            },
            {
              "index": 2,
              "filename": "banhua-01-002.png",
              "path": "/gallery/material-texture/板绘1/banhua-01-002.png",
              "width": 1000,
              "height": 1400,
              "aspectRatio": "portrait"
            }
          ]
        },
        "板绘2": {
          "count": 4,
          "files": [ /* ... */ ]
        }
      }
    }
  }
}
```

### **文件字段说明**

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `index` | number | 图片索引（从1开始） | `1` |
| `filename` | string | 文件名 | `"banhua-01-001.png"` |
| `path` | string | 完整路径 | `"/gallery/..."` |
| `width` | number | 图片宽度（像素） | `1000` |
| `height` | number | 图片高度（像素） | `1400` |
| `aspectRatio` | string | 比例类型 | `"portrait"` / `"landscape"` / `"square"` |

### **aspectRatio 判定规则**

```javascript
const ratio = height / width;

if (ratio > 1.1) {
  aspectRatio = 'portrait';   // 长图（竖版）
} else if (ratio < 0.9) {
  aspectRatio = 'landscape';  // 宽图（横版）
} else {
  aspectRatio = 'square';     // 正方形
}
```

---

## 📁 配置文件结构

### **完整模板**

```javascript
// Material & Texture 模块作品数据配置

// 模块名称常量
const MODULE_NAME = 'material-texture';

// 作品数据配置
export const materialTextureWorks = [
  // 板绘1 (2张)
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
  
  // 板绘2 (4张)
  {
    id: 3,
    title: '板绘·03',
    category: '板绘2',
    media: '板绘',
    year: '2023',
    imageRef: {
      module: MODULE_NAME,
      subcategory: '板绘2',
      index: 1
    }
  },
  // ... 更多作品
];

// 艺术媒介分类映射
export const MEDIA_CATEGORIES = {
  '板绘': ['板绘1', '板绘2', '板绘3', '板绘4', '板绘5'],
  '水彩': ['水彩1', '水彩2'],
  '色粉': ['色粉1', '色粉2', '色粉3', '色粉4', '色粉5']
};

// 反向映射：从细分类别获取主媒介
export const getCategoryMedia = (category) => {
  for (const [media, categories] of Object.entries(MEDIA_CATEGORIES)) {
    if (categories.includes(category)) {
      return media;
    }
  }
  return '其他';
};

// 获取所有媒介类型
export const getAllMediaTypes = () => {
  return Object.keys(MEDIA_CATEGORIES);
};

// 筛选作品
export const filterWorks = (works, mediaTypes, aspectType) => {
  return works.filter(work => {
    const mediaMatch = mediaTypes.includes(work.media);
    const aspectMatch = work.aspectType === aspectType;
    return mediaMatch && aspectMatch;
  });
};
```

---

## 🔄 运行时转换

### **WorkAdapter 工作流程**

```javascript
// 1. 读取配置文件
import { materialTextureWorks } from '../data/materialTextureWorks';

// 2. 使用 WorkAdapter 转换
import { enrichWorks } from '../utils/workAdapter';

const enrichedWorks = await enrichWorks(materialTextureWorks);

// 3. 转换结果
/*
{
  id: 1,
  title: '板绘·01',
  category: '板绘1',
  media: '板绘',
  year: '2023',
  imageRef: { module: 'material-texture', subcategory: '板绘1', index: 1 },
  // ⬇️ 以下字段由 WorkAdapter 自动添加
  image: '/gallery/material-texture/板绘1/banhua-01-001.png',
  aspectType: 'portrait',
  width: 1000,
  height: 1400
}
*/
```

---

## ✅ 最佳实践

### **1. 命名规范**

```javascript
// ✅ 推荐：使用常量
const MODULE_NAME = 'material-texture';

export const materialTextureWorks = [
  {
    imageRef: {
      module: MODULE_NAME,  // 使用常量
      subcategory: '板绘1',
      index: 1
    }
  }
];

// ❌ 不推荐：硬编码字符串
export const materialTextureWorks = [
  {
    imageRef: {
      module: 'material-texture',  // 容易拼写错误
      subcategory: '板绘1',
      index: 1
    }
  }
];
```

### **2. ID 编号规则**

```javascript
// ✅ 推荐：连续编号，按分类分组
export const works = [
  // 板绘1 (id: 1-2)
  { id: 1, category: '板绘1', ... },
  { id: 2, category: '板绘1', ... },
  
  // 板绘2 (id: 3-6)
  { id: 3, category: '板绘2', ... },
  { id: 4, category: '板绘2', ... },
  { id: 5, category: '板绘2', ... },
  { id: 6, category: '板绘2', ... },
];

// ❌ 不推荐：随机编号
export const works = [
  { id: 101, category: '板绘1', ... },
  { id: 205, category: '板绘1', ... },
  { id: 37, category: '板绘2', ... },
];
```

### **3. 注释规范**

```javascript
export const works = [
  // 板绘1 (2张)  // ✅ 标明分类和数量
  { id: 1, ... },
  { id: 2, ... },
  
  // 板绘2 (4张)
  { id: 3, ... },
  { id: 4, ... },
  { id: 5, ... },
  { id: 6, ... },
];
```

### **4. 验证检查**

```javascript
// 使用验证脚本确保配置正确
// python scripts/validate-manifest.py

// 检查项：
// ✓ imageRef 的 module 是否存在
// ✓ imageRef 的 subcategory 是否存在
// ✓ imageRef 的 index 是否在有效范围
// ✓ ID 是否连续且唯一
```

---

## 🚫 常见错误

### **错误1：模块名称不匹配**

```javascript
// ❌ 错误
imageRef: {
  module: 'materialTexture',  // 应该是 'material-texture'
  // ...
}

// ✅ 正确
imageRef: {
  module: 'material-texture',
  // ...
}
```

### **错误2：索引从0开始**

```javascript
// ❌ 错误
imageRef: {
  module: 'material-texture',
  subcategory: '板绘1',
  index: 0  // 应该从1开始
}

// ✅ 正确
imageRef: {
  module: 'material-texture',
  subcategory: '板绘1',
  index: 1
}
```

### **错误3：子分类名称拼写错误**

```javascript
// ❌ 错误
imageRef: {
  module: 'material-texture',
  subcategory: '版绘1',  // 应该是'板绘1'
  index: 1
}

// ✅ 正确
imageRef: {
  module: 'material-texture',
  subcategory: '板绘1',
  index: 1
}
```

---

## 🔗 相关资源

- [添加新作品指南](./adding-new-works.md) - 如何添加新配置
- [工具使用参考](./tools-reference.md) - 验证和转换工具
- [迁移总览](./migration-overview.md) - 完整迁移过程

---

**最后更新：** 2026-02-02  
**维护者：** Gallery Team
