import { CoreEntity } from 'src/app/entities/core.entity';
import { Client } from 'src/client/entities/client.entity';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'Order' })
export class Order extends CoreEntity {
  @Column({ type: 'varchar', nullable: false })
  status: string;

  @ManyToOne(() => Client, (client) => client.orders)
  client: Client;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable({
    name: 'order_product', // Specify the name of the join table
    joinColumn: {
      name: 'order_id', // Specify the name of the column referencing the Order entity
    },
    inverseJoinColumn: {
      name: 'product_id', // Specify the name of the column referencing the Product entity
    },
  })
  products: Product[];

  @Column({ type: 'varchar', nullable: true })
  total: string;
}
