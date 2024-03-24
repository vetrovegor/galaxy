import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateReviewDTO {
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(5)
    rate: number;

    @IsString()
    @IsNotEmpty()
    advantages: string;

    @IsString()
    @IsNotEmpty()
    disadvantages: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsString()
    @IsNotEmpty()
    productId: string;
}