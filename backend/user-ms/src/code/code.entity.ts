import { User } from '@user/user.emtity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

export enum CodeTypes {
    VERIFICATION = 'VERIFICATION',
    RECOVERY = 'RECOVERY'
}

@Entity({
    name: 'codes'
})
export class Code {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column({
        type: 'enum',
        enum: CodeTypes,
        enumName: 'code_type'
    })
    type: CodeTypes;

    @ManyToOne(() => User, (user) => user.codes, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'user_id'
    })
    user: User;
}
