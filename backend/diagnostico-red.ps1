# Script de diagnostico de red
# Ayuda a identificar problemas de conectividad

Write-Host "=== DIAGNOSTICO DE RED ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar conectividad basica
Write-Host "1. Verificando conectividad basica..." -ForegroundColor Yellow
$testHost = "db.hofhdghzixrryzxelbfb.supabase.co"

# DNS local
Write-Host "   a) Resolucion DNS local:" -ForegroundColor Gray
try {
    $localDns = Resolve-DnsName -Name $testHost -ErrorAction Stop
    Write-Host "      OK: DNS local funciona" -ForegroundColor Green
    $localDns | Where-Object { $_.Type -eq "AAAA" } | ForEach-Object {
        Write-Host "         IPv6: $($_.IPAddress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "      ERROR: DNS local no puede resolver" -ForegroundColor Red
    Write-Host "         Mensaje: $_" -ForegroundColor Gray
}

# DNS publico (8.8.8.8)
Write-Host "   b) Resolucion DNS publico (8.8.8.8):" -ForegroundColor Gray
try {
    $publicDns = nslookup $testHost 8.8.8.8 2>&1 | Select-String -Pattern "Address"
    if ($publicDns) {
        Write-Host "      OK: DNS publico puede resolver" -ForegroundColor Green
        $publicDns | ForEach-Object {
            Write-Host "         $_" -ForegroundColor Gray
        }
    } else {
        Write-Host "      ERROR: DNS publico no puede resolver" -ForegroundColor Red
    }
} catch {
    Write-Host "      ERROR: No se pudo consultar DNS publico" -ForegroundColor Red
}

Write-Host ""

# 2. Verificar conectividad TCP/IP
Write-Host "2. Verificando conectividad TCP/IP..." -ForegroundColor Yellow
$testPort = 6543
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $result = $tcpClient.BeginConnect($testHost, $testPort, $null, $null)
    $wait = $result.AsyncWaitHandle.WaitOne(5000, $false)
    if ($wait) {
        $tcpClient.EndConnect($result)
        Write-Host "   OK: Puerto $testPort es accesible" -ForegroundColor Green
        $tcpClient.Close()
    } else {
        Write-Host "   TIMEOUT: Puerto $testPort no responde (puede estar bloqueado por firewall)" -ForegroundColor Red
        $tcpClient.Close()
    }
} catch {
    Write-Host "   ERROR: No se puede conectar al puerto $testPort" -ForegroundColor Red
    Write-Host "         Mensaje: $_" -ForegroundColor Gray
}

Write-Host ""

# 3. Verificar configuracion de red
Write-Host "3. Configuracion de red actual:" -ForegroundColor Yellow
$adapter = Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1
if ($adapter) {
    Write-Host "   Adaptador: $($adapter.Name)" -ForegroundColor Gray
    $dnsConfig = Get-DnsClientServerAddress -InterfaceAlias $adapter.Name -AddressFamily IPv4
    if ($dnsConfig.ServerAddresses) {
        Write-Host "   DNS IPv4 configurado: $($dnsConfig.ServerAddresses -join ', ')" -ForegroundColor Gray
    } else {
        Write-Host "   DNS IPv4: Automatico (puede ser el problema)" -ForegroundColor Yellow
    }
}

Write-Host ""

# 4. Verificar proxy
Write-Host "4. Verificando configuracion de proxy..." -ForegroundColor Yellow
$proxy = [System.Net.WebRequest]::GetSystemWebProxy()
$proxyUrl = $proxy.GetProxy("https://$testHost")
if ($proxyUrl -ne "https://$testHost") {
    Write-Host "   ADVERTENCIA: Proxy detectado: $proxyUrl" -ForegroundColor Yellow
    Write-Host "   Esto puede estar bloqueando la conexion" -ForegroundColor Yellow
} else {
    Write-Host "   OK: No hay proxy configurado" -ForegroundColor Green
}

Write-Host ""

# 5. Verificar acceso web a Supabase
Write-Host "5. Verificando acceso web a Supabase..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://supabase.com" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   OK: Puedes acceder a supabase.com" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: No puedes acceder a supabase.com" -ForegroundColor Red
    Write-Host "         La red puede estar bloqueando Supabase" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si el DNS publico funciona pero el local no:" -ForegroundColor Yellow
Write-Host "  -> La red tiene restricciones de DNS" -ForegroundColor Gray
Write-Host ""
Write-Host "Si el puerto no responde:" -ForegroundColor Yellow
Write-Host "  -> Firewall o proxy bloqueando conexiones salientes" -ForegroundColor Gray
Write-Host ""
Write-Host "Si hay proxy configurado:" -ForegroundColor Yellow
Write-Host "  -> Necesitas configurar Node.js para usar el proxy" -ForegroundColor Gray

