import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MemoryLogger } from '../logger/memory.logger';
import { RequestContextService } from '../context/request-context.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: MemoryLogger,
    private readonly requestContextService: RequestContextService,
  ) { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = this.requestContextService.getRequestId() || 'system';

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 🔥 PEGA O RESPONSE REAL DO NEST (onde vem validation errors)
    let message: any = 'Erro interno do servidor';
    let errors: any = null;

    if (isHttpException) {
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as any;

        message = r.message ?? message;
        errors = r; // 👈 aqui ficam validation errors completos
      }
    }

    // Log estruturado
    if (exception instanceof Error) {
      this.logger.error(
        {
          message: exception.message,
          context: {
            path: request.url,
            method: request.method,
            body: request.body,
            query: request.query,
            params: request.params,
          },
        },
        exception.stack,
        'GlobalExceptionFilter',
      );
    } else {
      this.logger.error(
        {
          message: 'Unexpected error occurred',
          context: {
            exception,
            path: request.url,
            method: request.method,
          },
        },
        undefined,
        'GlobalExceptionFilter',
      );
    }

    // Response padronizada
    const responseBody = {
      statusCode: status,
      message,
      errors, // 👈 AQUI vem "ean should not be empty"
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(responseBody);
  }
}