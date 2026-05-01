# keep-awake.ps1
# Prevents Windows from sleeping or turning off the display while running.
# Press Ctrl+C to release.
#
# Run from PowerShell:
#   pwsh ./scripts/keep-awake.ps1
# or PowerShell ISE / Windows PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\scripts\keep-awake.ps1

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public static class PowerHelper {
    [DllImport("kernel32.dll")]
    public static extern uint SetThreadExecutionState(uint esFlags);
    public const uint ES_CONTINUOUS       = 0x80000000;
    public const uint ES_SYSTEM_REQUIRED  = 0x00000001;
    public const uint ES_DISPLAY_REQUIRED = 0x00000002;
}
"@

$flags = [PowerHelper]::ES_CONTINUOUS `
    -bor [PowerHelper]::ES_SYSTEM_REQUIRED `
    -bor [PowerHelper]::ES_DISPLAY_REQUIRED

$result = [PowerHelper]::SetThreadExecutionState($flags)
if ($result -eq 0) {
    Write-Error "SetThreadExecutionState failed."
    exit 1
}

Write-Host "Sleep prevention active. System and display will stay on while this script runs."
Write-Host "Press Ctrl+C to release and restore normal sleep behavior."
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 60
        Write-Host -NoNewline "."
    }
}
finally {
    [PowerHelper]::SetThreadExecutionState([PowerHelper]::ES_CONTINUOUS) | Out-Null
    Write-Host ""
    Write-Host "Sleep prevention released."
}
