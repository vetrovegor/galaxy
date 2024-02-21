import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto/register-user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { CodeService } from '@code/code.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@user/user.emtity';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { MoreThan, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { addDays } from 'date-fns';
import { MailService } from '@mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly codeService: CodeService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService,
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>
    ) {}

    async register(dto: AuthDTO, userAgent: string) {
        const { email, password } = dto;

        const existedUser = await this.userService.findByEmail(email);

        if (existedUser) {
            throw new ConflictException(
                'Пользователь с таким email уже существует'
            );
        }

        const hashedPassword = hashSync(password, 3);

        const user = await this.userService.createUser({
            email,
            password: hashedPassword
        });

        const code = await this.codeService.createVerificationCode(user);

        await this.mailService.sendVerificationMail(email, code);

        const { accessToken, refreshToken } = await this.generateTokens(
            user,
            userAgent
        );

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    async login(dto: AuthDTO, userAgent: string) {
        const { email, password } = dto;

        const existedUser = await this.userService.findByEmail(email);

        if (!existedUser || !compareSync(password, existedUser.password)) {
            throw new UnauthorizedException('Неверная почта или пароль');
        }

        const { accessToken, refreshToken } = await this.generateTokens(
            existedUser,
            userAgent
        );

        return {
            user: existedUser,
            accessToken,
            refreshToken
        };
    }

    async refresh(refreshToken: string, userAgent: string) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const tokenData = await this.tokenRepository.findOne({
            where: {
                token: refreshToken
            },
            relations: ['user']
        });

        if (!tokenData) {
            throw new UnauthorizedException();
        }

        return await this.generateTokens(tokenData.user, userAgent);
    }

    async logout(refreshToken: string) {
        return await this.tokenRepository.delete({
            token: refreshToken
        });
    }

    async generateTokens(user: User, userAgent: string) {
        const { id, email, roles } = user;

        const accessToken = this.jwtService.sign({
            id,
            email,
            roles
        });
        const refreshToken = v4();

        const currentDate = new Date();
        const expirationDate = addDays(currentDate, 1);

        const existedToken = await this.tokenRepository.findOne({
            where: {
                user,
                userAgent,
                expirationDate: MoreThan(currentDate)
            }
        });

        if (!existedToken) {
            const token = this.tokenRepository.create({
                token: refreshToken,
                expirationDate,
                userAgent,
                user
            });

            await this.tokenRepository.save(token);
        } else {
            existedToken.token = refreshToken;
            existedToken.expirationDate = expirationDate;

            await this.tokenRepository.save(existedToken);
        }

        return {
            accessToken,
            refreshToken
        };
    }

    async verify(code: string) {
        const codeData = await this.codeService.validateVerificationCode(code);

        if (!codeData) {
            throw new BadRequestException();
        }

        return await this.userService.verifyUser(codeData.user);
    }
}
