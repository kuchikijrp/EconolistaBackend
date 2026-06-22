import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    MaxLength,
} from 'class-validator';

import { STATUSTYPE } from '@prisma/client';

export class UpdateCatalogItemDto {
    @IsUUID()
    id!: string;

    @IsOptional()
    @IsString()
    @MaxLength(14)
    ean?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    unit?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    brand?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    category?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    family?: string;

    @IsOptional()
    @IsUrl()
    urlImage?: string;

    @IsOptional()
    @IsBoolean()
    isofficial?: boolean;

    @IsOptional()
    @IsEnum(STATUSTYPE)
    status?: STATUSTYPE;
}