import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ProducerService {

    private readonly logger =
        new Logger(ProducerService.name);

    private readonly redis: Redis;

    constructor() {

        this.redis = new Redis({

            host: process.env.UPSTASH_REDIS_HOST,
            port: Number(process.env.UPSTASH_REDIS_PORT || 6379),

            username: process.env.UPSTASH_REDIS_USERNAME,
            password: process.env.UPSTASH_REDIS_PASSWORD,

            tls: {},
        });
    }

    async enqueueReceipt(data: {
        url: string;
        receiptId: string;
        userId: string;
        uf: string;
    }) {
        const queueName = this.getQueueName(data.uf);

        try {

            await this.redis.lpush(
                queueName,
                JSON.stringify(data),
            );

            this.logger.log({
                message: `[${queueName}] Nota enviada para fila`,
                receiptId: data.receiptId,
                userId: data.userId
            });

        } catch (error) {

            this.logger.error({
                message: `[${queueName}] Erro ao enviar para fila`,
                error: error?.message,
                payload: data,
            });

            throw error;
        }
    }

    private getQueueName(uf: string): string { return `nfe:queue:${uf.toLowerCase()}`; }
}