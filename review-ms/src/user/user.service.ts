import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMqService } from '@rabbit-mq/rabbit-mq.service';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        private readonly rabbitMqService: RabbitMqService
    ) { }

    async getById(userId: string) {
        return await this.rabbitMqService.sendRequest({
            client: this.userClient,
            pattern: 'get_user',
            data: { userId }
        });
    }
}
