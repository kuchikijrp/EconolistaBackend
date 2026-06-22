import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseUseCase } from '../../common/use-cases/base.usecase';
import { MemoryLogger } from '../../common/logger/memory.logger';
import { AppExceptionService } from '../../common/exceptions/app-exception.service';
import { UpdateRawProductsDto } from '../dto/update-productRaw';

@Injectable()
export class UpdateRawProductsUseCase extends BaseUseCase<UpdateRawProductsDto, any> {
  constructor(
    logger: MemoryLogger,
    exceptionService: AppExceptionService,
    private readonly prisma: PrismaService,
  ) {
    super(logger, exceptionService, 'Products');
  }

  async execute(dto: UpdateRawProductsDto) {
    const { productRawIds, productId } = dto;

    const uniqueRawIds = [...new Set(productRawIds)];

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!product) {
      this.throwNotFound('Product not found', { productId });
    }

    const productRaws = await this.prisma.productRaw.findMany({
      where: {
        id: {
          in: uniqueRawIds,
        },
      },
      select: {
        id: true,
        productId: true,
      },
    });

    const foundIds = new Set(
      productRaws.map(raw => raw.id),
    );

    const missingIds = uniqueRawIds.filter(
      id => !foundIds.has(id),
    );

    const alreadyLinkedIds = productRaws
      .filter(raw => raw.productId === productId)
      .map(raw => raw.id);

    const idsToUpdate = productRaws
      .filter(raw => raw.productId !== productId)
      .map(raw => raw.id);

    let updatedCount = 0;

    if (idsToUpdate.length > 0) {
      const result = await this.prisma.productRaw.updateMany({
        where: {
          id: {
            in: idsToUpdate,
          },
        },
        data: {
          productId,
        },
      });

      updatedCount = result.count;
    }

    this.log('Bulk ProductRaw update completed', {
      productId,
      requestedCount: uniqueRawIds.length,
      updatedCount,
      alreadyLinkedCount: alreadyLinkedIds.length,
      missingCount: missingIds.length,
    });

    if (missingIds.length > 0) {
      this.warn('Some ProductRaw records were not found', {
        productId,
        missingIds,
      });
    }

    return {
      productId,
      requestedCount: uniqueRawIds.length,
      updatedCount,
      alreadyLinkedIds,
      missingIds,
    };
  }
}
