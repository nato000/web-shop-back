import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Client } from 'src/client/entities/client.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'Order' })
export class Order extends CoreEntity {
  @Column({ type: 'varchar', nullable: false })
  status: string;

  @ManyToOne(() => Client, (client) => client.orders)
  client: Client;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: Relation<OrderItem[]>;

  @Column({ type: 'varchar', nullable: true })
  total: string;
}
