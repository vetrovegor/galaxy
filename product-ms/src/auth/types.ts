export type JwtPayload = {
    id: string;
    nickname: string;
    email: string;
    roles: string[];
    isBanned: boolean;
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}