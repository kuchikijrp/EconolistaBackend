import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getDashboardLogs(): Promise<any[]> {
    const redis = new Redis({
      host: process.env.UPSTASH_REDIS_HOST,
      port: Number(process.env.UPSTASH_REDIS_PORT || 6379),
      username: process.env.UPSTASH_REDIS_USERNAME,
      password: process.env.UPSTASH_REDIS_PASSWORD,
      tls: {},
    });

    try {
      const logsStr = await redis.lrange('econolista:logs:backend', 0, 49);
      return logsStr.map((l) => JSON.parse(l));
    } finally {
      await redis.quit();
    }
  }

  async getAllLogs(): Promise<any[]> {
    const redis = new Redis({
      host: process.env.UPSTASH_REDIS_HOST,
      port: Number(process.env.UPSTASH_REDIS_PORT || 6379),
      username: process.env.UPSTASH_REDIS_USERNAME,
      password: process.env.UPSTASH_REDIS_PASSWORD,
      tls: {},
    });

    try {
      const [backendStr, scraperStr] = await Promise.all([
        redis.lrange('econolista:logs:backend', 0, 49),
        redis.lrange('econolista:logs:scraper', 0, 49),
      ]);

      const backendLogs = backendStr.map((l) => JSON.parse(l));
      const scraperLogs = scraperStr.map((l) => JSON.parse(l));

      return [...backendLogs, ...scraperLogs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    } finally {
      await redis.quit();
    }
  }
}
