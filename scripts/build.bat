@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: Enable virtual terminal processing for colors
for /f "tokens=*" %%a in ('echo prompt $e^| cmd') do set "ESC=%%a"
set "GREEN=%ESC%[32m"
set "CYAN=%ESC%[36m"
set "YELLOW=%ESC%[33m"
set "RED=%ESC%[31m"
set "RESET=%ESC%[0m"

:: Apps to build
set "apps=("..\\code" "..\\meet" "..\\main" "..\\enterprise" "..\\candidate" "..\\campus" "..\\server")"

cls
echo %CYAN%===============================================
echo               BUILD PROCESS STARTED               
echo ===============================================%RESET%
echo.

:: Initialize counters
set /a current=0
set /a total=0
for %%a in %apps% do set /a total+=1

:: Track start time
set "startTime=%time%"

for %%a in %apps% do (
    set /a current+=1
    set /a percent=current*100/total
    
    echo %YELLOW%[%time%] Building %%~nxa...%RESET%
    
    :: Progress bar using simple characters
    set "progressBar="
    set "spaces="
    for /l %%i in (1,1,50) do (
        if %%i leq !percent! (
            set "progressBar=!progressBar!#"
        ) else (
            set "spaces=!spaces!-"
        )
    )
    
    echo %CYAN%[!progressBar!!spaces!] !percent!%%%RESET%
    
    pushd %%~a
    
    :: Run npm install
    echo %YELLOW%Installing dependencies...%RESET%
    call npm install >nul 2>&1
    
    :: Run build
    call npm run build
    if errorlevel 1 (
        echo %RED%[ERROR] Build failed for %%~nxa%RESET%
        echo %RED%===============================================
        echo               BUILD PROCESS FAILED               
        echo ===============================================%RESET%
        popd
        exit /b 1
    )
    
    echo %GREEN%[SUCCESS] Built %%~nxa successfully!%RESET%
    echo.
    popd
)

:: Calculate duration
set "endTime=%time%"
set /a "duration=(%endTime:~0,2%-%startTime:~0,2%)*3600 + (%endTime:~3,2%-%startTime:~3,2%)*60 + (%endTime:~6,2%-%startTime:~6,2%)"

:: Success footer
echo %GREEN%===============================================
echo               BUILD PROCESS COMPLETE               
echo ===============================================
echo.
echo Total apps: %total%
echo Build duration: %duration% seconds%RESET%

ENDLOCAL