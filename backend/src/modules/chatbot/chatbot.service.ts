import { Injectable } from '@nestjs/common';

export interface ChatMessage {
  message: string;
  timestamp?: Date;
}

export interface ChatResponse {
  response: string;
  timestamp: Date;
}

@Injectable()
export class ChatbotService {
  // Respuestas predefinidas para el chatbot
  private responses: Map<string, string[]> = new Map([
    [
      'saludo',
      [
        '¡Hola! 👋 Soy el asistente virtual de Concierge. ¿En qué puedo ayudarte?',
        '¡Bienvenido! Estoy aquí para ayudarte con cualquier consulta sobre el sistema.',
      ],
    ],
    [
      'tickets',
      [
        'Puedo ayudarte con los tickets. Puedes crear nuevos tickets, ver el estado de los existentes o asignar prestadores.',
        'Los tickets se pueden crear desde WhatsApp, llamadas o manualmente. ¿Necesitas ayuda con algo específico?',
      ],
    ],
    [
      'pacientes',
      [
        'Los pacientes se pueden gestionar desde la sección "Pacientes". Allí puedes buscar, crear y ver el historial clínico.',
        '¿Necesitas ayuda para crear un nuevo paciente o buscar uno existente?',
      ],
    ],
    [
      'prestadores',
      [
        'Los prestadores son los profesionales de salud que atienden a los pacientes. Puedes gestionarlos desde la sección "Prestadores".',
        '¿Necesitas ayuda para asignar un prestador a un ticket?',
      ],
    ],
    [
      'eventos',
      [
        'Los eventos clínicos registran situaciones médicas importantes de los pacientes.',
        'Puedes crear y gestionar eventos clínicos desde la sección "Eventos".',
      ],
    ],
    [
      'encuentros',
      [
        'Los encuentros representan las interacciones entre pacientes y prestadores.',
        'Puedes gestionar encuentros clínicos desde la sección "Encuentros".',
      ],
    ],
    [
      'ayuda',
      [
        'Puedo ayudarte con: tickets, pacientes, prestadores, eventos y encuentros. ¿Sobre qué tema necesitas información?',
        'Estoy aquí para ayudarte. Puedes preguntarme sobre cualquier funcionalidad del sistema.',
      ],
    ],
  ]);

  async processMessage(userMessage: string): Promise<ChatResponse> {
    const message = userMessage.toLowerCase().trim();

    // Detectar intención basada en palabras clave
    let category = 'ayuda';

    if (
      message.includes('hola') ||
      message.includes('buenos días') ||
      message.includes('buenas tardes') ||
      message.includes('buenas noches') ||
      message.includes('saludo')
    ) {
      category = 'saludo';
    } else if (
      message.includes('ticket') ||
      message.includes('caso') ||
      message.includes('solicitud')
    ) {
      category = 'tickets';
    } else if (
      message.includes('paciente') ||
      message.includes('persona') ||
      message.includes('historial')
    ) {
      category = 'pacientes';
    } else if (
      message.includes('prestador') ||
      message.includes('doctor') ||
      message.includes('médico') ||
      message.includes('profesional')
    ) {
      category = 'prestadores';
    } else if (message.includes('evento') || message.includes('situación')) {
      category = 'eventos';
    } else if (
      message.includes('encuentro') ||
      message.includes('consulta') ||
      message.includes('visita')
    ) {
      category = 'encuentros';
    } else if (
      message.includes('ayuda') ||
      message.includes('help') ||
      message.includes('qué puedo') ||
      message.includes('cómo')
    ) {
      category = 'ayuda';
    }

    // Obtener respuesta aleatoria de la categoría
    const categoryResponses = this.responses.get(category) || this.responses.get('ayuda')!;
    const randomResponse =
      categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    return {
      response: randomResponse,
      timestamp: new Date(),
    };
  }
}

