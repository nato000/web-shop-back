import { Table, Column, HasMany } from 'sequelize-typescript';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Order } from 'src/order/entities/order.entity';
import { Role } from 'src/roles/enums/role.enum';

@Table({ tableName: 'clients' })
export class Client extends CoreEntity {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  surname: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column
  imagePath: string;

  @Column('bytea')
  imageData: Buffer;

  @HasMany(() => Order)
  orders: Order[];

  @Column({
    type: 'varchar', // Consider using 'jsonb' or array type if supported
    get() {
      return (this.getDataValue('roles')?.split(';') as Role[]) || [];
    },
    set(val: Role[]) {
      this.setDataValue('roles', val.join(';'));
    },
  })
  roles: Role[];
}
