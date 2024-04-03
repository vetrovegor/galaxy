import { Column, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'basket',
    timestamps: false
})
export class Basket extends Model {
    @Column
    quantity: number;

    @Column({ field: 'user_id' })
    userId: string;

    @Column({ field: 'product_id' })
    productId: string;
}
