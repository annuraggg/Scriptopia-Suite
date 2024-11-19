# Load required assemblies for GUI
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Platforms to build
$platforms = @("code", "enterprise", "server", "candidate", "campus", "meet", "main")

# Create Form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Select Platforms to Build"
$form.Size = New-Object System.Drawing.Size(400, 300)
$form.StartPosition = "CenterScreen"

# Create CheckedListBox
$checkedListBox = New-Object System.Windows.Forms.CheckedListBox
$checkedListBox.Size = New-Object System.Drawing.Size(350, 200)
$checkedListBox.Location = New-Object System.Drawing.Point(15, 15)
$checkedListBox.Items.AddRange($platforms)

# Add OK Button
$okButton = New-Object System.Windows.Forms.Button
$okButton.Text = "Build"
$okButton.Location = New-Object System.Drawing.Point(150, 230)
$okButton.Add_Click({
    $global:SelectedPlatforms = $checkedListBox.CheckedItems
    $form.Close()
})

# Add controls to the form
$form.Controls.Add($checkedListBox)
$form.Controls.Add($okButton)

# Show the form
$form.ShowDialog()

# Process the selected platforms
if (-not $global:SelectedPlatforms) {
    Write-Host "No platforms selected. Exiting..." -ForegroundColor Red
    exit 1
}

Write-Host "Selected Platforms:" -ForegroundColor Cyan
$global:SelectedPlatforms | ForEach-Object { Write-Host "- $_" }

# Start Build Process
$startTime = Get-Date

foreach ($platform in $global:SelectedPlatforms) {
    Write-Host "Building $platform..." -ForegroundColor Yellow

    # Navigate to the platform folder
    $platformPath = "..\$platform"
    if (-not (Test-Path $platformPath)) {
        Write-Host "[ERROR] Folder $platformPath does not exist. Skipping..." -ForegroundColor Red
        continue
    }

    Push-Location $platformPath

    # Run npm build
    try {
        & npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed for $platform."
        }
        Write-Host "[SUCCESS] Built $platform successfully!" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] $_" -ForegroundColor Red
        Pop-Location
        exit 1
    }

    Pop-Location
}

# Calculate and display build duration
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "===============================================" -ForegroundColor Green
Write-Host "BUILD PROCESS COMPLETE" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "Build duration: $($duration.TotalSeconds) seconds" -ForegroundColor Green
