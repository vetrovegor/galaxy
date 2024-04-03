import { OrderProduct } from '@order-product/order-product.entity';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'order',
    timestamps: false
})
export class Order extends Model {
    @Column
    tracking: string;

    @Column
    date: Date;

    @Column({ field: 'user_id' })
    userId: string;

    @Column
    street: string;

    @Column
    floor: number;

    @Column
    flat: number;

    @HasMany(() => OrderProduct)
    products: OrderProduct[];
}
