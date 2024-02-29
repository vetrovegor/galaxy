import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDTO {
    @IsString({
        message: 'Никнейм должен быть строкой'
    })
    @Length(3, 24, {
        message: 'Никнейм должен быть от 3 до 24 символов'
    })
    nickname: string;

    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @IsString({
        message: 'Пароль должен быть строкой'
    })
    @Length(4, 16, {
        message: 'Пароль должен быть от 4 до 16 символов'
    })
    password: string;
}
