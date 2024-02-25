export type JwtPayload = {
    id: string;
    email: string;
    roles: string[];
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}