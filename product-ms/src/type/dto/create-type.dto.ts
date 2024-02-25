import { IsArray, IsString } from "class-validator";

export class CreateTypeDTO {
    @IsString()
    name: string;

    @IsArray()
    @IsString({ each: true })
    characteristics: string[];
}