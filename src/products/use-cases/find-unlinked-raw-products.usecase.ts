import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseUseCase } from '../../common/use-cases/base.usecase';
import { MemoryLogger } from '../../common/logger/memory.logger';
import { AppExceptionService } from '../../common/exceptions/app-exception.service';

const PAGE_SIZE = 30;

@Injectable()
export class FindUnlinkedRawProductsUseCase extends BaseUseCase<number, any> {
  constructor(
    logger: MemoryLogger,
    exceptionService: AppExceptionService,
    private readonly prisma: PrismaService,
  ) {
    super(logger, exceptionService, 'Products');
  }

  async execute(page = 1) {
    const skip = (page - 1) * PAGE_SIZE;

    const [total, data] = await Promise.all([
      this.prisma.productRaw.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prisma.productRaw.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          product: true,
        },
        orderBy: [
          {
            productId: {
              sort: 'asc',
              nulls: 'first',
            },
          },
          {
            product: {
              name: 'asc',
            },
          },
          {
            rawName: 'asc',
          },
        ],
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        perPage: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
        hasNextPage: skip + data.length < total,
      },
    };
  }
}
