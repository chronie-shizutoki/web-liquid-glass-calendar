#!/bin/bash

# Check if cloc is installed
export PATH=$PATH:/usr/local/bin
if ! command -v cloc &> /dev/null; then
    echo "cloc is not installed. Please install it according to the following instructions:"
    echo ""
    echo "On macOS: brew install cloc"
    echo "On Ubuntu/Debian: sudo apt-get install cloc"
    echo "On CentOS/Fedora: sudo yum install cloc"
    echo "On Windows: choco install cloc or download from https://github.com/AlDanial/cloc/releases"
    echo ""
    echo "Please run this script again after installation."
    exit 1
fi

# Run cloc statistics
# Exclude directories like node_modules, dist, build, etc., and only count main code files
echo "Starting to count the number of code lines..."
echo ""

cloc . --exclude-dir=node_modules,dist,build,public,.vscode,scripts,.git,__tests__,__mocks__ --include-lang=JavaScript,TypeScript,JSX,TSX,CSS,HTML,JSON,Markdown

# Generate detailed reports
echo ""
echo "Generating detailed reports..."
mkdir -p reports
cloc . --exclude-dir=node_modules,dist,build,public,.vscode,scripts,.git,__tests__,__mocks__ --include-lang=JavaScript,TypeScript,JSX,TSX,CSS,HTML,JSON,Markdown --json > reports/cloc_report.json
cloc . --exclude-dir=node_modules,dist,build,public,.vscode,scripts,.git,__tests__,__mocks__ --include-lang=JavaScript,TypeScript,JSX,TSX,CSS,HTML,JSON,Markdown --report-file=reports/cloc_report.txt

echo ""
echo "Detailed reports have been saved to the reports/ directory"
echo "- reports/cloc_report.txt: Text format report"
echo "- reports/cloc_report.json: JSON format report"
