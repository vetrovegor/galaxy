import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BasketProductDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}
