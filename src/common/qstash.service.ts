import { Injectable } from '@nestjs/common';
import { Client } from '@upstash/qstash';

@Injectable()
export class QstashService {
  private client = new Client({
    baseUrl: process.env.QSTASH_BASE_URL!,
    token: process.env.QSTASH_TOKEN!,
  });

  async publishReceipt(data: {
    url: string;
    transactionId: string;
    userId: string;
  }) {
    await this.client.publishJSON({
      url: `${process.env.SCRAPER_URL}/scraper/process`,
      body: data,

      retries: 3,
    });
  }
}
