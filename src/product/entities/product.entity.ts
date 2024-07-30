// src/product/entities/product.entity.ts
import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Category } from 'src/category/entities/category.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Table({ tableName: 'products' })
export class Product extends CoreEntity {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column
  imagePath: string;

  @Column({ allowNull: false })
  currency: string;

  @Column({ allowNull: false, type: 'DECIMAL' })
  price: number;

  @Column('bytea')
  imageData: Buffer;

  @ForeignKey(() => Manufacturer)
  @Column
  manufacturerId: string;

  @BelongsTo(() => Manufacturer)
  manufacturer: Manufacturer;

  @ForeignKey(() => Category)
  @Column
  categoryId: string;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
