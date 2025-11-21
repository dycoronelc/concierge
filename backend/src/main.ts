import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { applyDnsFix, resolveSupabaseHost } from './dns-fix';
import * as dns from 'dns';

// Aplicar fix de DNS ANTES de que TypeORM se inicialice
applyDnsFix();

// Resolver IP IPv6 al inicio si es Supabase
async function resolveDatabaseHost() {
  const dbHost = process.env.DB_HOST;
  
  // Validar que DB_HOST esté configurado
  if (!dbHost) {
    console.error('[Startup] ⚠️  DB_HOST no está configurado en las variables de entorno');
    console.error('[Startup] Por favor, configura DB_HOST en Railway: Settings → Variables');
    console.error('[Startup] Ejemplo: DB_HOST=db.xxxxx.supabase.co');
    console.error('[Startup] O con pooler: DB_HOST=aws-0-us-east-1.pooler.supabase.com');
    // No salir aquí, dejar que TypeORM muestre el error más específico
    return;
  }
  
  if (dbHost.includes('supabase.co') || dbHost.includes('pooler.supabase.com')) {
    try {
      console.log(`[Startup] Resolviendo IP IPv6 para ${dbHost}...`);
      const ipv6 = await resolveSupabaseHost(dbHost);
      if (ipv6) {
        (global as any).__SUPABASE_RESOLVED_IP__ = ipv6;
        console.log(`[Startup] IP IPv6 resuelta: ${ipv6}`);
      } else {
        console.log(`[Startup] No se pudo resolver IPv6, el fix de DNS se encargará`);
      }
    } catch (error) {
      console.error(`[Startup] Error resolviendo IPv6:`, error);
    }
  } else {
    console.log(`[Startup] DB_HOST no es Supabase, usando resolución DNS estándar`);
  }
}

// Resolver antes de inicializar NestJS
resolveDatabaseHost().then(() => {
  bootstrap();
}).catch((error) => {
  console.error('[Startup] Error crítico al resolver DNS:', error);
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN, // Railway frontend domain
    'http://localhost:5173',
  ].filter(Boolean); // Remover valores undefined/null

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Escuchar en todas las interfaces para Railway
  console.log(`🚀 Concierge API running on: http://0.0.0.0:${port}`);
}

