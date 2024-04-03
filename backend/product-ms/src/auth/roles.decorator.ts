import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.guard';
import { JwtPayload } from './types';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()]
            );

            if (!requiredRoles) {
                return true;
            }

            const req = context.switchToHttp().getRequest();

            const { authorization } = req.headers;

            if (!authorization || !authorization.startsWith('Bearer')) {
                throw new UnauthorizedException();
            }

            const token = authorization.split(' ')[1];

            if (!token) {
                throw new UnauthorizedException();
            }

            console.log({ token });

            const user: JwtPayload = this.jwtService.verify(token);

            console.log({ user });

            if (user.isBanned) {
                throw new ForbiddenException();
            }

            return user.roles.some((role) => requiredRoles.includes(role));
        } catch (error) {
            throw new ForbiddenException();
        }
    }
}
