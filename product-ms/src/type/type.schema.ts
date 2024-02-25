import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductSchema } from '@product/product.schema';
import { HydratedDocument } from 'mongoose';

export type TypeDocument = HydratedDocument<Type>;

@Schema()
export class Type {
  @Prop()
  name: string;

  @Prop({ type: [{ type: String }] })
  characteristics: string[];
}

export const TypeSchema = SchemaFactory.createForClass(Type);

TypeSchema.pre('deleteOne', async function (next) {
  const typeId = this.getQuery()._id;

  const productModel = this.model.db.model(
    'Product',
    ProductSchema
  );

  await productModel.deleteMany({ type: typeId });

  next();
});