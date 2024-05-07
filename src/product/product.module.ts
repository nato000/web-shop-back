import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { ManufacturerService } from 'src/manufacturer/manufacturer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Manufacturer]),
  ],
  controllers: [ProductController],
  providers: [ProductService, CategoryService, ManufacturerService],
  exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
