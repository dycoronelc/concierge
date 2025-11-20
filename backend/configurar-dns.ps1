# Script para configurar DNS de Windows
# DEBE ejecutarse como Administrador

Write-Host "Configurando DNS de Windows..." -ForegroundColor Yellow
Write-Host ""

# Verificar si se ejecuta como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    Write-Host "   Clic derecho en PowerShell > Ejecutar como administrador" -ForegroundColor Yellow
    exit 1
}

# Obtener adaptador activo
$adapter = Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1

if (-not $adapter) {
    Write-Host "ERROR: No se encontro ningun adaptador de red activo" -ForegroundColor Red
    exit 1
}

Write-Host "Adaptador seleccionado: $($adapter.Name)" -ForegroundColor Cyan
Write-Host "   Descripcion: $($adapter.InterfaceDescription)" -ForegroundColor Gray
Write-Host ""

# Configurar DNS IPv4
Write-Host "Configurando DNS IPv4 (8.8.8.8, 1.1.1.1)..." -ForegroundColor Yellow
try {
    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses "8.8.8.8","1.1.1.1"
    Write-Host "   OK: DNS IPv4 configurado" -ForegroundColor Green
} catch {
    Write-Host "   ERROR al configurar DNS IPv4: $_" -ForegroundColor Red
    exit 1
}

# Configurar DNS IPv6
Write-Host "Configurando DNS IPv6 (2001:4860:4860::8888, 2606:4700:4700::1111)..." -ForegroundColor Yellow
try {
    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses "2001:4860:4860::8888","2606:4700:4700::1111" -AddressFamily IPv6
    Write-Host "   OK: DNS IPv6 configurado" -ForegroundColor Green
} catch {
    Write-Host "   ADVERTENCIA al configurar DNS IPv6: $_" -ForegroundColor Yellow
    Write-Host "   (Puede que IPv6 no este habilitado, pero no es critico)" -ForegroundColor Gray
}

Write-Host ""

# Reiniciar adaptador
Write-Host "Reiniciando adaptador de red..." -ForegroundColor Yellow
try {
    Restart-NetAdapter -Name $adapter.Name -Confirm:$false
    Write-Host "   OK: Adaptador reiniciado" -ForegroundColor Green
    Write-Host "   Esperando 5 segundos para que se estabilice..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
} catch {
    Write-Host "   ERROR al reiniciar adaptador: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Configuracion completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Verificando resolucion DNS..." -ForegroundColor Yellow

# Verificar DNS
$testHost = "db.hofhdghzixrryzxelbfb.supabase.co"
try {
    $result = Resolve-DnsName -Name $testHost -ErrorAction Stop
    Write-Host "   OK: DNS funciona correctamente!" -ForegroundColor Green
    Write-Host "   Host resuelto:" -ForegroundColor Cyan
    $result | Where-Object { $_.Type -eq "AAAA" } | ForEach-Object {
        Write-Host "      IPv6: $($_.IPAddress)" -ForegroundColor Gray
    }
    $result | Where-Object { $_.Type -eq "A" } | ForEach-Object {
        Write-Host "      IPv4: $($_.IPAddress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ADVERTENCIA: Aun no se puede resolver (puede tardar unos segundos mas)" -ForegroundColor Yellow
    Write-Host "   Prueba ejecutar: nslookup $testHost" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Prueba la conexion: cd backend; node test-connection-pooler.js" -ForegroundColor White
Write-Host "   2. Si funciona, inicia el backend: npm run start:dev" -ForegroundColor White
