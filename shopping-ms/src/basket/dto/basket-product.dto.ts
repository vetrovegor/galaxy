import { IsNotEmpty, IsString } from "class-validator";

export class BasketProductDto {
    @IsString()
    @IsNotEmpty()
    productId: string;
}