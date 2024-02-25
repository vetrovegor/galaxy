import { IsString } from "class-validator";

export class CreateBrandDTO {
    @IsString()
    name: string;
}