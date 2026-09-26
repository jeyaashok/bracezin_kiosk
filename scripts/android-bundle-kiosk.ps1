$ErrorActionPreference = 'Stop'

function Test-JavaAvailable {
    try {
        $null = Get-Command java -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Resolve-JavaHome {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    $candidates = @(
        (Join-Path $repoRoot '.jdks\jdk21'),
        (Join-Path $repoRoot '.jdks\jdk17'),
        'C:\Program Files\Android\Android Studio\jbr',
        'C:\Program Files\Android\Android Studio\jre',
        'C:\Program Files\Java',
        'C:\Program Files\Eclipse Adoptium',
        'C:\Program Files\Microsoft'
    )

    foreach ($candidate in $candidates) {
        if (-not (Test-Path $candidate)) {
            continue
        }

        if (Test-Path (Join-Path $candidate 'bin\java.exe')) {
            return $candidate
        }

        $jdkDirs = Get-ChildItem -Path $candidate -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match 'jdk|jre|temurin' } |
            Sort-Object Name -Descending

        foreach ($dir in $jdkDirs) {
            $javaExe = Join-Path $dir.FullName 'bin\java.exe'
            if (Test-Path $javaExe) {
                return $dir.FullName
            }
        }
    }

    return $null
}

function Resolve-AndroidSdk {
    $candidates = @(
        $env:ANDROID_HOME,
        $env:ANDROID_SDK_ROOT,
        (Join-Path $env:LOCALAPPDATA 'Android\Sdk'),
        (Join-Path $env:APPDATA 'Android\Sdk'),
        'C:\Android\Sdk'
    ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

    foreach ($candidate in $candidates) {
        if (Test-Path (Join-Path $candidate 'platform-tools')) {
            return $candidate
        }
    }

    return $null
}

if ([string]::IsNullOrWhiteSpace($env:JAVA_HOME) -or -not (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    $resolvedJavaHome = Resolve-JavaHome
    if ($null -ne $resolvedJavaHome) {
        $env:JAVA_HOME = $resolvedJavaHome
        $env:Path = "$env:JAVA_HOME\bin;$env:Path"
        Write-Host "Using JAVA_HOME: $env:JAVA_HOME"
    }
}

if (-not (Test-JavaAvailable)) {
    Write-Error "Java was not found. Install JDK 17+ and set JAVA_HOME, then rerun npm run android:bundle:kiosk"
}

$resolvedSdk = Resolve-AndroidSdk
if ($null -eq $resolvedSdk) {
    Write-Error "Android SDK was not found. Install Android SDK and set ANDROID_HOME or ANDROID_SDK_ROOT, then rerun npm run android:bundle:kiosk"
}

$env:ANDROID_HOME = $resolvedSdk
$env:ANDROID_SDK_ROOT = $resolvedSdk
Write-Host "Using ANDROID_HOME: $resolvedSdk"

$repoRoot = Split-Path -Parent $PSScriptRoot
$localPropertiesPath = Join-Path $repoRoot 'android\local.properties'
$sdkDirValue = $resolvedSdk.Replace('\', '\\')
Set-Content -Path $localPropertiesPath -Value "sdk.dir=$sdkDirValue" -Encoding ascii

Push-Location 'android'
try {
    & .\gradlew.bat bundleRelease
}
finally {
    Pop-Location
}
