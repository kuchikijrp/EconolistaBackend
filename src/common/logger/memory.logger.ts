import { ConsoleLogger, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RequestContextService } from '../context/request-context.service';
import { AppLogEntry } from './app-log.interface';

@Injectable()
export class MemoryLogger extends ConsoleLogger {
  private redis: Redis;

  constructor(private readonly requestContextService: RequestContextService) {
    super();
    this.redis = new Redis({
      host: process.env.UPSTASH_REDIS_HOST,
      port: Number(process.env.UPSTASH_REDIS_PORT || 6379),
      username: process.env.UPSTASH_REDIS_USERNAME,
      password: process.env.UPSTASH_REDIS_PASSWORD,
      tls: {},
    });
  }

  private addLog(level: string, message: any, context?: string, error?: Error) {
    const logEntry: AppLogEntry = {
      timestamp: new Date().toISOString(),
      requestId: this.requestContextService.getRequestId() || 'system',
      service: 'backend',
      level,
      method: message?.method || '',
      context: context || this.context || '',
      message: message?.message ?? (typeof message === 'string' ? message : JSON.stringify(message)),
      data: message?.data || message?.context || undefined,
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    // Salva no Redis (fire-and-forget) para que todas as instâncias da Vercel compartilhem
    this.redis.lpush('econolista:logs:backend', JSON.stringify(logEntry))
      .then(() => {
        this.redis.ltrim('econolista:logs:backend', 0, 49).catch(() => { });
      })
      .catch(() => { });
  }

  log(message: any, context?: string) {
    this.addLog('LOG', message, context);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string, context?: string) {
    const error = message instanceof Error ? message : undefined;
    this.addLog('ERROR', message, context || stackOrContext, error);
    super.error(message, stackOrContext, context);
  }

  warn(message: any, context?: string) {
    this.addLog('WARN', message, context);
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    this.addLog('DEBUG', message, context);
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    this.addLog('VERBOSE', message, context);
    super.verbose(message, context);
  }
}
