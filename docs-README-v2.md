# 📚 项目文档导航 v2.0

本目录包含项目的全部技术文档，采用**功能模块分类**的组织结构。根据您的需求选择合适的文档：

---

## 🗂️ 文档目录结构

### 🚀 [01-getting-started](./01-getting-started/) - 快速开始
新手必读，环境搭建和部署相关

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [DEVELOPMENT.md](./01-getting-started/DEVELOPMENT.md) | 开发环境配置、本地调试 | 新加入的开发者 |
| [DEPLOYMENT.md](./01-getting-started/DEPLOYMENT.md) | 通用部署流程、构建配置 | DevOps、部署人员 |
| [VERCEL-DEPLOYMENT.md](./01-getting-started/VERCEL-DEPLOYMENT.md) | Vercel 专项部署指南 | 使用 Vercel 的团队 |

---

### 🏗️ [02-architecture](./02-architecture/) - 系统架构
项目设计、技术栈和架构相关

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [ARCHITECTURE.md](./02-architecture/ARCHITECTURE.md) | 项目架构、技术栈、设计理念 | 架构师、技术 Leader |
| [COMPONENTS.md](./02-architecture/COMPONENTS.md) | 组件库文档、设计规范 | 前端开发者、设计师 |
| [new-config-design.md](./02-architecture/new-config-design.md) | 新配置系统设计方案 | 系统设计者 |

---

### 📝 [03-content-management](./03-content-management/) - 内容管理
文案、翻译和内容维护相关

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [I18N-GUIDE.md](./03-content-management/I18N-GUIDE.md) | ⭐ **国际化内容维护指南** | **内容编辑、翻译人员** |
| [文案URL对应关系说明.md](./03-content-management/文案URL对应关系说明.md) | ⭐ **文案-页面对应关系** | **内容维护人员** |

---

### 🖼️ [04-image-system](./04-image-system/) - 图片系统
图片处理、压缩和配置管理

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [README.md](./04-image-system/README.md) | 图片系统总览和导航 | 所有图片相关工作人员 |
| [IMAGE-COMPRESSION.md](./04-image-system/IMAGE-COMPRESSION.md) | ⭐ **图片压缩工具使用指南** | **所有处理图片的人员** |
| [BEST-PRACTICES.md](./04-image-system/BEST-PRACTICES.md) | ⭐ **图片处理最佳实践** | **必读！避免踩坑** |
| [adding-new-works.md](./04-image-system/adding-new-works.md) | 🆕 添加新作品流程 | 内容添加人员 |
| [config-format.md](./04-image-system/config-format.md) | Gallery 配置格式说明 | 技术人员 |
| [migration-overview.md](./04-image-system/migration-overview.md) | 系统迁移总览 | 项目历史了解 |
| [rollback-guide.md](./04-image-system/rollback-guide.md) | 回滚操作指南 | 系统维护人员 |

---

### 🛠️ [05-tools-scripts](./05-tools-scripts/) - 工具脚本
自动化工具和脚本使用

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| scripts-reference.md | 🔄 脚本使用参考（待创建） | 开发者、维护人员 |
| compression-tools.md | 🔄 压缩工具详细说明（待创建） | 图片处理人员 |
| automation-guide.md | 🔄 自动化工作流指南（待创建） | DevOps |

---

### 🔧 [06-troubleshooting](./06-troubleshooting/) - 故障排查
问题排查和错误处理

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| common-issues.md | 🔄 常见问题和解决方案（待创建） | 所有用户 |
| error-codes.md | 🔄 错误代码参考（待创建） | 开发者 |
| recovery-procedures.md | 🔄 数据恢复程序（待创建） | 系统管理员 |

---

### 📦 [99-archives](./99-archives/) - 归档文件
历史文档、分析报告和日志

| 文件 | 说明 | 状态 |
|------|------|------|
| config-analysis-report.md | 配置分析报告 | 归档 |
| image-analysis-module*.json | 历史图片分析数据 | 归档 |
| migration-logs/ | 迁移操作日志 | 归档 |

---

### 📋 [templates](./templates/) - 模板文件
标准化模板和示例

| 模板 | 用途 | 使用场景 |
|------|------|---------|
| new-component-template.md | 🔄 新组件文档模板（待创建） | 创建组件文档时 |
| documentation-template.md | 🔄 通用文档模板（待创建） | 编写新文档时 |
| csv-translation-template.csv | 🔄 翻译CSV模板（待创建） | 添加新翻译时 |

---

## 🔥 重点推荐

### 如果您要处理图片...

**务必先阅读这两份文档**：

1. **[IMAGE-COMPRESSION.md](./04-image-system/IMAGE-COMPRESSION.md)** 
   - 📦 如何正确压缩图片
   - 🛡️ 如何保留 PNG 透明通道
   - 🔧 压缩工具使用方法
   - ⚠️ 常见问题排查

2. **[BEST-PRACTICES.md](./04-image-system/BEST-PRACTICES.md)**
   - 💡 图片处理最佳实践
   - ⚠️ 常见错误与陷阱
   - 🔍 故障排查流程
   - 🛠️ 工具链推荐

> **⚠️ 重要警告**：不正确的压缩工具会破坏 PNG 透明通道！请务必使用项目提供的脚本。

### 如果您要维护文案...

**推荐阅读顺序**：

