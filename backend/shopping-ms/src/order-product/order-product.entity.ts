import { Order } from '@order/order.entity';
import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';

@Table({
    tableName: 'order-product',
    timestamps: false
})
export class OrderProduct extends Model {
    @Column
    model: string;

    @Column
    picture: string;

    @Column
    price: number;

    @Column
    quantity: number;

    @Column({ field: 'product_id' })
    productId: string;

    @ForeignKey(() => Order)
    @Column({ field: 'order_id' })
    orderId: number;

    @BelongsTo(() => Order)
    order: Order;
}
