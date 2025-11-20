import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatbotService, ChatMessage, ChatResponse } from './chatbot.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async sendMessage(@Body() chatMessage: ChatMessage): Promise<ChatResponse> {
    return this.chatbotService.processMessage(chatMessage.message);
  }
}

