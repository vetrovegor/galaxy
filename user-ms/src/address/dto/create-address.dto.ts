import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateAddressDTO {
    @IsString()
    street: string;

    @IsNumber()
    floor: number;

    @IsPositive()
    flat: number;
}