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

    @Column({ field: 'address_id' })
    addressId: string;

    @HasMany(() => OrderProduct)
    products: OrderProduct[]
}