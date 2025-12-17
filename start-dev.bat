@echo off
chcp 65001 >nul
echo ========================================
echo   React Template Showcase - Dev Server
echo   Port: 7845
echo ========================================
echo.
echo 正在启动开发服务器...
echo 访问地址: http://localhost:7845
echo.
npm run dev -- --port 7845
pause
