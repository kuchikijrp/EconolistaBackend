import {
  Controller,
  Get,
  Request,
  UseGuards
} from '@nestjs/common';

import { UsersService } from './users.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get('me')
  @UseGuards(SupabaseGuard)
  async getMyProfile(@Request() req) {

    return this.usersService.findOrCreateProfile(
      req.user
    );
  }
}