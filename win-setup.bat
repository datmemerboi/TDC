@echo off
echo ---

echo @echo off > C:\Users\%USERNAME%\Desktop\RunTDC.bat
echo @title="TDC Server" >> C:\Users\%USERNAME%\Desktop\RunTDC.bat
echo echo Starting TDC.. >> C:\Users\%USERNAME%\Desktop\RunTDC.bat
echo cd %~dp0 >> C:\Users\%USERNAME%\Desktop\RunTDC.bat
echo npm start >> C:\Users\%USERNAME%\Desktop\RunTDC.bat

echo RunTDC shortcut created in desktop
echo Simply double-click it

npm install

echo ---
