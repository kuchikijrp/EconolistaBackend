import {
    ArrayMinSize,
    IsArray,
    IsUUID,
} from 'class-validator';

export class UpdateRawProductsDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    productRawIds!: string[];

    @IsUUID()
    productId!: string;
}