// src/manufacturer/entities/manufacturer.entity.ts
import { Table, Column, HasMany } from 'sequelize-typescript';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Product } from 'src/product/entities/product.entity';

@Table({ tableName: 'manufacturers' })
export class Manufacturer extends CoreEntity {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @HasMany(() => Product)
  products: Product[];
}
