import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { MemoryLogger } from './common/logger/memory.logger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(MemoryLogger);
  app.useLogger(logger);

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map(err => ({
            field: err.property,
            errors: err.constraints,
          })),
        );
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    logger.log(`Server is running on port ${port}`);
  });
}
bootstrap();
