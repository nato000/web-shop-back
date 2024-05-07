import { Exclude } from 'class-transformer';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'Client' })
export class Client extends CoreEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  surname: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  imagePath: string;

  @Exclude()
  @Column({ type: 'bytea', nullable: true })
  imageData: Buffer;

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];
}
