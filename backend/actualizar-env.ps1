# Script para agregar DB_HOST_IPV6 al .env

$envFile = ".env"
$ipv6Line = "DB_HOST_IPV6=2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207"

Write-Host "Actualizando archivo .env..." -ForegroundColor Yellow

if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    
    # Verificar si ya existe
    if ($content -match "DB_HOST_IPV6") {
        Write-Host "DB_HOST_IPV6 ya existe en .env" -ForegroundColor Yellow
        Write-Host "Actualizando valor..." -ForegroundColor Gray
        $content = $content -replace "DB_HOST_IPV6=.*", $ipv6Line
    } else {
        Write-Host "Agregando DB_HOST_IPV6..." -ForegroundColor Green
        $content += "`n# IP IPv6 directa para evitar problemas de DNS`n"
        $content += "$ipv6Line`n"
    }
    
    Set-Content -Path $envFile -Value $content -NoNewline
    Write-Host "✅ Archivo .env actualizado" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ahora prueba:" -ForegroundColor Yellow
    Write-Host "  npm run start:dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ No se encontro el archivo .env" -ForegroundColor Red
    Write-Host "   Crea el archivo .env primero" -ForegroundColor Yellow
}

