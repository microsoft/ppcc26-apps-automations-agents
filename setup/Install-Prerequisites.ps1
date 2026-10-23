<#
.SYNOPSIS
    Installs the PPCC26 workshop prerequisites: Git, Node.js LTS, the Power Platform
    app-builder skills, then signs in to Azure.

.EXAMPLE
    .\Install-Prerequisites.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

function Update-SessionPath {
    # winget installs update the registry PATH, not the current session's PATH.
    $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $user    = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$machine;$user"
}

function Install-WingetPackage {
    param([Parameter(Mandatory)][string]$Id)
    Write-Host "`n==> Installing $Id" -ForegroundColor Cyan
    winget install -e --id $Id --accept-source-agreements --accept-package-agreements
    # -1978335189 = APPINSTALLER_CLI_ERROR_UPDATE_NOT_APPLICABLE (already installed, no upgrade)
    if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne -1978335189) {
        throw "winget install $Id failed with exit code $LASTEXITCODE"
    }
    Update-SessionPath
}

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw 'winget is not available. Install "App Installer" from the Microsoft Store and retry.'
}

# 1. Git
Install-WingetPackage -Id 'Git.Git'

# 2. Node.js LTS
Install-WingetPackage -Id 'OpenJS.NodeJS.LTS'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'node was not found on PATH after install. Open a new PowerShell window and re-run this script.'
}

# 3. Power Platform app-builder skills
Write-Host "`n==> Installing app-builder (power-platform-skills)" -ForegroundColor Cyan
$installer = Join-Path $env:TEMP 'install.js'
try {
    Invoke-WebRequest 'https://raw.githubusercontent.com/microsoft/power-platform-skills/main/scripts/install.js' -OutFile $installer -UseBasicParsing
    node $installer
    if ($LASTEXITCODE -ne 0) { throw "app-builder install failed with exit code $LASTEXITCODE" }
}
finally {
    Remove-Item $installer -Force -ErrorAction SilentlyContinue
}

# 4. Azure sign-in (installs Azure CLI first if missing)
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Install-WingetPackage -Id 'Microsoft.AzureCLI'
}
Write-Host "`n==> Signing in to Azure" -ForegroundColor Cyan
az login
if ($LASTEXITCODE -ne 0) { throw "az login failed with exit code $LASTEXITCODE" }

Write-Host "`nAll prerequisites installed." -ForegroundColor Green
