import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.emtity";
import { STRATEGIES } from "@auth/strategies";
import { MailModule } from "@mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, ...STRATEGIES],
  exports: [UserService],
})
export class UserModule {}
