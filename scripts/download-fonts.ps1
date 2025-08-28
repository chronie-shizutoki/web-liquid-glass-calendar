# Download Google Fonts locally

# Set the font directory
$baseDir = "d:\web-liquid-glass-calendar\src\assets\fonts"

# Create a function to download fonts
function Download-Font($fontName, $fontUrl, $fontDir) {
    Write-Host "Downloading $fontName font..."
    
    # Create the font directory if it doesn't exist
    if (-not (Test-Path $fontDir)) {
        New-Item -ItemType Directory -Path $fontDir | Out-Null
    }
    
    # Download the font CSS file
    $cssPath = Join-Path $fontDir "$fontName.css"
    Invoke-WebRequest -Uri $fontUrl -OutFile $cssPath
    
    # Extract font file URLs from the CSS file and download them
    $cssContent = Get-Content $cssPath -Raw
    $fontUrls = [regex]::Matches($cssContent, 'url\(([^\)]+)\)') | ForEach-Object { $_.Groups[1].Value -replace '"', '' }
    
    foreach ($url in $fontUrls) {
        if ($url -match 'http') {
            $fileName = [System.IO.Path]::GetFileName($url)
            $filePath = Join-Path $fontDir $fileName
            Write-Host "  Downloading $fileName..."
            Invoke-WebRequest -Uri $url -OutFile $filePath
        }
    }
    
    Write-Host "$fontName font download completed!"
    Write-Host ""
}

# Download Cormorant Garamond font
Download-Font "cormorant-garamond" "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700" (Join-Path $baseDir "cormorant-garamond")

# Download EB Garamond font
Download-Font "eb-garamond" "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800" (Join-Path $baseDir "eb-garamond")

# Download Noto Serif SC font
Download-Font "noto-serif-sc" "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900" (Join-Path $baseDir "noto-serif-sc")

# Download Noto Serif TC font
Download-Font "noto-serif-tc" "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@200..900" (Join-Path $baseDir "noto-serif-tc")

# Download Noto Serif JP font
Download-Font "noto-serif-jp" "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200..900" (Join-Path $baseDir "noto-serif-jp")

# Download Playfair Display font
Download-Font "playfair-display" "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900" (Join-Path $baseDir "playfair-display")

Write-Host "All fonts downloaded!"
