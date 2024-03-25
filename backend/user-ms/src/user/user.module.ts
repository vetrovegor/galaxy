import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.emtity";
import { STRATEGIES } from "@auth/strategies";
import { MailModule } from "@mail/mail.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SHOPPING_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RNQ_URL')}`],
            queue: 'shopping-queue',
            queueOptions: { durable: false }
          }
        }),
        inject: [ConfigService]
      }
    ]),
    TypeOrmModule.forFeature([User]),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, ...STRATEGIES],
  exports: [UserService],
})
export class UserModule {}
