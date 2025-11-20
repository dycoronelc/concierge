# Configurar Shared Pooler de Supabase

## Pasos en Supabase Dashboard:

1. **Ve a tu proyecto "flowcare"**
2. **Settings > Database**
3. **En "Connection string":**
   - Cambia **Method:** de "Direct connection" a **"Session mode"**
   - Esto mostrará un nuevo connection string

4. **Copia el nuevo host** (será algo como):
   ```
   aws-0-us-east-1.pooler.supabase.com
   ```
   O similar según tu región.

5. **Nota el puerto:** Será `6543` (no 5432)

6. **Nota el username:** Debe ser `postgres.hofhdghzixrryzxelbfb` (formato: postgres.[PROJECT_REF])

## Actualizar .env:

Abre `backend/.env` y actualiza:

```env
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.hofhdghzixrryzxelbfb
DB_PASSWORD=3W_Wsw?_pM2ePFq
DB_DATABASE=postgres
```

**Importante:**
- El host será diferente (del pooler)
- El puerto será `6543` (no 5432)
- El username debe incluir el project reference: `postgres.hofhdghzixrryzxelbfb`

## Después de actualizar:

```bash
cd backend
node test-connection-detailed.js
```

Si funciona, entonces:
```bash
npm run start:dev
```


