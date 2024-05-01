import { Entity, Column } from 'typeorm';
import { CoreEntity } from 'src/app/entities/core.entity';

@Entity({ name: 'Product' })
export class Product extends CoreEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  picture: string;
}
