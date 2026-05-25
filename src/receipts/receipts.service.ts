import { Injectable, Logger, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProducerService } from '@/common/redis/producer.service';

@Injectable()
export class ReceiptsService {
    // Definimos o contexto do Logger como o nome da classe
    private readonly logger = new Logger(ReceiptsService.name);

    constructor(
        private prisma: PrismaService,
        private readonly producerService: ProducerService
    ) { }

    async sendToProcessing(urlSefaz: string, userId: string) {
        const serviceName = 'API-Principal';
        console.log('ReceiptsService.sendToProcessing called with:', { urlSefaz, userId });
        // 1. Verificação de Duplicidade
        const receiptExists = await this.prisma.receipts.findFirst({
            where: { url_sefaz: urlSefaz },
        });

        if (receiptExists) {
            this.logger.warn({
                message: 'Tentativa de processar nota duplicada',
                context: {
                    transactionId: receiptExists.id,
                    userId,
                    nfeUrl: urlSefaz,
                    serviceName
                }
            });
            return { message: 'Nota já processada ou em processamento', id: receiptExists.id };
        }

        try {
            // 2. Criação do Registro
            const receipt = await this.prisma.receipts.create({
                data: {
                    url_sefaz: urlSefaz,
                    userId: userId,
                    status: 'PENDING',
                },
            });

            const receiptId = receipt.id;

            try {
                // 3. Envio para a Fila (Upstash)
                // await this.qstashService.publishReceipt({
                //     transactionId: transactionId, // Alinhado com a diretriz de rastreio
                //     userId: userId,
                //     url: urlSefaz,
                // })

                await this.producerService.enqueueReceipt({
                    receiptId: receiptId, // Alinhado com a diretriz de rastreio
                    userId: userId,
                    url: urlSefaz,
                    uf: 'GO', // TODO: Extrair UF dinamicamente da URL ou do conteúdo da nota
                });

                return { message: 'Nota enviada para processamento', id: receiptId };

            } catch (error) {
                // Erro no envio para a fila
                this.logger.error({
                    message: 'Falha ao enviar para fila de processamento',
                    receiptId,
                    userId,
                    serviceName,
                    errorCode: error.status || 500,
                    errorMessage: error.message,
                    stackTrace: error.stack,
                    requestPayload: { url: urlSefaz, receiptId: receiptId }
                });

                await this.prisma.receipts.update({
                    where: { id: receiptId },
                    data: { status: 'ERROR' }
                });

                throw new InternalServerErrorException('Erro ao agendar processamento da nota.');
            }
        } catch (dbError) {
            // Falha crítica no banco (Supabase)
            this.logger.error({
                message: 'Erro fatal ao criar registro no banco de dados',
                context: {
                    userId,
                    nfeUrl: urlSefaz,
                    serviceName,
                    errorMessage: dbError.message,
                    stackTrace: dbError.stack
                }
            });
            throw new HttpException('Erro ao processar nota fiscal no servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}