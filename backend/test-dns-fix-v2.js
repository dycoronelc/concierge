const dns = require('dns');

// Simular el fix mejorado
const originalLookup = dns.lookup;
const testHostname = 'db.hofhdghzixrryzxelbfb.supabase.co';

console.log('Probando fix de DNS mejorado...\n');

// Versión mejorada del fix
dns.lookup = function(hostname, options, callback) {
  console.log(`[DNS Fix] Llamado con hostname: ${hostname}`);
  console.log(`[DNS Fix] Tipo de options: ${typeof options}`);
  console.log(`[DNS Fix] Tipo de callback: ${typeof callback}`);
  
  if (!hostname || typeof hostname !== 'string') {
    console.log('[DNS Fix] Hostname inválido, usando método original');
    return originalLookup.call(dns, hostname, options, callback);
  }

  if (hostname.includes('supabase.co')) {
    let actualCallback;
    let actualOptions = {};

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

    console.log('[DNS Fix] Resolviendo IPv6...');
    dns.resolve6(hostname, (err, addresses) => {
      if (err) {
        console.log(`[DNS Fix] Error resolviendo IPv6: ${err.message}`);
        console.log('[DNS Fix] Usando método original como fallback');
        return originalLookup.call(dns, hostname, actualOptions, actualCallback);
      }

      if (addresses && addresses.length > 0) {
        let ipv6;
        if (typeof addresses[0] === 'string') {
          ipv6 = addresses[0];
        } else if (addresses[0] && addresses[0].address) {
          ipv6 = addresses[0].address;
        } else {
          console.log('[DNS Fix] Formato de dirección no reconocido, usando método original');
          return originalLookup.call(dns, hostname, actualOptions, actualCallback);
        }

        console.log(`[DNS Fix] IPv6 resuelta: ${ipv6}`);
        if (actualCallback) {
          actualCallback(null, ipv6, 6);
        }
      } else {
        console.log('[DNS Fix] No se encontraron direcciones IPv6, usando método original');
        originalLookup.call(dns, hostname, actualOptions, actualCallback);
      }
    });
  } else {
    console.log('[DNS Fix] No es Supabase, usando método original');
    originalLookup.call(dns, hostname, options, callback);
  }
};

// Probar
dns.lookup(testHostname, (err, address, family) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log(`\n✅ Resultado: ${address} (IPv${family})`);
  }
});

