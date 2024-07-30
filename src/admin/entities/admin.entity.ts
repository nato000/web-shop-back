import { Table, Column } from 'sequelize-typescript';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Role } from 'src/roles/enums/role.enum';

@Table({ tableName: 'AdminUser' })
export class AdminUser extends CoreEntity {
  @Column({
    type: 'varchar',
    allowNull: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    allowNull: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    allowNull: false,
  })
  password: string;

  @Column({
    type: 'varchar', // Consider using 'jsonb' or array type if supported
    allowNull: false,
    get() {
      const roles = this.getDataValue('roles');
      return roles ? (roles.split(';') as Role[]) : [];
    },
    set(value: Role[]) {
      this.setDataValue('roles', value.join(';'));
    },
  })
  roles: Role[];
}
