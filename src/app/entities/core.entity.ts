import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class CoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'create_at' })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'update_at' })
  public updateAt: Date;
}
