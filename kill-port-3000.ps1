# Kill process on port 3000
$port = 3000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    foreach ($pid in $processes) {
        Write-Host "Killing process $pid on port $port..."
        Stop-Process -Id $pid -Force
        Write-Host "Process $pid terminated."
    }
} else {
    Write-Host "No process found on port $port"
}

