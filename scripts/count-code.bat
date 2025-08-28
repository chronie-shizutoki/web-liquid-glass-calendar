@echo off

REM Check if cloc is installed
cloc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo cloc is not installed. Please follow the instructions below to install it:
    echo.
    echo On Windows, it is recommended to use Chocolatey for installation:
    echo 1. Open Command Prompt as an administrator
    echo 2. Run: choco install cloc
    echo Or download it from GitHub: https://github.com/AlDanial/cloc/releases
    echo.
    echo Please run this script again after installation.
    pause
    exit /b 1
)

REM Run cloc to count code
REM Exclude directories like node_modules, dist, build, etc., and only count main code files
echo Starting to count code lines...
echo.

cloc . --exclude-dir=node_modules,dist,build,public,.vscode,scripts,.git,__tests__,__mocks__ --include-lang=JavaScript,TypeScript,JSX,TSX,CSS,HTML,JSON,Markdown

REM Generate detailed reports
echo.
echo Generating detailed reports...
mkdir reports 2>nul
cloc . --exclude-dir=node_modules,dist,build,public,.vscode,scripts,.git,__tests__,__mocks__ --include-lang=JavaScript,TypeScript,JSX,TSX,CSS,HTML,JSON,Markdown --json > reports\cloc_report.json 2>nul
cloc . --exclude-dir=node_modules,dist,build,public,.vscode,scripts,.git,__tests__,__mocks__ --include-lang=JavaScript,TypeScript,JSX,TSX,CSS,HTML,JSON,Markdown --report-file=reports\cloc_report.txt 2>nul

echo.
echo Detailed reports have been saved to the reports\ directory
echo - reports\cloc_report.txt: Text format report
echo - reports\cloc_report.json: JSON format report

pause