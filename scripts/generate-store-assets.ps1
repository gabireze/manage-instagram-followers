$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot "store-assets"
$screenshotsDirectory = Join-Path $outputDirectory "screenshots"
$sourcePath = Join-Path $screenshotsDirectory "source.html"
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

if (-not (Test-Path -LiteralPath $chromePath)) {
  throw "Google Chrome was not found at $chromePath"
}

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
New-Item -ItemType Directory -Force -Path $screenshotsDirectory | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "icons\icon128.png") -Destination (Join-Path $outputDirectory "icon-128-transparent.png") -Force

$sourceUrl = ([uri]$sourcePath).AbsoluteUri
$names = @(
  "01-brand-overview.png",
  "02-find-non-followers.png",
  "03-connection-filters.png",
  "04-safe-unfollow.png",
  "05-privacy-languages.png"
)

for ($index = 0; $index -lt $names.Count; $index += 1) {
  $outputPath = Join-Path $screenshotsDirectory $names[$index]
  & $chromePath `
    --headless=new `
    --disable-gpu `
    --hide-scrollbars `
    --force-device-scale-factor=1 `
    --window-size=1280,800 `
    --screenshot=$outputPath `
    "${sourceUrl}?slide=$($index + 1)" | Out-Null

  $sourceBitmap = [System.Drawing.Bitmap]::FromFile($outputPath)
  try {
    if ($sourceBitmap.Width -ne 1280 -or $sourceBitmap.Height -ne 800) {
      throw "Unexpected screenshot dimensions for $($names[$index]): $($sourceBitmap.Width)x$($sourceBitmap.Height)"
    }
    $rgbBitmap = New-Object System.Drawing.Bitmap(1280, 800, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb))
    $graphics = [System.Drawing.Graphics]::FromImage($rgbBitmap)
    try {
      $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml("#0d0b14"))
      $graphics.DrawImageUnscaled($sourceBitmap, 0, 0)
      $temporaryPath = "$outputPath.rgb.png"
      $rgbBitmap.Save($temporaryPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $rgbBitmap.Dispose()
    }
  } finally {
    $sourceBitmap.Dispose()
  }
  Move-Item -LiteralPath $temporaryPath -Destination $outputPath -Force
}

Write-Output $outputDirectory
