import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/database.config';
import { TicketsModule } from './modules/tickets/tickets.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { ClassificationsModule } from './modules/classifications/classifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { EncuentrosModule } from './modules/encuentros/encuentros.module';
import { ICD10Module } from './modules/icd10/icd10.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { EnfermeriaModule } from './modules/enfermeria/enfermeria.module';
import { TransporteModule } from './modules/transporte/transporte.module';
import { EstudiosModule } from './modules/estudios/estudios.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { NutricionModule } from './modules/nutricion/nutricion.module';
import { PsicologiaModule } from './modules/psicologia/psicologia.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    TicketsModule,
    PatientsModule,
    ProvidersModule,
    ClassificationsModule,
    ChannelsModule,
    EventosModule,
    EncuentrosModule,
    ICD10Module,
    ChatbotModule,
    WebhooksModule,
    EnfermeriaModule,
    TransporteModule,
    EstudiosModule,
    StatisticsModule,
    NutricionModule,
    PsicologiaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

