import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductSchema } from '@product/product.schema';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema()
export class Brand {
  @Prop()
  name: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre('deleteOne', async function (next) {
  const brandId = this.getQuery()._id;

  const productModel = this.model.db.model(
    'Product',
    ProductSchema
  );

  await productModel.deleteMany({ brand: brandId });

  next();
});