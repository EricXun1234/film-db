@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if not errorlevel 1 (
  node preview.cjs
  pause
  exit /b
)
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" preview.cjs
  pause
  exit /b
)
echo Node.js was not found. Install Node.js or deploy this folder to your test website.
pause
