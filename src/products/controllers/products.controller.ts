import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SupabaseGuard } from '../../auth/supabase.guard';
import { UpdateRawProductsDto } from '../dto/update-productRaw';
import { UpdateCatalogProductsDto } from '../dto/update-productCatalog';
import { CreateCatalogProductDto } from '../dto/create-productCatalog';
import { FindProductsUseCase } from '../use-cases/find-products.usecase';
import { UpdateCatalogProductsUseCase } from '../use-cases/update-catalog-products.usecase';
import { FindUnlinkedRawProductsUseCase } from '../use-cases/find-unlinked-raw-products.usecase';
import { UpdateRawProductsUseCase } from '../use-cases/update-raw-products.usecase';
import { CreateCatalogProductUseCase } from '../use-cases/create-catalog-product.usecase';

@Controller('products')
@UseGuards(SupabaseGuard)
export class ProductsController {

    constructor(
        private readonly findProductsUseCase: FindProductsUseCase,
        private readonly createCatalogProductUseCase: CreateCatalogProductUseCase,
        private readonly updateCatalogProductsUseCase: UpdateCatalogProductsUseCase,
        private readonly findUnlinkedRawProductsUseCase: FindUnlinkedRawProductsUseCase,
        private readonly updateRawProductsUseCase: UpdateRawProductsUseCase,
    ) { }

    @Get()
    async findAllProducts(@Query('page') page?: string) {
        const pageNumber = Math.max(1, Number(page) || 1);
        return this.findProductsUseCase.execute(pageNumber);
    }

    @Post()
    async createProduct(@Body() dto: CreateCatalogProductDto) {
        return this.createCatalogProductUseCase.execute(dto);
    }

    @Patch('')
    async updateProducts(@Body() dto: UpdateCatalogProductsDto) {
        return this.updateCatalogProductsUseCase.execute(dto);
    }

    @Get('RawProducts')
    async findUnlinkedRawProducts(@Query('page') page?: string) {
        const pageNumber = Math.max(1, Number(page) || 1);
        return this.findUnlinkedRawProductsUseCase.execute(pageNumber);
    }

    @Patch('RawProducts')
    async updateRawProducts(@Body() dto: UpdateRawProductsDto) {
        return this.updateRawProductsUseCase.execute(dto);
    }
}
