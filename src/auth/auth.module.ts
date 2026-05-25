import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy],
  exports: [PassportModule, SupabaseStrategy]
})
export class AuthModule { }
