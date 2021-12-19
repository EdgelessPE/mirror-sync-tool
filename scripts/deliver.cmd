cd /d "D:\Download"
7z a _pack.7z *.7z -mx1

cd "D:\Desktop\Projects\EdgelessPE\mirror-sync-tool\scripts"
pwsh -File .\Stop_VM.ps1
start "D:\CnoRPS\chfsgui.exe"
pwsh -File .\Start_VM.ps1
exit