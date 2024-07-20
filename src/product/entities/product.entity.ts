import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Category } from 'src/category/entities/category.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { Exclude } from 'class-transformer';
import { OrderItem } from 'src/order/entities/order-item.entity';

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

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products, {
    onDelete: 'CASCADE',
  })
  manufacturer: Manufacturer;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
    onDelete: 'CASCADE',
  })
  orderItems: OrderItem[];
}
