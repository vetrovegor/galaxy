import { ApiProperty } from "@nestjs/swagger";

export class RefreshResponse {
    @ApiProperty({ description: 'Токен доступа', example: 'token' })
    accessToken: string;
}