@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ==============================================================
:: Git 自动推送脚本
:: 功能：自动执行 git add、commit、push 流程
:: ==============================================================

echo.
echo ====================================
echo       Git 自动推送脚本
echo ====================================
echo.

:: 检查是否在 Git 仓库中
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [错误] 当前目录不是 Git 仓库！
    echo 请在 Git 仓库根目录下运行此脚本。
    pause
    exit /b 1
)

:: 显示当前状态
echo [步骤 1/4] 检查当前状态...
echo.
git status
echo.

:: 询问是否继续
set /p continue="是否继续推送？(Y/N): "
if /i not "%continue%"=="Y" (
    echo 已取消操作。
    pause
    exit /b 0
)

:: 添加所有更改
echo.
echo [步骤 2/4] 添加所有更改到暂存区...
git add .
if errorlevel 1 (
    echo [错误] git add 失败！
    pause
    exit /b 1
)
echo [成功] 文件已添加到暂存区。

:: 输入提交信息
echo.
echo [步骤 3/4] 输入提交信息...
set /p commit_msg="请输入提交信息 (默认: Update files): "
if "%commit_msg%"=="" set commit_msg=Update files

:: 提交更改
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo [提示] 没有需要提交的更改，或提交失败。
    echo 是否继续推送？(Y/N)
    set /p push_anyway=""
    if /i not "!push_anyway!"=="Y" (
        pause
        exit /b 1
    )
)
echo [成功] 提交完成。

:: 推送到远程仓库
echo.
echo [步骤 4/4] 推送到远程仓库...
git push origin master
if errorlevel 1 (
    echo.
    echo [错误] 推送失败！可能的原因：
    echo   1. 网络连接问题
    echo   2. 需要身份验证
    echo   3. 远程仓库有新的提交（需要先 pull）
    echo.
    echo 是否尝试强制推送？(不推荐，可能覆盖远程更改)
    set /p force_push="强制推送 (Y/N): "
    if /i "!force_push!"=="Y" (
        git push origin master --force
        if errorlevel 1 (
            echo [错误] 强制推送也失败了！
            pause
            exit /b 1
        )
    ) else (
        echo 建议先执行: git pull origin master
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo       推送成功！ ✓
echo ====================================
echo.
echo 所有更改已成功推送到 GitLab。
echo GitLab CI/CD 将自动开始构建和部署。
echo.
echo 查看 Pipeline 状态：
echo https://gitlab.nie.netease.com/ai_prompt/ai_prompt/-/pipelines
echo.

pause
