import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { OrderModule } from 'src/order/order.module';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Manufacturer,
      Order,
      OrderItem,
    ]),
    forwardRef(() => OrderModule),
    ManufacturerModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
