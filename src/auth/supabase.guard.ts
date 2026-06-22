import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SupabaseGuard extends AuthGuard('jwt') {
  constructor() {
    super();
    Logger.debug('SupabaseGuard initialized');
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
