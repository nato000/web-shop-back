import { Product } from './entities/product.entity';
import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

import { OrderModule } from 'src/order/order.module';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { CategoryModule } from 'src/category/category.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => OrderModule),
    ManufacturerModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
