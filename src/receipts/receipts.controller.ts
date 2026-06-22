import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { AuthGuard } from '@nestjs/passport'; // Ou o seu Guard customizado do Supabase
import { SupabaseGuard } from '@/auth/supabase.guard';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @UseGuards(SupabaseGuard)
  @Post('scan')
  async create(@Body() createReceiptDto: CreateReceiptDto, @Req() req: any) {
    // O userId vem do token decodificado pelo Passport/Supabase Guard
    const userId = req.user.id;

    return this.receiptsService.sendToProcessing(
      createReceiptDto.url_sefaz,
      userId,
    );
  }
}
