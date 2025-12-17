@echo off
chcp 65001 >nul
title Git 一键推送脚本

echo ========================================
echo        Git 一键推送到 GitHub
echo ========================================
echo.

:: 切换到脚本所在目录
cd /d "%~dp0"

:: 显示当前状态
echo [1/4] 检查 Git 状态...
git status --short
echo.

:: 添加所有更改
echo [2/4] 添加所有更改...
git add -A
if %errorlevel% neq 0 (
    echo [错误] git add 失败！
    pause
    exit /b 1
)
echo √ 已添加所有更改
echo.

:: 获取提交信息
set /p commit_msg="请输入提交信息 (直接回车使用默认信息): "
if "%commit_msg%"=="" set commit_msg=更新: %date% %time:~0,8%

:: 提交更改
echo.
echo [3/4] 提交更改...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo [提示] 没有需要提交的更改，或提交失败
)
echo.

:: 推送到远程仓库
echo [4/4] 推送到 GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo [错误] 推送失败！请检查网络连接或认证信息
    pause
    exit /b 1
)

echo.
echo ========================================
echo        ✓ 推送成功！
echo ========================================
echo.
echo 仓库地址: https://github.com/LarryPatton/TYM
echo 部署状态: https://github.com/LarryPatton/TYM/actions
echo 网站地址: https://larrypatton.github.io/TYM/
echo.

pause
