import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RegisterDTO } from "../auth/dto/register-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "./user.emtity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findById(id: string) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmailOrNickname(nickname: string, email?: string) {
    return await this.userRepository.findOne({
      where: [
        { nickname },
        { email }
      ],
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

  async setUserBannedStatus(userId: string, adminId: string, status: boolean) {
    if (userId === adminId) {
      throw new BadRequestException("Нельзя забанить/разбанить самого себя");
    }

    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException("Пользовтель не найден");
    }

    if (user.roles.includes(Role.ADMIN)) {
      throw new BadRequestException(
        "Нельзя забанить/разбанить другого администратора"
      );
    }

    user.isBanned = status;

    return await this.userRepository.save(user);
  }

  async getPreview(userId: string) {
    const { id, nickname } = await this.findById(userId);

    return {
      id,
      nickname
    };
  }
}
