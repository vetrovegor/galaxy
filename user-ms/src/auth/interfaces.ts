export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    id: string;
    nickname: string;
    email: string;
    roles: string[];
    isBanned: boolean;
}
