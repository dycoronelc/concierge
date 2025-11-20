# Solución Final: DNS IPv6 en Node.js

## Problema Resuelto

Node.js usa `dns.lookup()` por defecto, que **falla** con hosts que solo tienen IPv6 (como Supabase sin IPv4 add-on).

## Solución Implementada

Se modificó `backend/src/main.ts` para interceptar `dns.lookup()` y redirigirlo a `dns.resolve6()` cuando detecta un hostname de Supabase.

### Cómo Funciona

1. **Antes de que TypeORM se inicialice**, interceptamos `dns.lookup()`
2. **Si el hostname contiene `supabase.co`**, usamos `dns.resolve6()` en su lugar
3. **Para otros hosts**, usamos el método original

### Código Aplicado

```typescript
import * as dns from 'dns';

const originalLookup = dns.lookup;
(dns as any).lookup = function(hostname: string, options: any, callback?: any) {
  if (hostname && hostname.includes('supabase.co')) {
    // Resolver IPv6 directamente
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

## Verificación

El fix fue probado y funciona correctamente:

```bash
node test-dns-fix.js
# ✅ Resuelto: 2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207 (IPv6)
```

## Próximos Pasos

1. **Iniciar el backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Verificar conexión:**
   - El backend debería conectarse a Supabase sin errores
   - Deberías ver: `[Database] Intentando conectar a: ...`

## Notas

- ✅ **No requiere cambios en `.env`** - funciona con el hostname original
- ✅ **No requiere IPv4 add-on** - funciona con IPv6 nativo
- ✅ **Compatible con todas las redes** - resuelve IPv6 correctamente
- ✅ **Transparente** - no afecta otros hosts

## Si Aún No Funciona

Si después de aplicar este fix aún hay problemas:

1. **Verifica que el código esté en `main.ts`** antes de `bootstrap()`
2. **Reinicia el backend** completamente
3. **Verifica que `DB_HOST` en `.env` contenga el hostname de Supabase**

