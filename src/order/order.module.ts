import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/entities/client.entity';
import { ClientService } from 'src/client/client.service';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Client]),
    TypeOrmModule.forFeature([Product]),
    ProductModule,
    CategoryModule,
    ManufacturerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, ClientService, ProductService],
})
export class OrderModule {}
