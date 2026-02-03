# 图片配置系统文档

> Gallery 图片路径管理的 imageRef 引用系统

---

## 📚 文档导航

### 🎯 快速开始
- **[添加新作品指南](./adding-new-works.md)** - 如何添加新的艺术作品
- **[配置格式说明](./config-format.md)** - 新旧格式对比与详解

### 📖 深入了解
- **[迁移项目总览](./migration-overview.md)** - 完整迁移过程与成果
- **[工具使用参考](./tools-reference.md)** - 自动化工具使用指南

### 🆘 故障排查
- **[回滚操作指南](./rollback-guide.md)** - 如何安全地回滚到旧版本

---

## 🚀 系统概览

### **核心理念**
将硬编码的图片路径改为**引用式管理**，通过 `gallery-manifest.json` 集中管理所有图片元数据。

### **关键优势**

| 优势 | 说明 |
|------|------|
| 🎯 **集中管理** | 一处修改，全局生效 |
| 📦 **元数据丰富** | 自动获取图片尺寸、aspect ratio |
| 🔧 **维护简便** | 减少 60% 维护成本 |
| 🔄 **向后兼容** | 新旧格式可共存 |

---

## 🏗️ 架构图

```
配置文件 (*.js)                   Manifest (JSON)
┌─────────────────┐              ┌──────────────────┐
│ imageRef: {     │              │ "modules": {     │
│   module: "...", │  ────引用──→ │   "module": {    │
│   subcategory   │              │     files: [...]  │
│   index         │              │   }              │
│ }               │              │ }                │
└─────────────────┘              └──────────────────┘
         │                                │
         └────── WorkAdapter ─────────────┘
                     ↓
           实际图片路径 + 元数据
```

---

## 📊 迁移状态

| 模块 | 作品数 | 状态 |
|------|--------|------|
| Material & Texture | 49个 | ✅ 已完成 |
| Form & Structure | 39个 | ✅ 已完成 |
| Narrative Imagery | 46个 | ✅ 已完成 |
| **总计** | **134个** | **100%** |

**迁移日期：** 2026-02-02  
**测试状态：** ✅ 全部通过

---

## 🔗 相关资源

### 核心文件
- `public/gallery-manifest.json` - 图片索引数据库
- `src/utils/workAdapter.js` - 路径转换适配器
- `src/data/*Works.js` - 作品配置文件

### 工具脚本
- `scripts/generate-new-configs.py` - 批量生成配置
- `scripts/scan-gallery.py` - 扫描图片生成 manifest
- `scripts/validate-manifest.py` - 验证 manifest 完整性

---

## 💡 快速示例

### 旧格式（硬编码）
```javascript
{
  id: 1,
  title: '板绘·01',
  image: '/gallery/material-texture/板绘1/banhua-01-001.png',
  aspectType: 'portrait'
}
```

### 新格式（引用式）
```javascript
{
  id: 1,
  title: '板绘·01',
  imageRef: {
    module: 'material-texture',
    subcategory: '板绘1',
    index: 1
  }
  // aspectType 自动从 manifest 获取
}
```

---

## 🤝 贡献指南

在修改配置前，请务必：
1. ✅ 阅读 [配置格式说明](./config-format.md)
2. ✅ 使用提供的工具脚本
3. ✅ 运行验证脚本确保无误
4. ✅ 测试所有受影响的页面

---

## 📞 获取帮助

- 📖 先查阅本文档系统
- 🔍 搜索已有的问题和解决方案
- 💬 在团队频道询问

---

**最后更新：** 2026-02-02  
**维护者：** Gallery Team
