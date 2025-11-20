const { Client } = require('pg');
require('dotenv').config();
const dns = require('dns');

// Configurar DNS para usar Google DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const host = process.env.DB_HOST;
const port = process.env.DB_PORT || 5432;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

console.log('🔍 Probando conexión con DNS público (8.8.8.8, 1.1.1.1)...\n');

// Paso 1: Verificar resolución DNS con DNS público
console.log('1️⃣ Verificando resolución DNS con servidores públicos...');
dns.lookup(host, { family: 4 }, (err, address, family) => {
  if (err) {
    // Intentar con IPv6
    dns.lookup(host, { family: 6 }, (err6, address6, family6) => {
      if (err6) {
        console.error('   ❌ Error DNS (IPv4):', err.message);
        console.error('   ❌ Error DNS (IPv6):', err6.message);
        console.error('');
        console.error('   💡 SOLUCIÓN: Cambiar DNS de Windows');
        console.error('      1. Abre "Configuración de red"');
        console.error('      2. Cambia DNS a: 8.8.8.8 (Google) o 1.1.1.1 (Cloudflare)');
        console.error('      3. Reinicia el backend');
        process.exit(1);
      } else {
        console.log(`   ✅ DNS resuelto (IPv6): ${address6}`);
        attemptConnection();
      }
    });
  } else {
    console.log(`   ✅ DNS resuelto (IPv4): ${address}`);
    attemptConnection();
  }
});

function attemptConnection() {
  console.log('');
  console.log('2️⃣ Intentando conectar a PostgreSQL...');
  const client = new Client({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 15000
  });

  client.connect()
    .then(() => {
      console.log('   ✅ Conexión TCP establecida!');
      return client.query('SELECT version()');
    })
    .then((result) => {
      console.log('   ✅ Autenticación exitosa!');
      console.log('   📊 PostgreSQL:', result.rows[0].version.split(',')[0]);
      return client.query('SELECT current_database(), current_user');
    })
    .then((result) => {
      console.log('   📊 Base de datos:', result.rows[0].current_database);
      console.log('   📊 Usuario:', result.rows[0].current_user);
      return client.query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'");
    })
    .then((result) => {
      console.log('   📊 Tablas en la base de datos:', result.rows[0].count);
      client.end();
      console.log('');
      console.log('✅ ¡Conexión exitosa! El backend debería funcionar correctamente.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('   ❌ Error de conexión PostgreSQL:');
      console.error('   Tipo:', err.constructor.name);
      console.error('   Mensaje:', err.message);
      if (err.code) {
        console.error('   Código:', err.code);
      }
      process.exit(1);
    });
}


