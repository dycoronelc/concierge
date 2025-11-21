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
    
    // Si DB_HOST_IPV6 está configurado, usarlo directamente (para evitar problemas de DNS)
    const finalHost = hostIPv6 && hostIPv6.trim() !== '' ? hostIPv6.trim() : host;
    
    const isSupabase = host.includes('supabase.co') || host.includes('pooler.supabase.com');
    const isPooler = host.includes('pooler.supabase.com');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    // Supabase siempre requiere SSL, y producción también
    const needsSSL = isSupabase || isProduction;

    // Log para debugging
    if (hostIPv6) {
      console.log(`[Database] Usando IP IPv6 directa: ${finalHost} (hostname original: ${host})`);
    } else {
      console.log(`[Database] Intentando conectar a: ${finalHost}:${this.configService.get<number>('DB_PORT', 5432)}`);
    }
    console.log(`[Database] Tipo: ${isPooler ? 'Session Pooler' : 'Direct'}`);
    console.log(`[Database] SSL requerido: ${needsSSL}`);

    return {
      type: 'postgres',
      host: finalHost,
      port: this.configService.get<number>('DB_PORT', 5432),
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

