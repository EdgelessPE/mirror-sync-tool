@echo off
if not exist "C:\Pack_Test\_pack.7z" exit
"%ProgramFiles%\7-Zip\7z.exe" x "C:\Pack_Test\_pack.7z"  -y -aos -o"C:\Pack_Test\packs"
cd /d "C:\Pack_Test\packs"
dir /b "*.7z">pack_list.txt
for /f "usebackq delims==; tokens=*" %%i in ("pack_list.txt") do (
    "X:\Program Files\Edgeless\plugin_loader\load.cmd" "C:\Pack_Test\packs\%%i"
    echo «Î¥¶¿Ì%%i
    pause
    del /f /q "X:\Users\Default\Desktop\*.lnk"
)
pause