import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FindProductsUseCase } from './use-cases/find-products.usecase';
import { UpdateCatalogProductsUseCase } from './use-cases/update-catalog-products.usecase';
import { FindUnlinkedRawProductsUseCase } from './use-cases/find-unlinked-raw-products.usecase';
import { UpdateRawProductsUseCase } from './use-cases/update-raw-products.usecase';
import { CreateCatalogProductUseCase } from './use-cases/create-catalog-product.usecase';

@Module({
    imports: [PrismaModule],
    controllers: [ProductsController],
    providers: [
        FindProductsUseCase,
        CreateCatalogProductUseCase,
        UpdateCatalogProductsUseCase,
        FindUnlinkedRawProductsUseCase,
        UpdateRawProductsUseCase,
    ],
})
export class ProductsModule { }
