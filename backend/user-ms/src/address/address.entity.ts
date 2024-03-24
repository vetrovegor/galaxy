import { User } from '@user/user.emtity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity({
    name: 'addresses'
})
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    street: string;

    @Column()
    floor: number;

    @Column()
    flat: number;

    @ManyToOne(() => User, (user) => user.addresses, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'user_id'
    })
    user: User;
}
