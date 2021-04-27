@echo off
echo ---
@REM SETTING CONSTANTS
set RUNBAT=C:\Users\%USERNAME%\Desktop\RunTDC.bat
set MONGO_BASE_PATH=C:\"Program Files"\MongoDB\Server

for /f %%f in ('DIR /ad /b %MONGO_BASE_PATH%') DO (
  set version=%%f
  goto mongoVersionSetter
)
:mongoVersionSetter
set MONGO_PATH=%MONGO_BASE_PATH%\%version%\bin\mongod.exe

set TDC_PATH=%~dp0
for %%i in ("%TDC_PATH%..") do (
  set CLIENT_PATH=%%~fi\TDC-client\
)

@REM START FILES
set TDC_START=%TDC_PATH%win-start.bat
set CLIENT_START=%CLIENT_PATH%win-start.bat

@REM INSTALLING PACKAGE DEPENDENCIES
cd %TDC_PATH%
echo Installing server dependencies
call npm cache clean --force
call npm install && npm run build
cd %CLIENT_PATH%
echo Installing client dependencies
call npm cache clean --force
call npm install --production

set REQUIRED_LIST=NodeJS NPM MongoDB
echo.
echo Please ensure are already installed on your system
for %%l in (%REQUIRED_LIST%) do (
  echo -	%%l
)

@REM CREATING RunTDC.bat
echo @echo off>%RUNBAT%
echo @title="TDC Server">>%RUNBAT%
echo set MONGO_PATH=%MONGO_PATH%>>%RUNBAT%
echo set TDC_START=%TDC_START%>>%RUNBAT%
echo set CLIENT_START=%CLIENT_START%>>%RUNBAT%
echo start call %MONGO_PATH%>>%RUNBAT%
echo echo Starting TDC..>>%RUNBAT%
echo start cmd /c "%TDC_START%">>%RUNBAT%
echo start cmd /c "%CLIENT_START%">>%RUNBAT%

echo.
echo RunTDC shortcut created in desktop
echo Simply double-click it
echo ---
pause
