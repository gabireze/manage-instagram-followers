$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content (Join-Path $projectRoot "manifest.json") | ConvertFrom-Json
$distDirectory = Join-Path $projectRoot "dist"
$archivePath = Join-Path $distDirectory ("manage-instagram-followers-{0}.zip" -f $manifest.version)

New-Item -ItemType Directory -Force -Path $distDirectory | Out-Null
if (Test-Path -LiteralPath $archivePath) {
  Remove-Item -LiteralPath $archivePath -Force
}

$extensionFiles = @(
  "_locales",
  "background.js",
  "core.js",
  "html.js",
  "icons",
  "manifest.json",
  "script.js",
  "style.css",
  "tokens.css"
) | ForEach-Object { Join-Path $projectRoot $_ }

Compress-Archive -Path $extensionFiles -DestinationPath $archivePath -CompressionLevel Optimal
Write-Output $archivePath
