@echo off
chcp 65001 >nul
title 图片压缩GUI工具

cd /d "%~dp0"

echo.
echo ============================================
echo    图片压缩GUI工具
echo ============================================
echo.
echo 正在启动图形界面...
echo.

python scripts/compress-images-gui.py

if %errorlevel% neq 0 (
    echo.
    echo [错误] 程序启动失败！
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
