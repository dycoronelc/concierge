# Solución: Proyecto Supabase sin IPv4

## Problema
Tu proyecto de Supabase solo tiene IPv6 habilitado. Node.js usa `dns.lookup()` por defecto, que **falla** con hosts que solo tienen IPv6.

## Solución Implementada ✅

Se aplicó un **fix en `backend/src/main.ts`** que intercepta `dns.lookup()` y lo redirige a `dns.resolve6()` para hosts de Supabase.

### ¿Qué hace el fix?

- Detecta hostnames de Supabase (`*.supabase.co`)
- Usa `dns.resolve6()` en lugar de `dns.lookup()` (que falla con IPv6)
- No requiere cambios en `.env` ni IPs directas
- Funciona con el hostname original

### Código aplicado

El fix está en `backend/src/main.ts` y se ejecuta **antes** de que TypeORM se inicialice:

```typescript
import * as dns from 'dns';

const originalLookup = dns.lookup;
(dns as any).lookup = function(hostname: string, options: any, callback?: any) {
  if (hostname && hostname.includes('supabase.co')) {
    dns.resolve6(hostname, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        callback(null, addresses[0], 6);
      } else {
        originalLookup.call(dns, hostname, options, callback);
      }
    });
  } else {
    originalLookup.call(dns, hostname, options, callback);
  }
};
```

## Configuración Actual (.env)

Ya tienes configurado el Transaction Pooler:

```env
DB_HOST=db.hofhdghzixrryzxelbfb.supabase.co
DB_PORT=6543
DB_USERNAME=postgres
DB_PASSWORD=3W_Wsw?_pM2ePFq
DB_DATABASE=postgres
```

**Nota:** El fix funciona con el hostname original, no necesitas IPs directas.

## Solución Alternativa: Configurar DNS de Windows

Si el fix no funciona en algún entorno, puedes configurar DNS de Windows:

### Pasos Rápidos (PowerShell como Administrador):

1. **Abre PowerShell como Administrador**

2. **Ejecuta estos comandos:**
   ```powershell
   # Obtener el adaptador activo
   $adapter = Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1
   
   # Configurar DNS IPv4 (Google y Cloudflare)
   Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses "8.8.8.8","1.1.1.1"
   
   # Configurar DNS IPv6
   Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses "2001:4860:4860::8888","2606:4700:4700::1111" -AddressFamily IPv6
   
   # Reiniciar adaptador
   Restart-NetAdapter -Name $adapter.Name
   ```

3. **Verificar:**
   ```powershell
   nslookup db.hofhdghzixrryzxelbfb.supabase.co
   ```
   Debería resolver correctamente.

4. **Probar conexión:**
   ```bash
   cd backend
   npm run start:dev
   ```

### Configuración Manual (GUI):

1. **Abre Configuración de Red:**
   - Presiona `Win + R`
   - Escribe: `ncpa.cpl` y presiona Enter

2. **Selecciona tu adaptador activo:**
   - Clic derecho > Propiedades

3. **Para IPv4:**
   - Selecciona "Protocolo de Internet versión 4 (TCP/IPv4)"
   - Clic en "Propiedades"
   - Selecciona "Usar las siguientes direcciones de servidor DNS"
   - DNS preferido: `8.8.8.8`
   - DNS alternativo: `1.1.1.1`
   - Aceptar

4. **Para IPv6:**
   - Selecciona "Protocolo de Internet versión 6 (TCP/IPv6)"
   - Clic en "Propiedades"
   - Selecciona "Usar las siguientes direcciones de servidor DNS"
   - DNS preferido: `2001:4860:4860::8888`
   - DNS alternativo: `2606:4700:4700::1111`
   - Aceptar

5. **Reinicia el adaptador:**
   - Clic derecho > Deshabilitar
   - Espera 5 segundos
   - Clic derecho > Habilitar

## Configuración Actual (.env)

Ya tienes configurado el Transaction Pooler:

```env
DB_HOST=db.hofhdghzixrryzxelbfb.supabase.co
DB_PORT=6543
DB_USERNAME=postgres
DB_PASSWORD=3W_Wsw?_pM2ePFq
DB_DATABASE=postgres
```

**Nota:** El Transaction Pooler usa el mismo host que la conexión directa, pero el puerto es `6543`. Una vez que configures el DNS, debería funcionar.

## Alternativa: IPv4 Add-on (PAGO)

Si prefieres no cambiar el DNS:
1. Haz clic en "IPv4 add-on" en Supabase
2. Esto requiere un plan de pago
3. Después podrás usar el host directo sin problemas de DNS

## Estado Actual

✅ **SOLUCIONADO** - El fix en `main.ts` resuelve el problema automáticamente.

El backend ahora se conecta correctamente a Supabase usando IPv6 sin necesidad de:
- Cambiar DNS de Windows
- Usar IPs directas
- Configurar IPv4 add-on (pago)

## Ver Documentación Completa

Para más detalles sobre el fix implementado, ver:
- `backend/SOLUCION_FINAL_DNS.md` - Explicación técnica del fix
- `backend/OPCIONES_SOLUCION_RED.md` - Opciones alternativas si el fix no funciona


