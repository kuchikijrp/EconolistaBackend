import { Global, Module } from '@nestjs/common';
import { MemoryLogger } from './memory.logger';
import { RequestContextService } from '../context/request-context.service';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';
import { AppExceptionService } from '../exceptions/app-exception.service';

@Global()
@Module({
  providers: [MemoryLogger, RequestContextService, GlobalExceptionFilter, AppExceptionService],
  exports: [MemoryLogger, RequestContextService, GlobalExceptionFilter, AppExceptionService],
})
export class LoggerModule {}
