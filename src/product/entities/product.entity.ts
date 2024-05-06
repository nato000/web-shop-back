import { Entity, Column, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Category } from 'src/category/entities/category.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';

@Entity({ name: 'Product' })
export class Product extends CoreEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  picture: string;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products)
  manufacturer: Manufacturer;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
