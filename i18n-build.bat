@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo           国际化文案构建工具
echo ==========================================
echo.
echo 正在构建翻译文件...
echo.

npm run i18n:build

if %errorlevel% equ 0 (
    echo.
    echo ✅ 构建成功！
    echo    - 已更新 src/locales/zh/translation.json
    echo    - 已更新 src/locales/en/translation.json
    echo.
    echo 💡 提示：请刷新浏览器查看最新文案效果
    echo.
) else (
    echo.
    echo ❌ 构建失败！请检查：
    echo    1. CSV 文件格式是否正确
    echo    2. 是否包含特殊字符需要双引号包裹
    echo    3. 文件编码是否为 UTF-8
    echo.
)

echo 按任意键退出...
pause >nul