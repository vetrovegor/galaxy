import { Address } from '@address/address.entity';
import { Token } from '@auth/token.entity';
import { Code } from '@code/code.entity';
import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({description: 'Идентификатор', example: '234'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({description: 'Никнейм', example: 'l4ndar'})
    @Column()
    nickname: string;

    @ApiProperty({description: 'Почта', example: 'test@mail.ru'})
    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @ApiProperty({description: 'Верифицирован', example: 'false'})
    @Column({
        name: 'is_verified',
        default: false
    })
    isVerified: boolean;

    @ApiProperty({description: 'Забанен', example: 'false'})
    @Column({
        name: 'is_banned',
        default: false
    })
    isBanned: boolean;

    @ApiProperty({description: 'Роли', example: ['USER']})
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
