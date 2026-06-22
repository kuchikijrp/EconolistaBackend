import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateReceiptDto {
  @IsUrl({}, { message: 'A URL da SEFAZ é inválida' })
  @IsNotEmpty({ message: 'A URL da nota é obrigatória' })
  url_sefaz: string;
}
