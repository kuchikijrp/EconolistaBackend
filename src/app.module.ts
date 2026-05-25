import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { BullModule } from '@nestjs/bullmq';

@Module({

  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    PrismaModule, AuthModule, UsersModule, InvoicesModule, ReceiptsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }

