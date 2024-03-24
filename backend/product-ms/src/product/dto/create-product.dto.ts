import { IsArray, IsNotEmpty, IsPositive, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsExists } from "@shared/validation/is-exists.decorator";
import { IsObjectId } from "@shared/validation/is-object-id.decorator";

export class CharacteristicDto {
    @IsString()
    characteristic: string;

    @IsNotEmpty()
    value: string;
}

export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    model: string;
    
    @IsString()
    @IsNotEmpty()
    desc: string;

    @IsPositive()
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    price: number;

    @IsObjectId()
    @IsExists({ model: 'Type', column: '_id' })
    type: string;

    @IsObjectId()
    @IsExists({ model: 'Brand', column: '_id' })
    brand: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CharacteristicDto)
    characteristics: { characteristic: string; value: string }[];
}