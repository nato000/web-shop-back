import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  picture: string;
}
