import {
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, Roles } from '@common/decorators';
import { JwtPayload } from '@auth/interfaces';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from './user.emtity';
import { MessagePattern } from '@nestjs/microservices';
import { GetUserRequestDTO } from './dto/get-user-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guards';

@ApiTags('Users')
@ApiBearerAuth()
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    async me(@CurrentUser() user: JwtPayload) {
        return await this.userService.me(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('send-verify-code')
    async sendVerifyCode(@CurrentUser() user: JwtPayload) {
        await this.userService.sendVerifyCode(user.id);
        return HttpStatus.OK;
    }

    // сделать пагинацию
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('ban/:userId')
    async ban(
        @Param('userId', ParseUUIDPipe)
        userId: string,
        @CurrentUser()
        user: JwtPayload
    ) {
        return await this.userService.setUserBannedStatus(
            userId,
            user.id,
            true
        );
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Patch('unban/:userId')
    async unban(
        @Param('userId', ParseUUIDPipe)
        userId: string,
        @CurrentUser()
        user: JwtPayload
    ) {
        return await this.userService.setUserBannedStatus(
            userId,
            user.id,
            false
        );
    }

    @MessagePattern('get_user')
    async getPreview(data: GetUserRequestDTO) {
        return await this.userService.getPreview(data.userId);
    }
}
