import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema()
export class Brand extends Document {
    @ApiProperty({
        example: 'Samsung'
    })
    @Prop()
    name: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
