// src/order/entities/order.entity.ts
import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Client } from 'src/client/entities/client.entity';
import { OrderItem } from './order-item.entity';

@Table({ tableName: 'orders' })
export class Order extends CoreEntity {
  @Column({ allowNull: false })
  status: string;

  @ForeignKey(() => Client)
  @Column
  clientId: string;

  @BelongsTo(() => Client)
  client: Client;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @Column({ allowNull: true })
  total: string;
}
