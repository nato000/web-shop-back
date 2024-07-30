// src/order/entities/order-item.entity.ts
import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from './order.entity';

@Table({ tableName: 'order_items' })
export class OrderItem extends CoreEntity {
  @Column({ allowNull: false })
  quantity: number;

  @ForeignKey(() => Product)
  @Column
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Order)
  @Column
  orderId: string;

  @BelongsTo(() => Order)
  order: Order;
}
