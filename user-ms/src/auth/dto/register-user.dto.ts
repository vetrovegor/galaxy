import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDTO {
    @IsEmail(
        {},
        {
            message: 'Некорректный email'
        }
    )
    email: string;

    @IsString({
        message: 'Пароль должен быть строкой'
    })
    @Length(4, 16, {
        message: 'Пароль должен быть от 4 до 16 символов'
    })
    password: string;
}
