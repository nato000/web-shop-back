import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
export abstract class CoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string = uuidv4();

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'create_at' })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'update_at' })
  public updateAt: Date;
}
