$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$iconsDirectory = Join-Path $projectRoot "icons"
New-Item -ItemType Directory -Force -Path $iconsDirectory | Out-Null

function New-RoundedRectanglePath([float]$size, [float]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $radius * 2
  $path.AddArc(0, 0, $diameter, $diameter, 180, 90)
  $path.AddArc($size - $diameter, 0, $diameter, $diameter, 270, 90)
  $path.AddArc($size - $diameter, $size - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc(0, $size - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

foreach ($size in @(16, 48, 128)) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $background = [System.Drawing.ColorTranslator]::FromHtml("#17151F")
  $border = [System.Drawing.ColorTranslator]::FromHtml("#4B465B")
  $accent = [System.Drawing.ColorTranslator]::FromHtml("#B7A1FF")
  $radius = [Math]::Max(3, $size * 0.22)
  $path = New-RoundedRectanglePath $size $radius
  $graphics.FillPath((New-Object System.Drawing.SolidBrush($background)), $path)

  if ($size -gt 16) {
    $graphics.DrawPath((New-Object System.Drawing.Pen($border, [Math]::Max(1, $size * 0.018))), $path)
  }

  $lineWidth = [Math]::Max(1.5, $size * 0.075)
  $nodeRadius = $size * 0.13
  $left = [System.Drawing.PointF]::new(
    [single]($size * 0.34),
    [single]($size * 0.34)
  )
  $right = [System.Drawing.PointF]::new(
    [single]($size * 0.66),
    [single]($size * 0.66)
  )
  $pen = New-Object System.Drawing.Pen($accent, $lineWidth)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($pen, $left, $right)
  $brush = New-Object System.Drawing.SolidBrush($accent)
  $graphics.FillEllipse($brush, $left.X - $nodeRadius, $left.Y - $nodeRadius, $nodeRadius * 2, $nodeRadius * 2)
  $graphics.FillEllipse($brush, $right.X - $nodeRadius, $right.Y - $nodeRadius, $nodeRadius * 2, $nodeRadius * 2)
  $inner = New-Object System.Drawing.SolidBrush($background)
  $innerRadius = $nodeRadius * 0.45
  $graphics.FillEllipse($inner, $left.X - $innerRadius, $left.Y - $innerRadius, $innerRadius * 2, $innerRadius * 2)
  $graphics.FillEllipse($inner, $right.X - $innerRadius, $right.Y - $innerRadius, $innerRadius * 2, $innerRadius * 2)

  $outputPath = Join-Path $iconsDirectory ("icon{0}.png" -f $size)
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $inner.Dispose()
  $brush.Dispose()
  $pen.Dispose()
  $path.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
