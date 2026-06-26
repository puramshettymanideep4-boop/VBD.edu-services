# MongoDB Portable Setup + Extract Script
$mongoZip = "$env:USERPROFILE\mongodb.zip"
$mongoDir = "$env:USERPROFILE\mongodb"

Write-Host "[1/2] Extracting MongoDB ZIP..."
if (Test-Path $mongoZip) {
    Expand-Archive -Path $mongoZip -DestinationPath "$env:USERPROFILE\mongodb-temp" -Force
    # Move the inner folder contents up
    $inner = Get-ChildItem "$env:USERPROFILE\mongodb-temp" | Select-Object -First 1
    if ($inner) {
        Get-ChildItem $inner.FullName | Move-Item -Destination $mongoDir -Force
    }
    Remove-Item "$env:USERPROFILE\mongodb-temp" -Recurse -Force
    Remove-Item $mongoZip -Force
    Write-Host "[2/2] MongoDB extracted to $mongoDir"
    Write-Host ""
    Write-Host "✅ MongoDB is ready! Now run: start.bat"
} else {
    Write-Host "[ERROR] mongodb.zip not found at $mongoZip"
    Write-Host "Download may still be in progress."
}
