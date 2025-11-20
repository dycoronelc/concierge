# Configurar DNS de Windows para resolver Supabase

## Problema
El DNS local de Windows no puede resolver `db.hofhdghzixrryzxelbfb.supabase.co`, aunque el DNS público (8.8.8.8) sí puede.

## Solución: Cambiar DNS de Windows

### Opción 1: Cambiar DNS del adaptador de red (Recomendado)

1. **Abre Configuración de Red:**
   - Presiona `Win + R`
   - Escribe: `ncpa.cpl` y presiona Enter

2. **Selecciona tu adaptador activo:**
   - Clic derecho > Propiedades

3. **Selecciona "Protocolo de Internet versión 4 (TCP/IPv4)":**
   - Clic en "Propiedades"

4. **Selecciona "Usar las siguientes direcciones de servidor DNS":**
   - DNS preferido: `8.8.8.8`
   - DNS alternativo: `1.1.1.1`
   - Aceptar

5. **También para IPv6:**
   - Selecciona "Protocolo de Internet versión 6 (TCP/IPv6)"
   - Clic en "Propiedades"
   - Selecciona "Usar las siguientes direcciones de servidor DNS"
   - DNS preferido: `2001:4860:4860::8888` (Google IPv6)
   - DNS alternativo: `2606:4700:4700::1111` (Cloudflare IPv6)
   - Aceptar

6. **Reinicia el adaptador:**
   - Clic derecho en el adaptador > Deshabilitar
   - Espera 5 segundos
   - Clic derecho > Habilitar

### Opción 2: Usar PowerShell (como Administrador)

```powershell
# Obtener el adaptador activo
$adapter = Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1

# Configurar DNS IPv4
Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses "8.8.8.8","1.1.1.1"

# Configurar DNS IPv6
Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses "2001:4860:4860::8888","2606:4700:4700::1111" -AddressFamily IPv6

# Reiniciar adaptador
Restart-NetAdapter -Name $adapter.Name
```

### Verificar

```powershell
nslookup db.hofhdghzixrryzxelbfb.supabase.co
```

Debería resolver correctamente.

### Probar conexión

```bash
cd backend
node test-connection-pooler.js
```

