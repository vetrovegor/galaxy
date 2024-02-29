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