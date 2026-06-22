import {
    IsBoolean,
    isEAN,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

import { STATUSTYPE } from '@prisma/client';
import { IsEAN } from '../../common/validators/is-ean.validator';

export class CreateCatalogProductDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @IsEAN({ message: 'Invalid EAN' })
    ean!: string;

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
