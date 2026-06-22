import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseUseCase } from '../../common/use-cases/base.usecase';
import { MemoryLogger } from '../../common/logger/memory.logger';
import { AppExceptionService } from '../../common/exceptions/app-exception.service';
import { CreateCatalogProductDto } from '../dto/create-productCatalog';

@Injectable()
export class CreateCatalogProductUseCase extends BaseUseCase<CreateCatalogProductDto, any> {
  constructor(
    logger: MemoryLogger,
    exceptionService: AppExceptionService,
    private readonly prisma: PrismaService,
  ) {
    super(logger, exceptionService, 'Products');
  }

  async execute(dto: CreateCatalogProductDto) {
    if (dto.ean) {
      const existingByEan = await this.prisma.product.findUnique({
        where: { ean: dto.ean },
        select: { id: true, name: true },
      });

      if (existingByEan) {
        this.throwBadRequest('EAN already in use', {
          ean: dto.ean,
          existingProductId: existingByEan.id,
          existingProductName: existingByEan.name,
        });
      }
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        ean: dto.ean,
        unit: dto.unit,
        brand: dto.brand,
        category: dto.category,
        family: dto.family,
        urlImage: dto.urlImage,
        isofficial: dto.isofficial ?? false,
        status: dto.status,
      },
    });

    this.log('Catalog product created', {
      productId: product.id,
      name: product.name,
      ean: product.ean,
    });

    return product;
  }
}
