import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
}