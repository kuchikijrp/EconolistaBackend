import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContextService } from '../context/request-context.service';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    let requestId = req.headers['x-request-id'] as string;
    if (!requestId) {
      requestId = randomUUID();
    }

    res.setHeader('x-request-id', requestId);

    this.requestContextService.run(requestId, () => {
      next();
    });
  }
}
