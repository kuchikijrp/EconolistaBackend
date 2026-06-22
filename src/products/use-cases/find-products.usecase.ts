import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseUseCase } from '../../common/use-cases/base.usecase';
import { MemoryLogger } from '../../common/logger/memory.logger';
import { AppExceptionService } from '../../common/exceptions/app-exception.service';

const PAGE_SIZE = 30;

@Injectable()
export class FindProductsUseCase extends BaseUseCase<number, any> {
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
      this.prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prisma.product.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: PAGE_SIZE,
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
