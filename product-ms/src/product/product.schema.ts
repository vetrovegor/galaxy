import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as path from 'path'
import * as fs from 'fs';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  model: string;

  @Prop()
  price: number;

  @Prop()
  picture: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Type' })
  type: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Brand' })
  brand: string;

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