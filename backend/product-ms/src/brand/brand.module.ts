import { Module, forwardRef } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './brand.schema';
import { AuthModule } from '@auth/auth.module';
import { ProductModule } from '@product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    ProductModule,
    AuthModule
  ],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService]
})
export class BrandModule { }