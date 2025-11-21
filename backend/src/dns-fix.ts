import * as dns from 'dns';

// Cache para almacenar IPs resueltas
const dnsCache = new Map<string, string>();

// Resolver IP IPv6 para un hostname de Supabase
export async function resolveSupabaseHost(hostname: string): Promise<string | null> {
  if (!hostname || !hostname.includes('supabase.co')) {
    return null;
  }

  // Verificar cache
  if (dnsCache.has(hostname)) {
    return dnsCache.get(hostname)!;
  }

  try {
    const addresses = await new Promise<string[]>((resolve, reject) => {
      dns.resolve6(hostname, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });

    if (addresses && addresses.length > 0) {
      const ipv6 = typeof addresses[0] === 'string' ? addresses[0] : (addresses[0] as any).address;
      if (ipv6 && typeof ipv6 === 'string') {
        dnsCache.set(hostname, ipv6);
        return ipv6;
      }
    }
  } catch (error) {
    console.error(`[DNS Fix] Error resolviendo ${hostname}:`, error);
  }

  return null;
}

// Aplicar fix de DNS
export function applyDnsFix() {
  const originalLookup = dns.lookup.bind(dns);
  let isProcessing = false; // Flag para evitar recursión infinita

  (dns as any).lookup = function(hostname: string, options: any, callback?: any) {
    // Evitar procesamiento recursivo
    if (isProcessing) {
      console.log(`[DNS Fix] Llamada recursiva detectada, usando método original`);
      return originalLookup(hostname, options, callback);
    }
    // Determinar callback y options
    let actualCallback: any;
    let actualOptions: any = {};

    if (typeof options === 'function') {
      actualCallback = options;
      actualOptions = {};
    } else if (callback && typeof callback === 'function') {
      actualCallback = callback;
      actualOptions = options || {};
    } else {
      actualOptions = options || {};
      actualCallback = callback;
    }

    // Validar hostname
    if (!hostname || typeof hostname !== 'string' || hostname.trim() === '') {
      console.error(`[DNS Fix] ⚠️  Hostname inválido recibido: ${hostname}`);
      if (actualCallback && typeof actualCallback === 'function') {
        return setImmediate(() => actualCallback(new Error(`Invalid hostname: ${hostname || 'undefined'}`), null));
      }
      // Si no hay callback, intentar con el método original pero probablemente fallará
      return originalLookup(hostname || 'localhost', options, callback);
    }

    // Si es una IP directa (IPv4 o IPv6), usar el método original
    // Las IPs no necesitan resolución DNS
    // IPv4: formato 192.168.1.1
    const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    
    // IPv6: contiene dos puntos y solo caracteres hexadecimales y dos puntos
    // Ejemplos válidos: 2600:1f18:2e13:9d3a:4eed:6b96:4d6d:4207
    // No debe contener puntos (excepto en formato comprimido con ::)
    const hasColons = hostname.includes(':');
    const noDots = !hostname.includes('.');
    const onlyHexAndColons = /^[0-9a-fA-F:]+$/.test(hostname);
    const isIPv6 = hasColons && noDots && onlyHexAndColons && hostname.split(':').length >= 2;
    
    if (isIPv4 || isIPv6) {
      console.log(`[DNS Fix] Detectada IP directa (${isIPv4 ? 'IPv4' : 'IPv6'}): ${hostname}, usando método original`);
      // Para IPs, usar el método original directamente sin modificar
      // Pasar los parámetros originales para mantener compatibilidad
      return originalLookup(hostname, options, callback);
    }

    // Si es Supabase o pooler, usar cache o resolver
    if (hostname.includes('supabase.co') || hostname.includes('pooler.supabase.com')) {
      const cachedIp = dnsCache.get(hostname);
      
      if (cachedIp && actualCallback && typeof actualCallback === 'function') {
        // Validar que la IP del cache es válida
        if (typeof cachedIp === 'string' && cachedIp.trim() !== '') {
          const finalIp = String(cachedIp).trim();
          console.log(`[DNS Fix] Usando IP del cache: ${finalIp}`);
          
          // Usar setImmediate para asegurar que el callback se ejecute en el siguiente tick
          // Esto evita problemas con llamadas recursivas de node:net
          isProcessing = true;
          setImmediate(() => {
            try {
              console.log(`[DNS Fix] Ejecutando callback desde cache con IP: ${finalIp}`);
              if (!finalIp || typeof finalIp !== 'string') {
                throw new Error(`IP inválida en callback desde cache: ${finalIp}`);
              }
              // Llamar al callback directamente - dns.lookup() espera (err, address, family)
              actualCallback(null, finalIp, 6);
              console.log(`[DNS Fix] Callback desde cache ejecutado exitosamente`);
            } catch (error) {
              console.error('[DNS Fix] Error al llamar callback desde cache:', error);
              console.error('[DNS Fix] Stack:', (error as Error).stack);
              originalLookup(hostname, actualOptions, actualCallback);
            } finally {
              isProcessing = false;
            }
          });
          return;
        }
      }
      
      // Resolver y cachear
      if (actualCallback && typeof actualCallback === 'function') {
        dns.resolve6(hostname, (err, addresses) => {
          if (err || !addresses || addresses.length === 0) {
            console.log(`[DNS Fix] Error o sin direcciones, usando método original`);
            return originalLookup(hostname, actualOptions, actualCallback);
          }

          const ipv6 = typeof addresses[0] === 'string' ? addresses[0] : (addresses[0] as any).address;
          console.log(`[DNS Fix] IP extraída del resolve6: ${ipv6}, tipo: ${typeof ipv6}`);
          
          if (ipv6 && typeof ipv6 === 'string' && ipv6.trim() !== '') {
            const finalIp = String(ipv6).trim();
            dnsCache.set(hostname, finalIp);
            console.log(`[DNS Fix] Resolviendo IPv6: ${finalIp}, guardada en cache`);
            
            if (actualCallback && typeof actualCallback === 'function') {
              // Usar setImmediate para evitar problemas con llamadas recursivas
              isProcessing = true;
              setImmediate(() => {
                try {
                  console.log(`[DNS Fix] Ejecutando callback con IP: ${finalIp}`);
                  if (!finalIp || typeof finalIp !== 'string') {
                    throw new Error(`IP inválida en callback: ${finalIp}`);
                  }
                  // Llamar al callback directamente - dns.lookup() espera (err, address, family)
                  actualCallback(null, finalIp, 6);
                  console.log(`[DNS Fix] Callback ejecutado exitosamente`);
                } catch (error) {
                  console.error('[DNS Fix] Error al ejecutar callback:', error);
                  console.error('[DNS Fix] Stack:', (error as Error).stack);
                  originalLookup(hostname, actualOptions, actualCallback);
                } finally {
                  isProcessing = false;
                }
              });
            } else {
              console.error('[DNS Fix] Callback no válido');
              originalLookup(hostname, actualOptions, actualCallback);
            }
          } else {
            console.error(`[DNS Fix] IP inválida resuelta: ${ipv6}`);
            originalLookup(hostname, actualOptions, actualCallback);
          }
        });
        return;
      }
    }

    // Para otros hosts, usar método original
    return originalLookup(hostname, options, callback);
  };
}

