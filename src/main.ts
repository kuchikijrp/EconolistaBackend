import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  // No seu main.ts
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  const port = process.env.PORT ?? 3000
  await app.listen(port, () => {
    logger.log(`Server is running on port ${port}`);
  });
}
bootstrap();
