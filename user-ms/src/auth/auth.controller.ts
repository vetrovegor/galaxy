import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Res
} from '@nestjs/common';
import { AuthDTO as AuthDTO } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { Cookie, Public, UserAgent } from '@common/decorators';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

const REFRESH_TOKEN = 'refresh-token';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @Post('register')
    async register(
        @Body()
        dto: AuthDTO,
        @UserAgent()
        userAgent: string,
        @Res()
        res: Response
    ) {
        const { user, accessToken, refreshToken } =
            await this.authService.register(dto, userAgent);

        res.cookie(REFRESH_TOKEN, refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        res.json({
            user,
            accessToken
        });
    }

    @Post('login')
    async login(
        @Body()
        dto: AuthDTO,
        @UserAgent()
        userAgent: string,
        @Res()
        res: Response
    ) {
        const { user, accessToken, refreshToken } =
            await this.authService.login(dto, userAgent);

        res.cookie(REFRESH_TOKEN, refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        res.json({
            user,
            accessToken
        });
    }

    @Get('verify/:code')
    async verify(
        @Param('code', ParseUUIDPipe)
        code,
        @Res()
        res: Response
    ) {
        await this.authService.verify(code);

        res.redirect(this.configService.get('CLIENT_URL'));
    }

    @Get('refresh')
    async refresh(
        @Cookie(REFRESH_TOKEN)
        refreshToken,
        @UserAgent()
        userAgent: string,
        @Res()
        res: Response
    ) {
        const tokens = await this.authService.refresh(refreshToken, userAgent);

        res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        res.json({
            accessToken: tokens.accessToken
        });
    }

    @Get('logout')
    async logout(
        @Cookie(REFRESH_TOKEN)
        refreshToken,
        @Res()
        res: Response
    ) {
        await this.authService.logout(refreshToken);

        res.clearCookie(REFRESH_TOKEN);

        res.sendStatus(HttpStatus.OK);
    }
}
