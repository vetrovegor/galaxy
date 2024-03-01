import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ProductSchema } from '@product/product.schema';
import { Document, HydratedDocument } from 'mongoose';

export type TypeDocument = HydratedDocument<Type>;

@Schema()
export class Type extends Document {
  @ApiProperty({
    example: 'Samsung'
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: ['Диагональ экрана']
  })
  @Prop({ type: [{ type: String }] })
  characteristics: string[];
}

export const TypeSchema = SchemaFactory.createForClass(Type);