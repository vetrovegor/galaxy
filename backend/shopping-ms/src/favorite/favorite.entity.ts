import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'favorites',
  timestamps: false
})
export class Favorite extends Model {
  @Column({ field: 'user_id' })
  userId: string;

  @Column({ field: 'product_id' })
  productId: string;
}