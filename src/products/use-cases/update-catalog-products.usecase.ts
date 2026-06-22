import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseUseCase } from '../../common/use-cases/base.usecase';
import { MemoryLogger } from '../../common/logger/memory.logger';
import { AppExceptionService } from '../../common/exceptions/app-exception.service';
import { UpdateCatalogProductsDto } from '../dto/update-productCatalog';
import { UpdateCatalogItemDto } from '../dto/update-productCatalogItem';

@Injectable()
export class UpdateCatalogProductsUseCase extends BaseUseCase<UpdateCatalogProductsDto, any> {
  constructor(
    logger: MemoryLogger,
    exceptionService: AppExceptionService,
    private readonly prisma: PrismaService,
  ) {
    super(logger, exceptionService, 'Products');
  }

  async execute(dto: UpdateCatalogProductsDto) {
    const uniqueProducts = [
      ...new Map(
        dto.products.map(item => [item.id, item]),
      ).values(),
    ];

    const ids = uniqueProducts.map(item => item.id);

    const existingProducts = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const existingMap = new Map(
      existingProducts.map(product => [
        product.id,
        product,
      ]),
    );

    const missingIds: string[] = [];
    const skippedIds: string[] = [];
    const updates: UpdateCatalogItemDto[] = [];

    for (const item of uniqueProducts) {
      const existing = existingMap.get(item.id);

      if (!existing) {
        missingIds.push(item.id);
        continue;
      }

      const { id, ...data } = item;

      const hasChanges = Object.entries(data).some(
        ([key, value]) =>
          value !== undefined &&
          (existing as any)[key] !== value,
      );

      if (!hasChanges) {
        skippedIds.push(id);
        continue;
      }

      updates.push(item);
    }

    const duplicatedEans = await this.validateDuplicateEans(updates);

    const validUpdates = updates.filter(
      update => !duplicatedEans.includes(update.id),
    );

    const result = await this.prisma.$transaction(
      validUpdates.map(({ id, ...data }) =>
        this.prisma.product.update({
          where: { id },
          data,
        }),
      ),
    );

    this.log('Bulk catalog update completed', {
      requestedCount: uniqueProducts.length,
      updatedCount: result.length,
      skippedCount: skippedIds.length,
      missingCount: missingIds.length,
      duplicatedEanCount: duplicatedEans.length,
    });

    return {
      requestedCount: uniqueProducts.length,
      updatedCount: result.length,
      skippedIds,
      missingIds,
      duplicatedEanIds: duplicatedEans,
    };
  }

  private async validateDuplicateEans(
    products: UpdateCatalogItemDto[],
  ): Promise<string[]> {
    const duplicatedIds: string[] = [];

    const eans = products
      .filter(product => product.ean)
      .map(product => product.ean!);

    if (!eans.length) {
      return duplicatedIds;
    }

    const existing = await this.prisma.product.findMany({
      where: {
        ean: {
          in: eans,
        },
      },
      select: {
        id: true,
        ean: true,
      },
    });

    const eanMap = new Map(
      existing.map(item => [item.ean, item.id]),
    );

    for (const product of products) {
      if (!product.ean) {
        continue;
      }

      const ownerId = eanMap.get(product.ean);

      if (ownerId && ownerId !== product.id) {
        duplicatedIds.push(product.id);

        this.warn('EAN already in use', {
          productId: product.id,
          ean: product.ean,
          ownerId,
        });
      }
    }

    return duplicatedIds;
  }
}
