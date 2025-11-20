# Verificar Credenciales de Supabase

## Pasos para obtener el host correcto:

1. **Ve al Dashboard de Supabase:**
   - https://supabase.com/dashboard
   - Selecciona el proyecto "flowcare"

2. **Ve a Settings > Database:**
   - En la sección "Connection string" o "Connection info"
   - Busca el campo "Host" o "Hostname"

3. **Opciones de conexión:**
   - **Connection string directo:** `db.xxxxx.supabase.co`
   - **Connection pooling:** `aws-0-us-east-1.pooler.supabase.com` (o similar)

4. **Copia el host EXACTO** que aparece allí

5. **Actualiza el archivo `backend/.env`** con el host correcto

## Nota importante:
- Si ves "Connection pooling", ese host puede ser diferente al directo
- El host puede cambiar si el proyecto fue movido de región
- Asegúrate de copiar el host completo sin espacios

