import { Entity, Column, ManyToOne, ManyToMany } from 'typeorm';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Category } from 'src/category/entities/category.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';

@Entity({ name: 'Product' })
export class Product extends CoreEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imagePath: string;

  @Column({ type: 'varchar', nullable: false })
  currency: string;

  @Column({ type: 'numeric', nullable: false })
  price: number;

  @Exclude()
  @Column({ type: 'bytea', nullable: true })
  imageData: Buffer;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products)
  manufacturer: Manufacturer;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
