import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhooksService, TwoChatWebhookPayload } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('2chat')
  @HttpCode(HttpStatus.OK)
  async receiveTwoChatWebhook(
    @Body() payload: TwoChatWebhookPayload,
    @Headers('x-api-key') apiKey?: string,
  ) {
    // Opcional: Validar API key si 2chat la envía
    // const expectedApiKey = process.env.TWOCHAT_WEBHOOK_SECRET;
    // if (expectedApiKey && apiKey !== expectedApiKey) {
    //   throw new UnauthorizedException('Invalid API key');
    // }

    const result = await this.webhooksService.processTwoChatWebhook(payload);

    // Retornar respuesta que 2chat espera
    return {
      success: result.success,
      message: result.message,
    };
  }
}

