import { Address } from '@address/address.entity';
import { Token } from '@auth/token.entity';
import { Code } from '@code/code.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nickname: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        name: 'is_verified',
        default: false
    })
    isVerified: boolean;

    @Column({
        name: 'is_banned',
        default: false
    })
    isBanned: boolean;

    @Column({
        type: 'enum',
        enum: Role,
        array: true,
        default: [Role.USER],
        enumName: 'role'
    })
    roles: Role[];

    @OneToMany(() => Code, (code) => code.user, {
        cascade: true
    })
    codes: Code[];

    @OneToMany(() => Token, (token) => token.user, {
        cascade: true
    })
    tokens: Token[];

    @OneToMany(() => Address, (address) => address.user, {
        cascade: true
    })
    addresses: Address[];
}
