# Platforms to build
$platforms = @('code', 'enterprise', 'server', 'candidate', 'campus', 'meet', 'main')

# Initialize selected platforms (0 for unselected, 1 for selected)
$selected = @()

foreach ($platform in $platforms) {
    $selected += 0  # Initialize all platforms as unselected
}

# Function to display platforms with checkboxes
function Show-Platforms {
    Clear-Host
    Write-Host "Select platforms to build (Press the corresponding number to toggle, Spacebar to select/deselect, 'Enter' to start building):"
    Write-Host "=============================================="
    for ($i = 0; $i -lt $platforms.Length; $i++) {
        $checkbox = if ($selected[$i] -eq 1) { "[X]" } else { "[ ]" }
        Write-Host "$checkbox $($platforms[$i])"
    }
}

# Input loop for selecting/deselecting platforms
$done = $false
while (-not $done) {
    Show-Platforms

    $key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

    if ($key.VirtualKeyCode -eq 13) {  # Enter key
        $done = $true
    }
    elseif ($key.VirtualKeyCode -eq 32) {  # Spacebar
        $choice = Read-Host "Enter platform number to toggle"
        if ($choice -ge 1 -and $choice -le $platforms.Length) {
            $index = $choice - 1
            # Toggle the selection
            $selected[$index] = if ($selected[$index] -eq 0) { 1 } else { 0 }
        }
    }
}

# Start Build Process
$startTime = Get-Date
$current = 0

Write-Host "==============================================="
Write-Host "               BUILD PROCESS STARTED           "
Write-Host "==============================================="
Write-Host ""

# Loop through selected platforms and build them
for ($i = 0; $i -lt $platforms.Length; $i++) {
    if ($selected[$i] -eq 1) {
        $current++
        Write-Host "Building $($platforms[$i])..."

        Push-Location "..\$($platforms[$i])"
        try {
            # Assuming you have npm available, uncomment below if necessary
            # npm install > $null 2>&1
            npm run build
            if ($?) {
                Write-Host "[SUCCESS] Built $($platforms[$i]) successfully!"
            } else {
                Write-Host "[ERROR] Build failed for $($platforms[$i])"
                Pop-Location
                exit 1
            }
        } catch {
            Write-Host "[ERROR] Error occurred while building $($platforms[$i]): $_"
            Pop-Location
            exit 1
        }

        Pop-Location
    }
}

# Calculate duration
$endTime = Get-Date
$duration = $endTime - $startTime

# Success footer
Write-Host "==============================================="
Write-Host "               BUILD PROCESS COMPLETE           "
Write-Host "==============================================="
Write-Host ""
Write-Host "Build duration: $($duration.TotalSeconds) seconds"
