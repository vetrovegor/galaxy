import { Transform } from "class-transformer";
import { IsNumber, IsString, Length } from "class-validator";

export class CreateCommentDTO {
    @Transform(({ value }) => Number(value))
    @IsNumber()
    reviewId: number;

    @IsString()
    @Length(5)
    comment: string;
}