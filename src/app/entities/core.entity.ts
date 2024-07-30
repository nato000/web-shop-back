// src/app/entities/core.entity.ts
import {
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export abstract class CoreEntity extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
