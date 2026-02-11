@echo off
chcp 65001 >nul
title Git 一键推送脚本

echo ========================================
echo        Git 一键推送到 GitHub
echo ========================================
echo.

:: 切换到脚本所在目录
cd /d "%~dp0"

:: ========================================
:: 选择部署模式
:: ========================================
echo ----------------------------------------
echo          选择部署模式
echo ----------------------------------------
echo.
echo   [1] 调试模式
echo       图片不缓存，每次都加载最新内容
echo       适合开发调试阶段使用
echo.
echo   [2] 生产模式
echo       图片缓存1天，后台静默更新7天
echo       适合正式上线后使用
echo.
echo ----------------------------------------
echo.
set /p deploy_mode="请输入 1 或 2 (直接回车默认为1): "
if "%deploy_mode%"=="" set deploy_mode=1

if "%deploy_mode%"=="2" goto mode_prod
goto mode_debug

:mode_prod
echo.
echo [模式] 生产模式 - 图片缓存1天 + 后台更新7天
copy /Y vercel.prod.json vercel.json >nul
goto mode_done

:mode_debug
echo.
echo [模式] 调试模式 - 图片无缓存，每次验证最新
copy /Y vercel.debug.json vercel.json >nul
goto mode_done

:mode_done
echo.

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
if "%deploy_mode%"=="2" echo        推送成功！ 当前: 生产模式
if "%deploy_mode%"=="1" echo        推送成功！ 当前: 调试模式
echo ========================================
echo.
echo 仓库地址: https://github.com/LarryPatton/TYM
echo 部署状态: https://github.com/LarryPatton/TYM/actions
echo 网站地址: https://larrypatton.github.io/TYM/
echo.

pause