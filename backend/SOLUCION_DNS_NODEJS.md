# Solución: Node.js no puede resolver DNS de Supabase

## Problema Identificado

Node.js usa `dns.lookup()` por defecto, que **falla** con hosts que solo tienen IPv6 (como Supabase sin IPv4 add-on).

El diagnóstico muestra:
- ✅ `dns.resolve6()` SÍ funciona (resuelve IPv6)
- ✅ `dns.resolve()` SÍ funciona
- ❌ `dns.lookup()` FALLA (es el que usa la librería `pg`)

## Solución: Usar IP IPv6 Directa

He actualizado `database.config.ts` para soportar una IP IPv6 directa como fallback.

### Pasos:

1. **Obtén la IP IPv6 de tu proyecto Supabase:**

   Ejecuta en PowerShell:
   ```powershell
   nslookup db.hofhdghzixrryzxelbfb.supabase.co
   ```
   
   O usa este comando:
   ```powershell
   (Resolve-DnsName db.hofhdghzixrryzxelbfb.supabase.co -Type AAAA).IPAddress
   ```

2. **Agrega la IP IPv6 al archivo `.env`:**

   Abre `backend/.env` y agrega esta línea:
   ```env
   DB_HOST_IPV6=2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207
   ```
   
   **Nota:** La IP puede cambiar, así que si deja de funcionar, vuelve a obtenerla.

3. **Mantén el host original también:**
   ```env
   DB_HOST=db.hofhdghzixrryzxelbfb.supabase.co
   DB_HOST_IPV6=2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207
   ```

4. **Prueba la conexión:**
   ```bash
   cd backend
   npm run start:dev
   ```

## Cómo Funciona

- Si `DB_HOST_IPV6` está configurado, la aplicación usará esa IP directamente
- Si no está configurado, intentará usar el hostname (puede fallar)
- Esto evita el problema de `dns.lookup()` con IPv6

## Nota Importante

La IP IPv6 puede cambiar ocasionalmente. Si la conexión deja de funcionar:
1. Obtén la nueva IP con `nslookup`
2. Actualiza `DB_HOST_IPV6` en `.env`

## Alternativa Permanente

Si prefieres una solución más permanente:
- Usa el **IPv4 Add-on de Supabase** (requiere pago)
- O configura un DNS local que resuelva correctamente

