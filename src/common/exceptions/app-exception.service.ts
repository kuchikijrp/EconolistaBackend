import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { MemoryLogger } from '../logger/memory.logger';

@Injectable()
export class AppExceptionService {
  constructor(private readonly logger: MemoryLogger) {}

  throwNotFound(message: string, data?: any, method?: string, context?: string): never {
    this.logger.warn({ method, message, data }, context);
    throw new NotFoundException(message);
  }

  throwBadRequest(message: string, data?: any, method?: string, context?: string): never {
    this.logger.warn({ method, message, data }, context);
    throw new BadRequestException(message);
  }

  throwInternal(message: string, data?: any, method?: string, context?: string): never {
    this.logger.error({ method, message, data }, undefined, context);
    throw new InternalServerErrorException(message);
  }
}
