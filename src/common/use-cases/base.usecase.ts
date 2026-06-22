import { MemoryLogger } from '../logger/memory.logger';
import { AppExceptionService } from '../exceptions/app-exception.service';

export abstract class BaseUseCase<TReq, TRes> {
  protected constructor(
    protected readonly logger: MemoryLogger,
    protected readonly exceptionService: AppExceptionService,
    protected readonly contextName: string,
  ) {}

  protected log(message: string, data?: any) {
    this.logger.log({ method: this.constructor.name, message, data }, this.contextName);
  }

  protected warn(message: string, data?: any) {
    this.logger.warn({ method: this.constructor.name, message, data }, this.contextName);
  }

  protected error(message: string, error?: Error, data?: any) {
    this.logger.error({ method: this.constructor.name, message, data, error }, undefined, this.contextName);
  }

  protected throwNotFound(message: string, data?: any): never {
    this.exceptionService.throwNotFound(message, data, this.constructor.name, this.contextName);
  }

  protected throwBadRequest(message: string, data?: any): never {
    this.exceptionService.throwBadRequest(message, data, this.constructor.name, this.contextName);
  }

  protected throwInternal(message: string, data?: any): never {
    this.exceptionService.throwInternal(message, data, this.constructor.name, this.contextName);
  }

  abstract execute(request?: TReq): Promise<TRes>;
}
