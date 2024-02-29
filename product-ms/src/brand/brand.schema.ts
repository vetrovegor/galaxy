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