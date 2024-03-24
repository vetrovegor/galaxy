import { User } from '@user/user.emtity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity({
    name: 'tokens'
})
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;

    @Column({
        name: 'expiration_date',
        type: 'timestamp'
    })
    expirationDate: Date;

    @Column({
        name: 'user_agent'
    })
    userAgent: string;

    @ManyToOne(() => User, (user) => user.tokens, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'user_id'
    })
    user: User;
}
