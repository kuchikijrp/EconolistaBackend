import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<string>();

  run(requestId: string, callback: () => void | Promise<void>) {
    return this.asyncLocalStorage.run(requestId, callback);
  }

  getRequestId(): string | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
