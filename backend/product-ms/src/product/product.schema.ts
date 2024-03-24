import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as path from 'path'
import * as fs from 'fs';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @ApiProperty({
    example: 'Apple iPhone 15 PRO MAX'
  })
  @Prop()
  model: string;

  @ApiProperty({
    example: 100000
  })
  @Prop()
  price: number;

  @Prop()
  picture: string;

  @ApiProperty({
    example: 'type'
  })
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Type' })
  type: string;

  @ApiProperty({
    example: 'brand'
  })
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Brand' })
  brand: string;

  @ApiProperty({
    example: [{ characteristic: 'Разрешение экрана', value: '1920x1080' }]
  })
  @Prop([{ characteristic: String, value: String }])
  characteristics: { characteristic: string; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('deleteOne', async function (next) {
  const productId = this.getQuery()._id;
  const product = await this.model.findById(productId);

  const staticPath = path.resolve(__dirname, '..', 'static');
  const filePath = path.resolve(staticPath, product.picture);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  next();
});