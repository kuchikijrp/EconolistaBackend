import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProducerService } from 'src/common/redis/producer.service';

@Module({
  imports: [],
  controllers: [ReceiptsController],
  providers: [ReceiptsService, PrismaService, ProducerService],
})
export class ReceiptsModule { }
