@echo off
set DIR=C:\Pack_Test
if not exist "%DIR%\_pack.7z" exit
"%ProgramFiles%\7-Zip\7z.exe" x "%DIR%\_pack.7z"  -y -aos -o"%DIR%\packs"
cd /d "%DIR%\packs"
dir /b "*.7z">pack_list.txt
for /f "usebackq delims==; tokens=*" %%i in ("pack_list.txt") do (
    "X:\Program Files\Edgeless\plugin_loader\load.cmd" "%DIR%\packs\%%i"
    echo 请处理%%i
    pause
    del /f /q "X:\Users\Default\Desktop\*.lnk"
    pecmd LINK X:\Users\Default\Desktop\更多工具,%ProgramFiles%\Edgeless,,X:\Users\icon\shortcut\tools.ico,0
    pecmd LINK X:\Users\Default\Desktop\测试目录,"%DIR%"
)
pause