import { Entity, Column, ManyToOne, Relation } from 'typeorm';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from './order.entity';

@Entity({ name: 'OrderItem' })
export class OrderItem extends CoreEntity {
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Relation<Order>;
}
