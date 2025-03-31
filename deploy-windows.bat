@echo off
setlocal enabledelayedexpansion

:: 發生錯誤時執行終止指令
set errorlevel=0

:: 確保在 main 分支上並且工作目錄是乾淨的
git checkout main
git status --porcelain > nul
if %errorlevel% neq 0 (
    echo Working directory is not clean. Please commit or stash your changes first.
    exit /b 1
)

:: 獲取當前版本號
for /f "tokens=*" %%a in ('node -p "require('./package.json').version"') do set VERSION=%%a

:: 獲取最後一位版本號並加1
for /f "tokens=1,2,3 delims=." %%a in ("%VERSION%") do (
    set MAJOR=%%a
    set MINOR=%%b
    set PATCH=%%c
)
set /a NEW_PATCH=%PATCH% + 1
set NEW_VERSION=%MAJOR%.%MINOR%.%NEW_PATCH%

:: 更新 package.json 中的版本號
powershell -Command "(Get-Content package.json) -replace '\"version\": \"%VERSION%\"', '\"version\": \"%NEW_VERSION%\"' | Set-Content package.json"

:: 提交版本更新
git add package.json
git commit -m "chore: bump version to %NEW_VERSION%"

:: 切換到 gh-pages 分支
git checkout -B gh-pages
git checkout .
git rebase main

:: 添加構建文件
:: 打包編譯
call pnpm run build
git add -f ./docs
git commit -m "chore: deploy version %NEW_VERSION%"

:: 強制推送到 gh-pages
git push -f origin gh-pages

:: 切回 main 分支並推送版本更新
git checkout main
git push origin main
git checkout .

echo Deployment completed successfully! 