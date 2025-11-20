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
    const host = this.configService.get<string>('DB_HOST', 'localhost');
    const isSupabase = host.includes('supabase.co') || host.includes('pooler.supabase.com');
    const isPooler = host.includes('pooler.supabase.com');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    // Supabase siempre requiere SSL, y producción también
    const needsSSL = isSupabase || isProduction;

    // Log para debugging (solo en desarrollo)
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      console.log(`[Database] Intentando conectar a: ${host}:${this.configService.get<number>('DB_PORT', 5432)}`);
      console.log(`[Database] Tipo: ${isPooler ? 'Session Pooler' : 'Direct'}`);
      console.log(`[Database] SSL requerido: ${needsSSL}`);
    }

    return {
      type: 'postgres',
      host: host,
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

