# 配置迁移回滚方案

生成时间：2026-02-02 17:20  
目的：提供快速恢复机制，确保出现问题时可以立即回滚

---

## 🚨 什么时候需要回滚？

如果遇到以下情况，建议立即回滚：

1. **图片无法加载** - 大量图片显示错误或空白
2. **控制台出现大量错误** - imageRef 转换失败
3. **页面性能问题** - 加载时间过长或卡顿
4. **功能异常** - 筛选、排序等功能不正常工作

---

## ⚡ 一键回滚命令

### **Windows (CMD):**

```cmd
cd E:\ZPJ
copy /Y src\data\materialTextureWorks.js.backup src\data\materialTextureWorks.js
copy /Y src\data\formStructureWorks.js.backup src\data\formStructureWorks.js
copy /Y src\data\narrativeImageryWorks.js.backup src\data\narrativeImageryWorks.js
git checkout src/pages/GalleryModule.jsx
```

### **一键执行脚本（推荐）:**

保存以下内容为 `rollback.bat`：

```batch
@echo off
echo ========================================
echo  配置迁移回滚工具
echo ========================================
echo.

cd /d E:\ZPJ

echo [1/4] 恢复 materialTextureWorks.js...
copy /Y src\data\materialTextureWorks.js.backup src\data\materialTextureWorks.js > nul
if %ERRORLEVEL% EQU 0 (echo      ✓ 成功) else (echo      ✗ 失败)

echo [2/4] 恢复 formStructureWorks.js...
copy /Y src\data\formStructureWorks.js.backup src\data\formStructureWorks.js > nul
if %ERRORLEVEL% EQU 0 (echo      ✓ 成功) else (echo      ✗ 失败)

echo [3/4] 恢复 narrativeImageryWorks.js...
copy /Y src\data\narrativeImageryWorks.js.backup src\data\narrativeImageryWorks.js > nul
if %ERRORLEVEL% EQU 0 (echo      ✓ 成功) else (echo      ✗ 失败)

echo [4/4] 恢复 GalleryModule.jsx...
git checkout src/pages/GalleryModule.jsx > nul 2>&1
if %ERRORLEVEL% EQU 0 (echo      ✓ 成功) else (echo      ✗ 失败 或 无Git历史记录)

echo.
echo ========================================
echo  回滚完成！
echo ========================================
echo.
echo 请刷新浏览器以查看效果
pause
```

**使用方法：** 双击 `rollback.bat` 即可

---

## 📋 分步回滚指南

如果需要逐步回滚或只回滚部分文件：

### **步骤1：恢复配置文件**

```cmd
# 只恢复 material-texture 模块
copy /Y src\data\materialTextureWorks.js.backup src\data\materialTextureWorks.js

# 只恢复 form-structure 模块
copy /Y src\data\formStructureWorks.js.backup src\data\formStructureWorks.js

# 只恢复 narrative-imagery 模块
copy /Y src\data\narrativeImageryWorks.js.backup src\data\narrativeImageryWorks.js
```

### **步骤2：恢复组件文件**

```cmd
# 方法1：使用Git恢复（如果已提交）
git checkout src/pages/GalleryModule.jsx

# 方法2：手动移除 workAdapter 相关代码
# 删除以下导入：
#   import { enrichWorks } from '../utils/workAdapter';
# 删除 enrichedWorks 和 loading 相关代码
# 将 filteredWorks 改回使用 allWorks
```

### **步骤3：验证恢复**

1. 重启开发服务器
2. 访问 `/gallery/material-texture`
3. 检查图片是否正常显示
4. 检查控制台是否无错误

---

## 🔍 验证回滚是否成功

### **检查配置文件格式：**

```cmd
# 检查是否包含 imageRef（新格式）还是 image（旧格式）
findstr /N "imageRef\|image:" src\data\materialTextureWorks.js | more
```

**预期结果（回滚成功）：** 应该看到 `image:` 而不是 `imageRef`

### **检查组件导入：**

```cmd
findstr /N "workAdapter" src\pages\GalleryModule.jsx
```

**预期结果（回滚成功）：** 应该找不到任何结果

---

## 📊 文件对比工具

### **对比配置文件变化：**

```cmd
# 使用 fc 命令对比
fc src\data\materialTextureWorks.js src\data\materialTextureWorks.js.backup
```

### **使用 Git 查看变更：**

```cmd
git diff src/data/materialTextureWorks.js
git diff src/pages/GalleryModule.jsx
```

---

## 🛡️ 预防措施（下次迁移前）

1. **创建 Git 提交：**
   ```cmd
   git add .
   git commit -m "backup: 迁移前的配置文件备份"
   ```

2. **创建时间戳备份：**
   ```cmd
   xcopy src\data src\data\backups\2026-02-02\ /E /I /Y
   ```

3. **导出当前数据库/配置**（如适用）

---

## ⚠️ 常见问题

### **Q1: 回滚后仍然有问题？**

**A:** 尝试清除浏览器缓存和 localStorage：
```javascript
// 在浏览器控制台执行
localStorage.clear();
location.reload(true);
```

### **Q2: 备份文件丢失了怎么办？**

**A:** 使用 Git 历史恢复：
```cmd
git log --oneline src/data/materialTextureWorks.js
git checkout <commit-hash> -- src/data/materialTextureWorks.js
```

### **Q3: 只想回滚一个模块？**

**A:** 单独恢复该模块的配置文件即可：
```cmd
copy /Y src\data\materialTextureWorks.js.backup src\data\materialTextureWorks.js
```

组件代码会自动兼容新旧格式（向后兼容设计）

---

## 📞 紧急联系

如果回滚后仍有问题，请：

1. 检查控制台完整错误信息
2. 查看 Network 标签中的图片加载情况
3. 确认 `gallery-manifest.json` 文件完整性
4. 重新运行验证脚本：
   ```cmd
   python scripts/validate-manifest.py
   ```

---

## ✅ 回滚检查清单

使用此清单确保回滚完整：

- [ ] 所有3个配置文件已恢复 (.backup → .js)
- [ ] GalleryModule.jsx 已恢复
- [ ] 开发服务器已重启
- [ ] 浏览器缓存已清除
- [ ] 访问 /gallery/material-texture 图片正常
- [ ] 访问 /gallery/form-structure 图片正常
- [ ] 访问 /gallery/narrative-imagery 图片正常
- [ ] 控制台无错误
- [ ] 筛选功能正常工作
- [ ] 图片查看器正常工作

---

**文档生成时间：** 2026-02-02 17:20  
**最后更新：** 2026-02-02 17:20  
**适用版本：** 全面迁移方案 v1.0
