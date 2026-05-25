import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('invoices')
export class InvoicesController {
  @UseGuards(SupabaseGuard)
  @Post('upload')
  async uploadInvoice(@Body() data: { url: string }, @GetUser() user: any) {
    // 1. Salva a intenção de processamento no banco
    // 2. Coloca na fila (Week 3) ou apenas retorna sucesso por enquanto
    return {
      message: "Nota recebida com sucesso! Processamento iniciado.",
      userId: user.id
    };
  }
}
