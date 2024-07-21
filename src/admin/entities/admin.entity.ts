import { Exclude } from 'class-transformer';
import { CoreEntity } from 'src/app/entities/core.entity';
import { Role } from 'src/roles/enums/role.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'AdminUser' })
export class AdminUser extends CoreEntity {
  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'simple-array', nullable: false })
  roles: Role[];
}
