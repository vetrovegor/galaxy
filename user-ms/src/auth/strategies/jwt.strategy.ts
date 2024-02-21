import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
    ForbiddenException,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@auth/interfaces';
import { UserService } from '@user/user.service';
import { User } from '@user/user.emtity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: JwtPayload) {
        const user: User = await this.userService.findById(payload.id);

        if (!user) {
            throw new UnauthorizedException();
        }

        if (user.isBanned) {
            throw new ForbiddenException('Пользователь заблокирован');
        }

        return payload;
    }
}
