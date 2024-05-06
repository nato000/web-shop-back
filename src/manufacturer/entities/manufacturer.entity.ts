import { CoreEntity } from 'src/app/entities/core.entity';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'Manufacturer' })
export class Manufacturer extends CoreEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];
}
