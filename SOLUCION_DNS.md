# Solución para Problema de DNS con Supabase

## Problema
El DNS de Windows no puede resolver `db.hofhdghzixrryzxelbfb.supabase.co`, aunque el proyecto está activo en Supabase.

## Solución 1: Cambiar DNS de Windows (RECOMENDADO)

### Pasos:
1. **Abre Configuración de Red:**
   - Presiona `Win + R`
   - Escribe: `ncpa.cpl` y presiona Enter
   - O ve a: Panel de Control > Red e Internet > Centro de redes y recursos compartidos > Cambiar configuración del adaptador

2. **Selecciona tu adaptador de red activo:**
   - Clic derecho > Propiedades

3. **Selecciona "Protocolo de Internet versión 4 (TCP/IPv4)":**
   - Clic en "Propiedades"

4. **Selecciona "Usar las siguientes direcciones de servidor DNS":**
   - DNS preferido: `8.8.8.8` (Google DNS)
   - DNS alternativo: `1.1.1.1` (Cloudflare DNS)
   - O usa: `8.8.4.4` como alternativo

5. **Acepta y cierra**

6. **Reinicia el backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

## Solución 2: Usar archivo hosts (TEMPORAL)

Si no puedes cambiar el DNS, puedes agregar una entrada en el archivo hosts:

1. **Obtén la IP del host:**
   ```powershell
   nslookup db.hofhdghzixrryzxelbfb.supabase.co 8.8.8.8
   ```

2. **Edita el archivo hosts (como Administrador):**
   - Abre Notepad como Administrador
   - Abre: `C:\Windows\System32\drivers\etc\hosts`
   - Agrega al final:
     ```
     [IP_OBTENIDA] db.hofhdghzixrryzxelbfb.supabase.co
     ```
   - Guarda el archivo

3. **Reinicia el backend**

## Solución 3: Reiniciar servicio DNS de Windows

```powershell
# Ejecutar como Administrador
ipconfig /flushdns
net stop dnscache
net start dnscache
```

## Verificación

Después de aplicar la solución, ejecuta:
```bash
cd backend
node test-connection-detailed.js
```

Debería mostrar: ✅ Conexión exitosa!


