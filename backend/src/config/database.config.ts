import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

// Variable global para almacenar la IP resuelta
// Se resuelve en main.ts antes de inicializar NestJS
(global as any).__SUPABASE_RESOLVED_IP__ = null;

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const host = this.configService.get<string>('DB_HOST');
    const hostIPv6 = this.configService.get<string>('DB_HOST_IPV6');
    
    // Validar que DB_HOST esté configurado
    if (!host || host.trim() === '') {
      const errorMsg = '[Database] ⚠️  DB_HOST no está configurado. Por favor, configura DB_HOST en Railway: Settings → Variables';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    const isSupabase = host.includes('supabase.co') || host.includes('pooler.supabase.com');
    const isPooler = host.includes('pooler.supabase.com');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    // Para pooler, SIEMPRE usar el hostname (no la IP IPv6 directa)
    // La IP IPv6 solo se usa para conexiones directas si es necesario
    // Railway puede no tener soporte IPv6, así que es mejor usar el hostname del pooler
    let finalHost = host;
    if (hostIPv6 && hostIPv6.trim() !== '' && !isPooler) {
      // Solo usar IPv6 para conexiones directas (no pooler)
      // Pero en Railway es mejor usar el hostname siempre
      console.log(`[Database] IPv6 configurada pero usando hostname para mejor compatibilidad: ${host}`);
      // finalHost = hostIPv6.trim(); // Comentado: Railway puede no soportar IPv6
    }
    
    // Determinar puerto: pooler usa 6543 por defecto, directo usa 5432
    const defaultPort = isPooler ? 6543 : 5432;
    const port = this.configService.get<number>('DB_PORT', defaultPort);
    
    // Supabase siempre requiere SSL, y producción también
    const needsSSL = isSupabase || isProduction;

    // Log para debugging
    console.log(`[Database] Intentando conectar a: ${finalHost}:${port}`);
    console.log(`[Database] Tipo: ${isPooler ? 'Session Pooler' : 'Direct'}`);
    console.log(`[Database] SSL requerido: ${needsSSL}`);
    if (hostIPv6 && !isPooler) {
      console.log(`[Database] IPv6 disponible pero usando hostname para compatibilidad con Railway`);
    }

    return {
      type: 'postgres',
      host: finalHost,
      port: port,
      username: this.configService.get<string>('DB_USERNAME', 'flowcare'),
      password: this.configService.get<string>('DB_PASSWORD', 'flowcare123'),
      database: this.configService.get<string>('DB_DATABASE', 'flowcare'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<string>('NODE_ENV') === 'development',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      ssl: needsSSL ? {
        rejectUnauthorized: false,
      } : false,
    };
  }
}

