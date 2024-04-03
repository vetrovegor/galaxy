import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { RegisterDTO } from '../auth/dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './user.emtity';
import { Repository } from 'typeorm';
import { MailService } from '@mail/mail.service';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMqService } from '@rabbit-mq/rabbit-mq.service';

@Injectable()
export class UserService {
    constructor(
        @Inject('SHOPPING_SERVICE')
        private readonly shoppingClient: ClientProxy,
        private readonly rabbitMqService: RabbitMqService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService
    ) {}
    async sendVerifyCode(id: string) {
        const user = await this.findById(id);

        if (user.isVerified) {
            throw new BadRequestException('Пользователь верифицирован');
        }

        this.mailService.sendVerificationMail(user);
    }

    async findAll() {
        return await this.userRepository.find();
    }

    async findById(id: string) {
        return await this.userRepository.findOne({
            where: {
                id
            }
        });
    }

    async createShortInfo(user: User) {
        delete user.password;

        // вынести в shoppingService
        const favorites = await this.rabbitMqService.sendRequest({
            client: this.shoppingClient,
            pattern: 'get_favorites',
            data: { userId: user.id }
        });

        const bakset = await this.rabbitMqService.sendRequest({
            client: this.shoppingClient,
            pattern: 'get_basket',
            data: { userId: user.id }
        });

        return { user, favorites, bakset };
    }

    async me(id: string) {
        const user = await this.findById(id);
        return await this.createShortInfo(user);
    }

    async findByEmailOrNickname(nickname: string, email?: string) {
        return await this.userRepository.findOne({
            where: [{ nickname }, { email }]
        });
    }

    async createUser(dto: RegisterDTO) {
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async verifyUser(user: User) {
        user.isVerified = true;
        return await this.userRepository.save(user);
    }

    async setUserBannedStatus(
        userId: string,
        adminId: string,
        status: boolean
    ) {
        if (userId === adminId) {
            throw new BadRequestException(
                'Нельзя забанить/разбанить самого себя'
            );
        }

        const user = await this.findById(userId);

        if (!user) {
            throw new NotFoundException('Пользовтель не найден');
        }

        if (user.roles.includes(Role.ADMIN)) {
            throw new BadRequestException(
                'Нельзя забанить/разбанить другого администратора'
            );
        }

        user.isBanned = status;

        return await this.userRepository.save(user);
    }

    async getPreview(userId: string) {
        try {
            const { id, nickname } = await this.findById(userId);

            return {
                id,
                nickname
            };
        } catch (error) {
            return null;
        }
    }
}
