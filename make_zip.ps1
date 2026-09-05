# ============================================================
#  make_zip.ps1 — Create the Mini-Trello source code archive
# ------------------------------------------------------------
#  Produces: Mini-Trello-Source.zip in the same folder as this
#  script. Excludes heavy/generated folders (node_modules,
#  dist, .git, .env) per submission requirements.
# ============================================================

param(
    [string]$OutputName = "Mini-Trello-Source"
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$zip  = Join-Path $root "$OutputName.zip"
$tmp  = Join-Path $env:TEMP "mini-trello-archive_$([guid]::NewGuid().ToString('N'))"

# Files/folders to exclude from the archive
$exclude = @(
    "node_modules",
    "dist",
    "build",
    ".git",
    ".env",
    ".kombai",
    "*.zip",
    "Thumbs.db",
    ".DS_Store"
)

Write-Host "Preparing archive in $tmp ..."

# Clean any existing zip
if (Test-Path $zip) { Remove-Item -LiteralPath $zip -Force }

if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
    $items = Get-ChildItem -LiteralPath $root -Force |
        Where-Object {
            $_.Name -notin $exclude -and $_.Name -notlike ".env"
        } |
        ForEach-Object { $_.FullName }

    Compress-Archive -Path $items -DestinationPath $zip -CompressionLevel Optimal
    Write-Host "Created: $zip"
} else {
    Write-Host "Compress-Archive not available. Falling back to tar..."
    # Build an include list via tar (available on Windows 10+)
    $args = @("-a", "-c", "-f", $zip)
    $items = Get-ChildItem -LiteralPath $root -Force |
        Where-Object { $_.Name -notin $exclude -and $_.Name -notlike ".env" } |
        ForEach-Object { $_.Name }
    foreach ($i in $items) { $args += $i }
    Push-Location $root
    try { & tar $args } finally { Pop-Location }
    Write-Host "Created: $zip"
}

Write-Host "Done."
