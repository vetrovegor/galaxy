import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAddressDTO {
    @ApiProperty({
        example: 'Ленина 24'
    })
    @IsString()
    street: string;

    @ApiProperty({
        example: 2
    })
    @IsNumber()
    floor: number;

    @ApiProperty({
        example: 8
    })
    @IsPositive()
    flat: number;
}
