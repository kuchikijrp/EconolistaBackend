import {
    ArrayMinSize,
    IsArray,
    ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { UpdateCatalogItemDto } from './update-productCatalogItem';

export class UpdateCatalogProductsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => UpdateCatalogItemDto)
    products!: UpdateCatalogItemDto[];
}