1. **[文案URL对应关系说明.md](./03-content-management/文案URL对应关系说明.md)** - 了解文案与页面的对应关系
2. **[I18N-GUIDE.md](./03-content-management/I18N-GUIDE.md)** - 学习具体的编辑和构建流程

---

## 📖 按角色查找文档

### 👨‍💻 前端开发者

**建议阅读顺序**：
1. [01-getting-started/DEVELOPMENT.md](./01-getting-started/DEVELOPMENT.md) - 环境配置
2. [02-architecture/ARCHITECTURE.md](./02-architecture/ARCHITECTURE.md) - 项目结构
3. [02-architecture/COMPONENTS.md](./02-architecture/COMPONENTS.md) - 组件使用
4. [04-image-system/](./04-image-system/) - 图片系统（重要！）

### 🎨 设计师 & 内容编辑

**建议阅读顺序**：
1. [03-content-management/文案URL对应关系说明.md](./03-content-management/文案URL对应关系说明.md) - 文案维护
2. [04-image-system/adding-new-works.md](./04-image-system/adding-new-works.md) - 添加作品
3. [04-image-system/IMAGE-COMPRESSION.md](./04-image-system/IMAGE-COMPRESSION.md) - 图片处理
4. [04-image-system/BEST-PRACTICES.md](./04-image-system/BEST-PRACTICES.md) - 避免踩坑

### 🚀 DevOps / 部署人员

**建议阅读顺序**：
1. [01-getting-started/DEPLOYMENT.md](./01-getting-started/DEPLOYMENT.md) - 通用部署
2. [01-getting-started/VERCEL-DEPLOYMENT.md](./01-getting-started/VERCEL-DEPLOYMENT.md) - Vercel 部署
3. [02-architecture/ARCHITECTURE.md](./02-architecture/ARCHITECTURE.md) - 技术栈了解
4. [05-tools-scripts/](./05-tools-scripts/) - 自动化工具

### 🆕 新成员

**建议阅读顺序**：
1. 本文档 (README.md) - 了解整体结构
2. [01-getting-started/](./01-getting-started/) - 环境搭建
3. [02-architecture/ARCHITECTURE.md](./02-architecture/ARCHITECTURE.md) - 项目架构
4. 根据角色选择对应的专业文档

---

## 🔧 常见任务快速导航

### 任务：添加新的艺术作品

1. 阅读 [添加新作品指南](./04-image-system/adding-new-works.md)
2. 上传图片到 `public/gallery/{module}/{subcategory}/`
3. 运行 `python scripts/scan-gallery.py`
4. 编辑对应的配置文件（`src/data/*Works.js`）
5. 测试浏览器显示

### 任务：更新网站文案

1. 阅读 [文案URL对应关系说明](./03-content-management/文案URL对应关系说明.md)
2. 编辑对应的 CSV 文件
3. 运行 `i18n-build.bat`
4. 刷新浏览器验证效果

### 任务：压缩图片

1. 阅读 [IMAGE-COMPRESSION.md](./04-image-system/IMAGE-COMPRESSION.md)
2. 运行 `compress-fast.bat`
3. 验证透明通道 `python scripts/detect-transparent-loss.py`

### 任务：部署到生产环境

1. 阅读 [DEPLOYMENT.md](./01-getting-started/DEPLOYMENT.md)
2. 如使用 Vercel，参考 [VERCEL-DEPLOYMENT.md](./01-getting-started/VERCEL-DEPLOYMENT.md)
3. 确认环境变量和构建配置

---

## 📝 文档维护状态

### 完成度统计

| 模块 | 完成度 | 最后更新 | 状态 |
|------|--------|----------|------|
| **01-getting-started** | ✅ 100% | 2026-02-02 | 完整 |
| **02-architecture** | ✅ 100% | 2026-02-02 | 完整 |
| **03-content-management** | ✅ 100% | 2026-02-03 | 完整 |
| **04-image-system** | ✅ 100% | 2026-02-02 | 完整 |
| **05-tools-scripts** | 🔄 30% | - | 待完善 |
| **06-troubleshooting** | 🔄 10% | - | 待创建 |
| **templates** | 🔄 0% | - | 待创建 |

### 文档版本历史

- **v2.0** (2026-02-03) - 重构目录结构，按功能模块分类
- **v1.1** (2026-02-02) - 新增图片配置系统完整文档
- **v1.0** - 初始文档体系

---

## 🆘 获取帮助

### 文档未解决问题？

1. **搜索对应模块** - 在相关功能模块目录下查找
2. **查看归档文件** - `99-archives/` 可能有历史解决方案
3. **查看代码注释** - 很多复杂逻辑都有详细注释
4. **询问团队成员** - 快速获得帮助
5. **创建新 Issue** - 记录问题，帮助改进文档

### 紧急问题快速索引

- **图片透明通道丢失** → [04-image-system/BEST-PRACTICES.md](./04-image-system/BEST-PRACTICES.md)
- **部署失败** → [01-getting-started/DEPLOYMENT.md](./01-getting-started/DEPLOYMENT.md)
- **环境配置问题** → [01-getting-started/DEVELOPMENT.md](./01-getting-started/DEVELOPMENT.md)
- **文案更新问题** → [03-content-management/](./03-content-management/)

---

## 🔗 外部资源

- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Pillow (Python 图片处理)](https://pillow.readthedocs.io/)

---

**文档维护**: 项目团队  
**最后更新**: 2026-02-03  
**文档版本**: v2.0 - 重构目录结构，按功能模块分类