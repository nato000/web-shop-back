// src/category/entities/category.entity.ts
import { Table, Column, HasMany } from 'sequelize-typescript';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Product } from 'src/product/entities/product.entity';

@Table({ tableName: 'categories' })
export class Category extends CoreEntity {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @HasMany(() => Product)
  products: Product[];
}
