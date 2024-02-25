import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { Type, TypeSchema } from './type.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '@product/product.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]),
    AuthModule
  ],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService]
})
export class TypeModule {}
