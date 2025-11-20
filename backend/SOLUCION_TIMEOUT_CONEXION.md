# Solución: Timeout de Conexión a Base de Datos

## Problema
El backend intentaba conectarse directamente a la IP IPv6 (`2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207:6543`) y daba timeout.

## Causa
El código en `database.config.ts` estaba usando la IP IPv6 directa cuando `DB_HOST_IPV6` estaba configurado en `.env`, pero las conexiones TCP directas a IPv6 están dando timeout.

## Solución Aplicada

Se modificó `backend/src/config/database.config.ts` para **siempre usar el hostname** en lugar de la IP directa. El fix de DNS implementado en `main.ts` resuelve el hostname correctamente usando `dns.resolve6()`.

### Cambios Realizados

1. **Removida la lógica de IP directa** en `database.config.ts`
2. **Siempre usar hostname** - El fix de DNS en `main.ts` se encarga de resolverlo

### Cómo Funciona Ahora

1. TypeORM intenta conectarse a `db.hofhdghzixrryzxelbfb.supabase.co`
2. El fix de DNS en `main.ts` intercepta `dns.lookup()`
3. Usa `dns.resolve6()` para resolver a IPv6
4. La librería `pg` usa la IP resuelta para la conexión TCP
5. La conexión debería funcionar correctamente

## Pasos para Aplicar

1. **Reinicia el backend:**
   ```bash
   # Detener el backend (Ctrl+C)
   # Luego reiniciar
   cd backend
   npm run start:dev
   ```

2. **Verifica los logs:**
   Deberías ver:
   ```
   [Database] Intentando conectar a: db.hofhdghzixrryzxelbfb.supabase.co:6543
   [Database] SSL requerido: true
   ```

3. **Si aún hay problemas:**
   - Verifica que el fix de DNS esté en `main.ts`
   - Verifica que `DB_HOST` en `.env` sea el hostname (no la IP)
   - Puedes remover `DB_HOST_IPV6` del `.env` si quieres (ya no se usa)

## Nota

El `DB_HOST_IPV6` en `.env` ya no se usa. Puedes dejarlo o eliminarlo, no afecta el funcionamiento.

