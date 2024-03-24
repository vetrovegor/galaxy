import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateTypeDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsString({ each: true })
    characteristics: string[];
}