import { ApiProperty } from "@nestjs/swagger";
import { User } from "@user/user.emtity";

export class AuthResponse {
    @ApiProperty({ description: 'Пользователь' })
    user: User;

    @ApiProperty({ description: 'Токен доступа', example: 'token' })
    accessToken: string;
}