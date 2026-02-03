# 📚 项目文档导航

本目录包含项目的全部技术文档。根据您的需求选择合适的文档：

---

## 🗂️ 文档分类

### 🚀 快速开始

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 开发指南、环境配置 | 新加入的开发者 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 部署流程、构建配置 | DevOps、部署人员 |
| [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md) | Vercel 专项部署指南 | 使用 Vercel 的团队 |

### 🏗️ 架构与组件

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 项目架构、技术栈、设计理念 | 架构师、技术 Leader |
| [COMPONENTS.md](./COMPONENTS.md) | 组件库文档、使用示例 | 前端开发者 |
| [I18N-GUIDE.md](./I18N-GUIDE.md) | 国际化配置、翻译管理 | 前端开发者、翻译人员 |

### 🎨 资源处理

| 文档 | 用途 | 适合人群 |
|------|------|---------|
| [IMAGE-COMPRESSION.md](./IMAGE-COMPRESSION.md) | ⭐ **图片压缩工具使用指南** | **所有处理图片的人员** |
| [BEST-PRACTICES.md](./BEST-PRACTICES.md) | ⭐ **图片处理最佳实践** | **必读！避免踩坑** |
| [**图片配置系统 →**](./image-config-system/) | 🆕 **Gallery 配置管理完整文档** | **添加作品、配置维护** |

---

## 🔥 重点推荐

### 如果您要处理图片...

**务必先阅读这两份文档**：

1. **[IMAGE-COMPRESSION.md](./IMAGE-COMPRESSION.md)** 
   - 📦 如何正确压缩图片
   - 🛡️ 如何保留 PNG 透明通道
   - 🔧 压缩工具使用方法
   - ⚠️ 常见问题排查

2. **[BEST-PRACTICES.md](./BEST-PRACTICES.md)**
   - 💡 图片处理最佳实践
   - ⚠️ 常见错误与陷阱
   - 🔍 故障排查流程
   - 🛠️ 工具链推荐

> **⚠️ 重要警告**：不正确的压缩工具会破坏 PNG 透明通道！请务必使用项目提供的脚本。

---

## 📖 按角色查找文档

### 👨‍💻 前端开发者

1. [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发环境配置
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - 了解项目结构
3. [COMPONENTS.md](./COMPONENTS.md) - 组件使用手册
4. [I18N-GUIDE.md](./I18N-GUIDE.md) - 多语言支持
5. [IMAGE-COMPRESSION.md](./IMAGE-COMPRESSION.md) - 图片资源处理
6. [image-config-system/](./image-config-system/) - Gallery 配置系统

### 🎨 设计师

1. [IMAGE-COMPRESSION.md](./IMAGE-COMPRESSION.md) - 导出图片后如何压缩
2. [BEST-PRACTICES.md](./BEST-PRACTICES.md) - PNG 透明通道保护
3. [image-config-system/adding-new-works.md](./image-config-system/adding-new-works.md) - 添加新作品
4. [COMPONENTS.md](./COMPONENTS.md) - 设计规范参考

### 🚀 DevOps / 部署人员

1. [DEPLOYMENT.md](./DEPLOYMENT.md) - 通用部署流程
2. [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md) - Vercel 专项指南
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - 技术栈了解

### 🆕 新成员

**建议阅读顺序**：

1. [DEVELOPMENT.md](./DEVELOPMENT.md) - 环境搭建
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - 项目架构
3. [COMPONENTS.md](./COMPONENTS.md) - 组件使用
4. [IMAGE-COMPRESSION.md](./IMAGE-COMPRESSION.md) + [BEST-PRACTICES.md](./BEST-PRACTICES.md) - 图片处理（重要！）

---

## 🔧 常见任务快速导航

### 任务：添加新的艺术作品

1. 阅读 [添加新作品指南](./image-config-system/adding-new-works.md)
2. 上传图片到 `public/gallery/{module}/{subcategory}/`
3. 运行 `python scripts/scan-gallery.py`
4. 编辑对应的配置文件（`src/data/*Works.js`）
5. 测试浏览器显示

### 任务：压缩图片

1. 阅读 [IMAGE-COMPRESSION.md](./IMAGE-COMPRESSION.md)
2. 运行 `compress-fast.bat`
3. 验证透明通道 `python scripts/detect-transparent-loss.py`

### 任务：添加新语言

1. 阅读 [I18N-GUIDE.md](./I18N-GUIDE.md)
2. 添加翻译文件 `public/locales/{language}/`
3. 更新语言配置

### 任务：创建新组件

1. 参考 [COMPONENTS.md](./COMPONENTS.md) 组件规范
2. 查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 项目结构
3. 按照 [DEVELOPMENT.md](./DEVELOPMENT.md) 开发流程

### 任务：部署到生产环境

1. 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md)
2. 如使用 Vercel，参考 [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)
3. 确认环境变量和构建配置

---

## 📝 文档维护

### 更新频率

| 文档 | 更新频率 | 最后更新 |
|------|---------|---------|
| DEVELOPMENT.md | 按需 | - |
| ARCHITECTURE.md | 重大变更时 | - |
| COMPONENTS.md | 新增组件时 | - |
| I18N-GUIDE.md | 按需 | - |
| IMAGE-COMPRESSION.md | ⭐ 已更新 | 2026-01-30 |
| BEST-PRACTICES.md | ⭐ 新增 | 2026-01-30 |
| **image-config-system/** | 🆕 **新增完整文档** | **2026-02-02** |
| DEPLOYMENT.md | 按需 | - |
| VERCEL-DEPLOYMENT.md | 按需 | - |

### 贡献指南

如果您发现文档问题或有改进建议：

1. 直接编辑对应的 `.md` 文件
2. 提交 Pull Request
3. 描述您的修改内容

---

## 🆘 获取帮助

### 文档未解决问题？

1. **搜索已有 Issue** - 可能有人遇到过同样问题
2. **查看代码注释** - 很多复杂逻辑都有详细注释
3. **询问团队成员** - 快速获得帮助
4. **创建新 Issue** - 记录问题，帮助改进文档

### 紧急问题

- **图片透明通道丢失** → 立即查看 [BEST-PRACTICES.md](./BEST-PRACTICES.md)
- **部署失败** → 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
- **环境配置问题** → 查看 [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## 🔗 外部资源

- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Pillow (Python 图片处理)](https://pillow.readthedocs.io/)

---

**文档维护**: 项目团队  
**最后更新**: 2026-02-02  
**文档版本**: v2.1 - 新增图片配置系统完整文档
