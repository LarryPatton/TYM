@echo off
chcp 65001 >nul
title 快速图片压缩工具

cd /d "%~dp0"

echo.
echo ============================================
echo    Python 快速批量图片压缩
echo ============================================
echo.
echo 说明：
echo - 只压缩大于 1MB 的图片
echo - JPG 质量 85%%，PNG 质量 90%%
echo - 使用 10 个并发线程处理
echo.
echo ============================================
echo.

python scripts/compress-images-fast.py

if %errorlevel% neq 0 (
    echo.
    echo [错误] 脚本执行失败！
    echo.
    echo 可能原因：
    echo 1. 未安装 Python 3
    echo 2. 未安装 Pillow 库
    echo.
    echo 解决方法：
    echo   pip install Pillow
    echo.
    pause
    exit /b 1
)

echo.
pause
