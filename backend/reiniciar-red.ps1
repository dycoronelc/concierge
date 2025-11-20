# Script para reiniciar adaptadores de red
# Debe ejecutarse como Administrador

Write-Host "🔄 Reiniciando adaptadores de red..." -ForegroundColor Yellow
Write-Host ""

# Obtener adaptadores activos
$adapters = Get-NetAdapter | Where-Object Status -eq "Up"

if ($adapters.Count -eq 0) {
    Write-Host "❌ No se encontraron adaptadores activos." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Adaptadores encontrados:" -ForegroundColor Cyan
$adapters | ForEach-Object {
    Write-Host "   - $($_.Name) ($($_.InterfaceDescription))" -ForegroundColor Gray
}
Write-Host ""

# Reiniciar cada adaptador
$adapters | ForEach-Object {
    Write-Host "🔄 Reiniciando $($_.Name)..." -ForegroundColor Yellow
    try {
        Restart-NetAdapter -Name $_.Name -Confirm:$false
        Write-Host "   ✅ $($_.Name) reiniciado" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "   ❌ Error al reiniciar $($_.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Proceso completado. Espera 10 segundos y prueba la conexión:" -ForegroundColor Green
Write-Host "   node test-connection-pooler.js" -ForegroundColor Cyan

